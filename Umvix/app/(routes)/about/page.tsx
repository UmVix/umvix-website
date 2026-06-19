import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import {
  Users,
  Target,
  Lightbulb,
  ShieldCheck,
  Github,
  Linkedin,
} from "lucide-react";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn about Umvix — our mission, team, and commitment to delivering exceptional IT solutions.",
  path: "/about",
});

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "We focus on outcomes that matter to your business, ensuring every line of code adds value.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We stay ahead of the curve, leveraging AI and modern frameworks to build future-proof solutions.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description:
      "We don't just work for you; we work with you as an extension of your own team.",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    description:
      "We maintain high standards in security, performance, and maintainable code architecture.",
  },
];

const team = [
  {
    name: "Alex Rivera",
    role: "Founder & CTO",
    image: "/api/placeholder/400/400",
    links: { github: "#", linkedin: "#" },
  },
  {
    name: "Sarah Jenkins",
    role: "Lead Web Developer",
    image: "/api/placeholder/400/400",
    links: { github: "#", linkedin: "#" },
  },
  {
    name: "David Chen",
    role: "AI Solutions Architect",
    image: "/api/placeholder/400/400",
    links: { github: "#", linkedin: "#" },
  },
  {
    name: "Maria Garcia",
    role: "Product Designer",
    image: "/api/placeholder/400/400",
    links: { github: "#", linkedin: "#" },
  },
  {
    name: "James Wilson",
    role: "Mobile Lead",
    image: "/api/placeholder/400/400",
    links: { github: "#", linkedin: "#" },
  },
];

const milestones = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "Umvix was founded with a mission to simplify digital transformation for small businesses.",
  },
  {
    year: "2020",
    title: "Global Expansion",
    description:
      "Successfully delivered our 50th project and expanded our team to 10+ specialists.",
  },
  {
    year: "2022",
    title: "AI Integration",
    description:
      "Pivoted to include AI and LLM solutions as a core part of our service offering.",
  },
  {
    year: "2024",
    title: "Innovation Award",
    description:
      "Recognized as a leading boutique agency for custom AI automation workflows.",
  },
  {
    year: "2026",
    title: "The Future",
    description:
      "Continuing to push boundaries in web, mobile, and intelligent software solutions.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      <section className="mx-auto max-w-4xl px-4 pt-16 text-center">
        <Reveal y={24}>
          <SectionHeading
            title="Our Story"
            subtitle="Building the digital backbone of modern enterprises since 2018."
            align="center"
          />
          <div className="mt-8 flex flex-col gap-6 text-lg text-brand-gray">
            <p>
              Umvix started in a small home office with a big vision: to bridge
              the gap between complex enterprise technology and the agile needs
              of modern businesses. We saw that many companies were struggling
              to keep up with the rapid pace of digital change, and we wanted
              to help.
            </p>
            <p>
              Over the years, we&apos;ve evolved from a small web development
              shop into a full-service IT agency specializing in
              high-performance applications and AI-driven automation. Our team
              is a blend of creative designers, strategic thinkers, and expert
              engineers who share a passion for solving difficult problems.
            </p>
            <p>
              Today, we partner with startups and established companies alike
              to build software that doesn&apos;t just work—it excels. We
              believe in transparency, technical excellence, and building
              long-term relationships with our clients.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-brand-black-soft py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal y={24}>
            <SectionHeading
              title="Our Core Values"
              subtitle="The principles that guide every project we undertake."
              align="center"
            />
          </Reveal>
          <Reveal stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-brand-red/10 p-4 text-brand-red">
                  <value.icon size={32} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-brand-white">
                  {value.title}
                </h3>
                <p className="text-brand-gray">{value.description}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <Reveal y={24}>
          <SectionHeading
            title="Meet the Team"
            subtitle="The experts behind our award-winning digital solutions."
            align="center"
          />
        </Reveal>
        <Reveal stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((member, index) => (
            <div key={index} className="group text-center">
              <div className="relative mb-4 overflow-hidden rounded-xl bg-brand-black-soft">
                <img
                  src={member.image}
                  alt={member.name}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-bold text-brand-white">{member.name}</h3>
              <p className="mb-3 text-sm text-brand-red">{member.role}</p>
              <div className="flex justify-center gap-3 text-brand-gray">
                <a href={member.links.github} className="hover:text-brand-white">
                  <Github size={18} />
                </a>
                <a href={member.links.linkedin} className="hover:text-brand-white">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-4">
        <Reveal y={24}>
          <SectionHeading
            title="Our Journey"
            subtitle="Key milestones that have shaped who we are today."
            align="center"
          />
        </Reveal>
        <Reveal stagger className="mt-12 space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-red font-bold text-brand-red">
                  {milestone.year}
                </div>
                {index !== milestones.length - 1 && (
                  <div className="mt-2 h-full w-0.5 bg-brand-black-soft" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-brand-white">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-brand-gray">{milestone.description}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
