/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            // fallback
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.walkedo.com' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
        ]
    }
};

export default nextConfig;
