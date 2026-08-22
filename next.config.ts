import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'fqaatgpzmqpmnytuskkz.supabase.co',
        port: "",
        pathname: "/storage/v1/object/public/**",
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
