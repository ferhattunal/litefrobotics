import type { NextConfig } from "next";

function supabaseHostname() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!value) return undefined;
  try {
    return new URL(value).hostname;
  } catch {
    return undefined;
  }
}

const hostname = supabaseHostname();

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/upload": [
      "./node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
  images: {
    remotePatterns: hostname
      ? [
          {
            protocol: "https",
            hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
