import Image from "next/image";
import Link from "next/link";

const LOGO_MAIN = "/icons/logo-main.png";
const LOGO_NAV = "/icons/logo-nav.png";

const NAV_ASPECT = 1210 / 337;

const VARIANTS = {
  nav: {
    src: LOGO_NAV,
    aspect: NAV_ASPECT,
    height: 48,
    className:
      "block h-9 w-auto object-contain object-left sm:h-10 md:h-11 lg:h-12",
  },
  loading: {
    src: LOGO_MAIN,
    aspect: 1.5,
    height: 120,
    className: "block h-20 w-auto object-contain sm:h-24",
  },
  footer: {
    src: LOGO_NAV,
    aspect: NAV_ASPECT,
    height: 72,
    className: "h-10 w-auto sm:h-11 object-contain object-left",
  },
  inline: {
    src: LOGO_NAV,
    aspect: NAV_ASPECT,
    height: 40,
    className: "h-9 w-auto sm:h-10 object-contain object-left",
    wrapper: true,
  },
  sm: {
    src: LOGO_NAV,
    aspect: NAV_ASPECT,
    height: 32,
    className: "h-8 w-auto object-contain object-left",
    wrapper: true,
  },
  xs: {
    src: LOGO_NAV,
    aspect: NAV_ASPECT,
    height: 24,
    className: "h-[1.15rem] w-auto object-contain object-left",
    wrapper: true,
  },
} as const;

type BrandLogoProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
  asLink?: boolean;
  priority?: boolean;
};

export default function BrandLogo({
  variant = "nav",
  className = "",
  asLink = true,
  priority = false,
}: BrandLogoProps) {
  const config = VARIANTS[variant];
  const height = config.height;
  const width = Math.round(height * config.aspect);

  const image = (
    <Image
      src={config.src}
      alt="Umvix"
      width={width}
      height={height}
      priority={priority}
      className={`${config.className} ${className}`.trim()}
    />
  );

  const content =
    "wrapper" in config && config.wrapper ? (
      <span className="inline-flex shrink-0 items-center align-middle leading-none">
        {image}
      </span>
    ) : (
      image
    );

  if (!asLink) return content;

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center leading-none"
      aria-label="Umvix home"
    >
      {image}
    </Link>
  );
}
