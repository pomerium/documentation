const fs = require("fs");
const path = require("path");
// cspell:ignore sitemapindex

function buildAbsoluteSiteUrl(context, pathname) {
  const siteUrl = new URL(context.siteConfig.url);
  const basePath = context.siteConfig.baseUrl || "/";
  const baseUrl = new URL(basePath, siteUrl);
  return new URL(pathname, baseUrl).toString();
}

module.exports = function rootSitemapPlugin(context) {
  return {
    name: "root-sitemap-plugin",

    async postBuild({ outDir }) {
      const rootSitemapPath = path.join(outDir, "sitemap.xml");

      const docsSitemapUrl = buildAbsoluteSiteUrl(context, "docs/sitemap.xml");
      const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${docsSitemapUrl}</loc>\n  </sitemap>\n</sitemapindex>\n`;

      await fs.promises.writeFile(rootSitemapPath, sitemapIndex, "utf8");
    },
  };
};
