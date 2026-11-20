import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/couple/"],
      },
    ],
    sitemap: "https://www.gentiluna.com/sitemap.xml",
    host: "https://www.gentiluna.com",
  };
}
