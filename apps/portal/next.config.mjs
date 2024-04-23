/** @type {import('next').NextConfig} */
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import path from 'node:path';
import url from 'node:url';
import { readFileSync } from 'node:fs';

const workspaceRoot = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    '..',
    '..'
);

/**
 * Once supported replace by node / eslint / ts and out of experimental, replace by
 * `import packageJson from './package.json' assert { type: 'json' };`
 * @type {import('type-fest').PackageJson}
 */
const packageJson = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url)).toString('utf-8')
);

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    reactStrictMode: true,
    optimizeFonts: true,

    typescript: {
        ignoreBuildErrors: isProd,
    },
    eslint: {
        ignoreDuringBuilds: isProd,
        // dirs: [`${__dirname}/src`],
    },
    webpack(config, { isServer, dev }) {
        if (!isServer) {
            // Fixes npm packages that depend on `fs` module
            // @link https://github.com/vercel/next.js/issues/36514#issuecomment-1112074589
            config.resolve.fallback = { ...config.resolve.fallback, fs: false };
        }

        if (isServer && !dev) {
            config.plugins = [...config.plugins, new PrismaPlugin()]
        }

        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find(
            (/** @type {{ test: { test: (arg0: string) => any; }; }} */ rule) =>
                rule.test?.test?.('.svg')
        );

        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            }
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config
    },
    env: {
        APP_NAME: packageJson.name ?? 'not-in-package.json',
        APP_VERSION: packageJson.version ?? 'not-in-package.json',
        BUILD_TIME: new Date().toISOString(),
    },
    // @link https://nextjs.org/docs/advanced-features/compiler#minification
    // Sometimes buggy so enable/disable when debugging.
    swcMinify: true,

    // @link https://nextjs.org/docs/basic-features/image-optimization
    images: {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        formats: ['image/webp'],
        loader: 'default',
        dangerouslyAllowSVG: false,
        disableStaticImages: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
        unoptimized: false,
    },

    output: 'standalone',
    outputFileTracing: true,
    experimental: {
        // this includes files from the monorepo base two directories up
        outputFileTracingRoot: workspaceRoot,

        // Useful in conjunction with to `output: 'standalone'` and `outputFileTracing: true`
        // to keep lambdas sizes / docker images low when vercel/nft isn't able to
        // drop unneeded deps for you. ie: esbuil-musl, swc-musl... when not actually needed
        //
        // Note that yarn 3+/4 is less impacted thanks to supportedArchitectures.
        // See https://yarnpkg.com/configuration/yarnrc#supportedArchitectures and
        // config example in https://github.com/belgattitude/nextjs-monorepo-example/pull/3582
        // NPM/PNPM might adopt https://github.com/npm/rfcs/pull/519 in the future.
        //
        // Caution: use it with care because you'll have to maintain this over time.
        //
        // How to debug in vercel: set NEXT_DEBUG_FUNCTION_SIZE=1 in vercel env, then
        // check the last lines of vercel build.
        //
        // Related issue: https://github.com/vercel/next.js/issues/42641

        // Caution if using pnpm you might also need to consider that things are hoisted
        // under node_modules/.pnpm/<something variable>. Depends on version
        //
        // outputFileTracingExcludes: {
        //  '*': [
        //    '**/node_modules/@swc/core-linux-x64-gnu/**/*',
        //    '**/node_modules/@swc/core-linux-x64-musl/**/*',
        //    // If you're nor relying on mdx-remote... drop this
        //    '**/node_modules/esbuild/linux/**/*',
        //    '**/node_modules/webpack/**/*',
        //    '**/node_modules/terser/**/*',
        //    // If you're not relying on sentry edge or any weird stuff... drop this too
        //    // https://github.com/getsentry/sentry-javascript/pull/6982
        //    '**/node_modules/rollup/**/*',
        //  ],
        // },
        // Prefer loading of ES Modules over CommonJS
        // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
        // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
        esmExternals: true,
        // Experimental monorepo support
        // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
        // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
        externalDir: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flashcaststorage.blob.core.windows.net',
            },
        ],
    }
};

export default nextConfig;
