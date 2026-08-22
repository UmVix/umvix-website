import Link from "next/link";
import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { getActiveProfiles, siteConfig, type SocialKey } from "@/lib/metadata";

const offices = [
  { label: "Germany", lines: "Morgenbreede 29, Bielefeld 33615, Germany" },
  { label: "Pakistan", lines: "Blue Area, Islamabad, Pakistan" },
];

function MediumIcon({ size = 18 }: { size?: string | number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

const socialIcons: Record<SocialKey, React.ComponentType<{ size?: string | number }>> = {
  linkedin: Linkedin,
  instagram: Instagram,
  x: Twitter,
  github: Github,
  medium: MediumIcon,
};

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const activeProfiles = getActiveProfiles();

  return (
    <footer className="relative mt-auto border-t border-white/[0.06] bg-brand-black-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/25 to-transparent"
      />

      <div className="site-container py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
          {/* Brand */}
          <div className="flex flex-col items-start lg:col-span-5">
            <BrandLogo variant="footer" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-gray">
              We design and ship web platforms, mobile apps, and AI-powered
              systems for teams that want to move fast without cutting corners.
            </p>

            {/* Official Umvix profiles. Configured in lib/metadata.ts, which
                also feeds the `sameAs` array in the Organization JSON-LD, so
                the site and search engines always agree on which accounts are
                ours. Unconfigured profiles render nothing. */}
            {activeProfiles.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {activeProfiles.map(({ label, key, href }) => {
                  const Icon = socialIcons[key];
                  return (
                    <a
                      key={key}
                      href={href}
                      aria-label={`${siteConfig.name} on ${label}`}
                      rel="me noopener noreferrer"
                      target="_blank"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-brand-gray transition-colors hover:border-brand-red/30 hover:text-brand-white"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Offices — stacked */}
          <div className="lg:col-span-4 lg:col-start-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-white">
              Our Offices
            </h3>
            <div className="mt-4 flex flex-col gap-5">
              {offices.map((office) => (
                <div key={office.label} className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand-red" />
                  <p className="text-sm leading-relaxed text-brand-gray">
                    <span className="font-semibold text-brand-white">{office.label}</span>
                    <br />
                    {office.lines}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-white">
              Contact Us
            </h3>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href="tel:+923165310133"
                className="inline-flex items-center gap-2 text-sm text-brand-white transition-colors hover:text-brand-red"
              >
                <Phone size={15} className="text-brand-red" />
                +92-316 5310133
              </a>
              <a
                href="mailto:info@umvix.com"
                className="inline-flex items-center gap-2 text-sm text-brand-white transition-colors hover:text-brand-red"
              >
                <Mail size={15} className="text-brand-red" />
                info@umvix.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar — extra bottom padding on mobile keeps the last line
            clear of the fixed chat button (bottom-right). */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pb-20 pt-8 sm:flex-row sm:items-center sm:justify-between sm:pb-0">
          <p className="text-sm text-brand-gray-muted">
            &copy; {year} Umvix. All rights reserved.
          </p>

          {/* Full site navigation — every page stays one internal link away
              from every other page, including /services. */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
          >
            {siteLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-brand-gray transition-colors hover:text-brand-white"
              >
                {label}
              </Link>
            ))}
            <span className="hidden h-3 w-px bg-white/10 sm:block" aria-hidden />
            <span className="text-brand-gray-muted">Built with precision.</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
