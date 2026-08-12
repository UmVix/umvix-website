type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  /**
   * Heading level. Pages whose main heading is a SectionHeading should pass
   * "h1" so every route has exactly one top-level heading for crawlers.
   */
  as?: "h1" | "h2";
};

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      <Heading className="text-2xl font-bold text-brand-white">{title}</Heading>
      {subtitle && (
        <p className="mt-2 text-brand-gray">{subtitle}</p>
      )}
    </div>
  );
}
