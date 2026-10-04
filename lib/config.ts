export const SITE = {
  name: "STEA VPN",
  tagline: "Your private VPN — set up in minutes",
  domain: "steavpn.stea.africa",
  apiBase: process.env.NEXT_PUBLIC_API_URL ?? "https://api.steavpn.stea.africa",
  year: new Date().getFullYear(),
} as const;

export const CONTACT = {
  wechat: {
    id: "+8619715852043",
    label: "WeChat",
    url: "https://weixin.qq.com/",
    primary: true,
    responseTime: "Reply within 30 minutes, 8am–11pm EAT",
  },
  whatsapp: {
    id: "+8619715852043",
    label: "WhatsApp",
    url: "https://wa.me/8619715852043",
    primary: false,
  },
  email: "isayamasika100@gmail.com",
} as const;

export const BANK = {
  bankName: "Selcom Microfinance Bank Tanzania Limited",
  accountName: "Isaya Hance Masika",
  accountNumber: "5525106819163",
  country: "Tanzania",
} as const;

export const FX = {
  cnyToTzs: 400,
  rateLabel: "1 CNY = 400 TZS",
} as const;

export type PlanId = "1month" | "3months" | "1year";

export interface Plan {
  id: PlanId;
  name: string;
  duration: string;
  cny: number;
  tzs: number;
  popular?: boolean;
  perks: string[];
}

export const PLANS: Plan[] = [
  {
    id: "1month",
    name: "1 Month",
    duration: "30 days",
    cny: 10,
    tzs: 4000,
    perks: [
      "Full access for 30 days",
      "Unlimited bandwidth",
      "Works on all devices",
      "Direct support via WeChat",
    ],
  },
  {
    id: "3months",
    name: "3 Months",
    duration: "90 days",
    cny: 28,
    tzs: 11200,
    popular: true,
    perks: [
      "Full access for 90 days",
      "Unlimited bandwidth",
      "Works on all devices",
      "Direct support via WeChat",
      "Save 7% vs monthly",
    ],
  },
  {
    id: "1year",
    name: "1 Year",
    duration: "365 days",
    cny: 100,
    tzs: 40000,
    perks: [
      "Full access for 365 days",
      "Unlimited bandwidth",
      "Works on all devices",
      "Direct support via WeChat",
      "Save 17% vs monthly",
    ],
  },
];

export function getPlan(id: string | null | undefined): Plan | undefined {
  if (!id) return undefined;
  return PLANS.find((p) => p.id === id);
}

export function formatCNY(n: number): string {
  return `¥${n}`;
}

export function formatTZS(n: number): string {
  return `TZS ${n.toLocaleString("en-US")}`;
}

export const DEVICES = [
  {
    id: "ios",
    name: "iPhone / iPad",
    app: "Clash Lite",
    appStore: "App Store",
    downloadUrl: "https://apps.apple.com/app/clash-lite/id6478274589",
  },
  {
    id: "android",
    name: "Android",
    app: "FlClash",
    appStore: "APK",
    downloadUrl:
      "https://clashapp.org/en-US/clash-download/flclash-download.html#downloads-android",
  },
  {
    id: "macos",
    name: "macOS",
    app: "Clash Verge Rev",
    appStore: "DMG",
    downloadUrl:
      "https://clashapp.org/en-US/clash-download/clash-verge-rev-download.html#downloads-macos",
  },
  {
    id: "windows",
    name: "Windows",
    app: "Clash Verge Rev",
    appStore: "EXE",
    downloadUrl:
      "https://clashapp.org/en-US/clash-download/clash-verge-rev-download.html",
  },
  {
    id: "linux",
    name: "Linux",
    app: "Clash Verge Rev",
    appStore: "DEB / RPM",
    downloadUrl:
      "https://clashapp.org/en-US/clash-download/clash-verge-rev-download.html",
  },
] as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Guide", href: "/guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Support", href: "/support" },
] as const;
