import { ShortUrl, AnalyticsData } from "./api";

export const DEMO_URLS: ShortUrl[] = [
  {
    _id: "demo1",
    originalUrl: "https://github.com/facebook/react",
    shortCode: "react-repo",
    shortUrl: "https://snip.link/react-repo",
    clicks: 342,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    user: "demo",
  },
  {
    _id: "demo2",
    originalUrl: "https://tailwindcss.com/docs/installation",
    shortCode: "tw-docs",
    shortUrl: "https://snip.link/tw-docs",
    clicks: 128,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    user: "demo",
  },
  {
    _id: "demo3",
    originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    shortCode: "fun-vid",
    shortUrl: "https://snip.link/fun-vid",
    clicks: 1024,
    expiresAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    user: "demo",
  },
  {
    _id: "demo4",
    originalUrl: "https://docs.lovable.dev/features/cloud",
    shortCode: "lovable",
    shortUrl: "https://snip.link/lovable",
    clicks: 56,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    user: "demo",
  },
];

export const DEMO_ANALYTICS: Record<string, AnalyticsData> = {
  "react-repo": {
    totalClicks: 342,
    devices: [
      { device: "Desktop", count: 210 },
      { device: "Mobile", count: 112 },
      { device: "Tablet", count: 20 },
    ],
    countries: [
      { country: "US", count: 150 },
      { country: "India", count: 80 },
      { country: "UK", count: 55 },
      { country: "Germany", count: 37 },
      { country: "Other", count: 20 },
    ],
  },
  "tw-docs": {
    totalClicks: 128,
    devices: [
      { device: "Desktop", count: 98 },
      { device: "Mobile", count: 30 },
    ],
    countries: [
      { country: "US", count: 60 },
      { country: "Canada", count: 35 },
      { country: "Brazil", count: 33 },
    ],
  },
  "fun-vid": {
    totalClicks: 1024,
    devices: [
      { device: "Mobile", count: 680 },
      { device: "Desktop", count: 300 },
      { device: "Tablet", count: 44 },
    ],
    countries: [
      { country: "US", count: 400 },
      { country: "UK", count: 200 },
      { country: "India", count: 180 },
      { country: "Japan", count: 144 },
      { country: "Other", count: 100 },
    ],
  },
  lovable: {
    totalClicks: 56,
    devices: [
      { device: "Desktop", count: 40 },
      { device: "Mobile", count: 16 },
    ],
    countries: [
      { country: "US", count: 30 },
      { country: "Germany", count: 26 },
    ],
  },
};

export function isDemo(): boolean {
  return localStorage.getItem("token") === "demo-token";
}
