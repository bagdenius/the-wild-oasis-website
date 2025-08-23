/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL(
        'https://hpdzplrfbxebonqqcvdc.supabase.co/storage/v1/object/public/cabins-images/**'
      ),
    ],
  },
  // output: 'standalone',
};

export default nextConfig;
