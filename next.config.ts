import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'clicks-barbaad-dev'; // Replace with your actual GitHub repository name

const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
