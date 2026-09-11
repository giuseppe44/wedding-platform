import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseHostname = '';
try {
  if (supabaseUrl) {
    supabaseHostname = new URL(supabaseUrl).hostname;
  }
} catch (e) {}

const remotePatterns: any[] = [
  { protocol: 'https', hostname: 'images.unsplash.com' }
];
if (supabaseHostname) {
  remotePatterns.push({
    protocol: 'https',
    hostname: supabaseHostname,
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  }
};

export default nextConfig;
