import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Web, Mobile App & AI Development Agency`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { src: "/icons/favicon-96.png", sizes: "96x96", type: "image/png" },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
