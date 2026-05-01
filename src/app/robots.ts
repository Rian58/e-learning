import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stacksinau.henss.my.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/help", "/privacy", "/terms", "/login", "/register"],
        disallow: [
          "/dashboard",
          "/courses",
          "/enroll",
          "/leaderboard",
          "/profile",
          "/admin",
          "/manage",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
