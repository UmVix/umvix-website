type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      <h2 className="text-2xl font-bold text-brand-white">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-brand-gray">{subtitle}</p>
      )}
    </div>
  );
}
