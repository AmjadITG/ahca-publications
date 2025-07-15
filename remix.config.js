// Fix: Replace HOST with SHOPIFY_APP_URL to prevent Remix crash during local dev
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  ignoredRouteFiles: ["**/.*"],
  future: {
    v3_singleFetch: true,
  },
  // ✅ This tells Remix to use the Vercel adapter
  server: "@remix-run/vercel",
  // ✅ Output path where Vercel will look for serverless function
  serverBuildPath: "api/index.js",
  // Optional: only for local dev HMR port fix
  dev: {
    port: process.env.HMR_SERVER_PORT || 8002
  }
};
