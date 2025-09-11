/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ancuwmmivgdvommzigwv.supabase.co'],
  },
  
  // Redirect old routes to the consolidated design board
  async redirects() {
    return [
      {
        source: '/moodboard',
        destination: '/design-board?mode=inspiration',
        permanent: true,
      },
      {
        source: '/lookbook',
        destination: '/design-board?mode=shopping',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig