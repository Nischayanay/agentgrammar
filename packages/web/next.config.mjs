/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The catalog is served by the registry API; pages are statically generated
  // at build time and revalidated (ISR) so new skills appear without a redeploy.
  async redirects() {
    return [];
  },
};

export default nextConfig;
