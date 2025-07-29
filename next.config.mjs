/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/ws',         destination: 'http://localhost:8080/ws' },
    ]
  },
}
export default nextConfig
