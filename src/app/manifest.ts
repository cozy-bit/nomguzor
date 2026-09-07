import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nomguzor — Феҳристи номҳои тоҷикӣ",
    short_name: "Nomguzor",
    description: "Феҳристи расмии миллии номҳои тоҷикӣ бо маъно ва тарзи дурусти навишт",
    start_url: "/",
    display: "standalone",
    background_color: "#090D16",
    theme_color: "#090D16",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
