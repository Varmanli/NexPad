require("dotenv").config();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Same env var used throughout the app (see NEXT_PUBLIC_BASE_URL in .env.example)
  // so the sitemap, robots.txt, and app metadata never disagree on the domain.
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
};
