/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            // Walkedo.nl redirects
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'walkedo.nl' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.walkedo.nl' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            // hondenuitlaatservicearnhem.com redirects
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'hondenuitlaatservicearnhem.com' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.hondenuitlaatservicearnhem.com' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            // always without www.
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
