import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import BrandLogo from "./BrandLogo";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Web Development", href: "/services" },
  { label: "Mobile Apps", href: "/services" },
  { label: "AI Solutions", href: "/services" },
  { label: "Automation", href: "/services" },
];

const socialLinks = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "GitHub", href: "#", icon: Github },
];

export default function Footer() {
  const year = new Date().getFullYear();

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

            <a
              href="mailto:hello@umvix.com"
              className="mt-5 inline-flex items-center gap-2 text-sm text-brand-white transition-colors hover:text-brand-red"
            >
              <Mail size={15} className="text-brand-red" />
              hello@umvix.com
            </a>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-brand-gray transition-colors hover:border-brand-red/30 hover:text-brand-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:col-start-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-white">
                Company
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center text-sm text-brand-gray transition-colors hover:text-brand-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-white">
                Services
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center text-sm text-brand-gray transition-colors hover:text-brand-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA column */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-white">
              Start a Project
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-brand-gray">
              Have an idea worth building? Tell us what you need and we&apos;ll
              map the fastest path to launch.
            </p>
            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-white transition-colors hover:text-brand-red"
            >
              Get a Free Quote
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-gray-muted">
            &copy; {year} Umvix. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/contact"
              className="text-brand-gray transition-colors hover:text-brand-white"
            >
              Contact
            </Link>
            <Link
              href="/portfolio"
              className="text-brand-gray transition-colors hover:text-brand-white"
            >
              Portfolio
            </Link>
            <span className="hidden h-3 w-px bg-white/10 sm:block" aria-hidden />
            <span className="text-brand-gray-muted">Built with precision.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
