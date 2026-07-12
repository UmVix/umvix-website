import { cn, initials } from "@/lib/utils";

/**
 * Platform avatar: uploaded logo when present, otherwise an auto-generated
 * fallback of the platform's initials on its brand color.
 */
export function PlatformLogo({
  name,
  logoUrl,
  brandColor,
  size = 40,
  className,
}: {
  name: string;
  logoUrl: string | null;
  brandColor: string;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-xl object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-bold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: brandColor,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </div>
  );
}
