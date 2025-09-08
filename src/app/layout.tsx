import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Calo Lens - Smart Food Recognition & Nutrition Tracking",
  description: "التقط، اعرف، تحرّك — تطبيق واحد يحسب سعرات وجبتك ويقترح كيف تحرقها. بسيط، سريع، ودقيق بما يكفي لتبدأ اليوم.",
  keywords: "food recognition, calorie tracking, nutrition, AI, Arabic, كالو لينس, تتبع السعرات",
  authors: [{ name: "Calo Lens Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Calo Lens"
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Calo Lens - Smart Food Recognition",
    description: "AI-powered food recognition and nutrition tracking app with Arabic support",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        {/* Google Fonts for Arabic support */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* PWA related meta tags */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`antialiased min-h-screen bg-gradient-to-br from-green-50 to-emerald-50`}>
        {/* Root container with RTL support */}
        <div className="min-h-screen">
          {children}
        </div>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}