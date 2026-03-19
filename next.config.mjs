/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/contact', destination: '/kontakt', permanent: true },
      { source: '/team', destination: '/ueber-uns', permanent: true },
    ]
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
}

export default nextConfig
