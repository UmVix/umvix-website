/**
 * Offline outbox: "Mark as Posted" taps made while offline are queued in
 * IndexedDB and replayed when connectivity returns. The server treats a
 * late-synced post as authoritative (posted wins over missed, flagged
 * `marked_late` when past cutoff) — spec edge case 10.
 */

const DB_NAME = "postpilot-outbox";
const STORE = "actions";

export type OutboxAction = {
  id: string; // logId — one queued action per log
  logId: string;
  postUrl?: string;
  note?: string;
  queuedAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = run(db.transaction(STORE, mode).objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueMarkPosted(action: Omit<OutboxAction, "queuedAt">) {
  const db = await openDb();
  await tx(db, "readwrite", (store) => store.put({ ...action, queuedAt: Date.now() }));
  db.close();
}

export async function pendingOutboxIds(): Promise<Set<string>> {
  try {
    const db = await openDb();
    const all = await tx<OutboxAction[]>(db, "readonly", (store) =>
      store.getAll() as IDBRequest<OutboxAction[]>,
    );
    db.close();
    return new Set(all.map((action) => action.logId));
  } catch {
    return new Set();
  }
}

/** Replay every queued action; keep failures queued for the next attempt. */
export async function flushOutbox(): Promise<number> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return 0;

  let flushed = 0;
  try {
    const db = await openDb();
    const all = await tx<OutboxAction[]>(db, "readonly", (store) =>
      store.getAll() as IDBRequest<OutboxAction[]>,
    );

    for (const action of all) {
      try {
        const response = await fetch("/api/logs/mark-posted", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logId: action.logId,
            postUrl: action.postUrl,
            note: action.note,
          }),
        });
        // 4xx = permanently unprocessable (e.g. log skipped) → drop it too;
        // only network errors / 5xx stay queued.
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          await tx(db, "readwrite", (store) => store.delete(action.id));
          if (response.ok) flushed += 1;
        }
      } catch {
        break; // still offline — try again later
      }
    }
    db.close();
  } catch {
    // IndexedDB unavailable (private browsing) — the online path still works.
  }
  return flushed;
}
