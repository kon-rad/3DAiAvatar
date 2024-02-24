/** @type {import('next').NextConfig} */
const nextConfig = {
    // strict mode causes double render - useEffect([]) will be called twice
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
};

export default nextConfig;
