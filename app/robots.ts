import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/map",
        disallow: ["/admin", "/api/admin", "/api/sync"],
      },
    ],
  };
}
