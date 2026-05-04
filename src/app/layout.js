import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "DEA - Get Project Ideas Based on Your Tech Stack",
  description:
    "DEA is an intelligence engine built for the future of creation. Generate AI-powered project ideas tailored to your tech stack.",
};

const navItems = [
  { name: "Idea", path: "/idea" },
  { name: "Trending", path: "/trending" },
  { name: "About Us", path: "/#about" },
  { name: "Docs", path: "#" },
  { name: "Home", path: "/" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400&family=Inter:wght@600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="mesh-bg">
        <section className="h-screen w-full overflow-hidden">
          <div className="relative h-full w-full overflow-hidden shadow-2xl bg-black">
            {/* Background video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
            />

            {/* Noise overlay */}
            <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* Navbar */}
            <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
              <div className="flex items-center gap-3 rounded-b-2xl bg-black/80 backdrop-blur-md px-4 py-3 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-10 lg:gap-14 border border-t-0 border-white/10 shadow-lg">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="text-[10px] sm:text-xs md:text-sm font-['Space_Grotesk'] tracking-[0.1em] text-[#E1E0CC]/80 hover:text-[#E1E0CC] transition-colors duration-300 uppercase font-semibold"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Main content */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="w-full h-full pointer-events-auto overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
