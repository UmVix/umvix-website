import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { slugifyHeading } from "@/lib/blog";

/**
 * Renders a post's MDX body. Headings get slugified ids so the table of
 * contents and shared links can deep-link into a post, and links/images are
 * swapped for their Next.js equivalents.
 */

function headingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return headingText((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const components = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 id={slugifyHeading(headingText(children))} className="scroll-mt-28 font-headline">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 id={slugifyHeading(headingText(children))} className="scroll-mt-28 font-headline">
      {children}
    </h3>
  ),
  a: ({ href = "", children }: { href?: string; children?: ReactNode }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} data-cursor="hover">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="hover">
        {children}
      </a>
    );
  },
  img: ({ src = "", alt = "" }: { src?: string; alt?: string }) => (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={675}
      className="rounded-xl border border-white/[0.08]"
    />
  ),
};

export default function PostBody({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-brand max-w-none prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline prose-pre:border prose-pre:border-white/[0.08] prose-img:rounded-xl">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
