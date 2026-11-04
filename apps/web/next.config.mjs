/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@tollgate/config',
    '@tollgate/database',
    '@tollgate/logger',
    '@tollgate/pricing',
    '@tollgate/schemas',
    '@tollgate/shared',
  ],
};

export default nextConfig;
