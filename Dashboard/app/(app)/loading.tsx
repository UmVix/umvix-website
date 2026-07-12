/** Instant skeleton while a tab's server data loads. */
export default function AppLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="skeleton h-7 w-32" />
        <div className="skeleton h-4 w-48" />
      </div>
      <div className="space-y-3">
        <div className="skeleton h-[76px] w-full" />
        <div className="skeleton h-[76px] w-full" />
        <div className="skeleton h-[76px] w-full" />
        <div className="skeleton h-[76px] w-full" />
      </div>
    </div>
  );
}
