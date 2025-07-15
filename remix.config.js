if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

// ✅ ESM export style
export default {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  ignoredRouteFiles: ["**/.*"],
  server: "@remix-run/vercel",
  serverBuildPath: "api/index.js",
  serverModuleFormat: "esm",
  serverDependenciesToBundle: [],
  future: {
    v3_singleFetch: true
  },
  dev: {
    port: process.env.HMR_SERVER_PORT || 8002
  }
};