import { useState } from "react";

/**
 * KaziFlow Stores — marketing/offer page.
 *
 * Fonts: headline uses "Fraunces" (serif, weight 900), everything else
 * uses "Inter". Swap the <link> below for next/font/google in a real
 * Next.js app:
 *
 *   import { Fraunces, Inter } from "next/font/google";
 *   const fraunces = Fraunces({ subsets: ["latin"], weight: "900" });
 *   const inter = Inter({ subsets: ["latin"] });
 *
 * Requires Tailwind CSS. No other dependencies — icons are inline SVG.
 */

const WHATSAPP_LINK =
  "https://wa.me/254700000000?text=Hi%2C%20I%20want%20a%20KaziFlow%20store";

function Icon({ name, className = "w-4 h-4" }) {
  const icons = {
    store: (
      <path d="M3 9l1-5h16l1 5M4 9h16M4 9v10a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1V9" />
    ),
    chevron: <path d="M9 6l6 6-6 6" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </>
    ),
    chat: (
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    ),
    check: <path d="M20 6L9 17l-5-5" />,
    x: (
      <>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </>
    ),
    sparkle: (
      <path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3z" />
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}

const FREE_FEATURES = [
  { label: "Basic site with your color theme", included: true },
  { label: "Up to 10 products", included: true },
  { label: "Up to 5 images per product", included: true },
  { label: "WhatsApp ordering", included: true },
  { label: "Admin management", included: true },
  { label: "Ads displayed in your interface", included: true },
  { label: "No store analytics", included: false },
];

const PREMIUM_FEATURES = [
  "Better store customization",
  "Unlimited products",
  "Up to 5 images per product",
  "WhatsApp ordering",
  "No ads in your interface",
  "Product search by categories",
  "Admin management with store analytics",
];

export default function KaziFlowStores() {
  const [year] = useState(new Date().getFullYear());

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-[#f3efe4] font-sans antialiased selection:bg-[#dc9b5f] selection:text-[#0a0f1a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@900&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-weight: 900; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 sm:px-8 pt-8">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-[#f3efe4] text-[#0a0f1a]">
              <Icon name="store" className="w-5 h-5" />
            </span>
            <span className="font-semibold text-[18px] sm:text-base">
              KaziFlow <span className="text-[#dc9b5f]">Stores</span>
            </span>
          </div>
          <a
            href="#pricing"
            className="hidden sm:inline-flex items-center gap-1 text-sm border border-white/15 rounded-full pl-4 pr-3 py-2 hover:border-white/30 transition-colors"
          >
            See packages
            <Icon name="chevron" className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-[#dc9b5f] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc9b5f]" />
            Built for sellers in Kenya
          </div>

          <h1 className="font-display text-[42px] leading-[1.02] sm:text-6xl sm:leading-[1.02] mb-6">
            Your products
            <br />
            deserve a
            <br />
            <span className="text-[#dc9b5f]">place to sell.</span>
          </h1>

          <p className="text-[#98a2b3] text-[15px] sm:text-base leading-relaxed max-w-md mb-8">
            KaziFlow Stores builds clean, easy-to-manage websites for online
            sellers. Start free, add your products, and let customers order
            straight through WhatsApp.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 bg-[#f3efe4] text-[#0a0f1a] font-semibold text-sm rounded-full pl-5 pr-4 py-3 hover:bg-white transition-colors"
            >
              Choose your package
              <Icon name="chevron" className="w-4 h-4" />
            </a>
            <span className="text-sm text-[#6b7280]">No complicated setup.</span>
          </div>
        </div>

        {/* Store preview mockup */}
        <div className="relative pt-6 pr-4 sm:pt-8 sm:pr-6">
          <div className="rounded-[28px] border border-white/15 p-2.5 sm:p-3">
            <div className="rounded-[20px] border border-white/10 bg-[#0d1420] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#dc9b5f]" />
                  maua market
                </div>
                <Icon name="search" className="w-4 h-4 text-[#6b7280]" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-[#141c2b] border border-white/5"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#98a2b3] font-medium">
                  4 products live
                </span>
                <span className="flex items-center gap-1.5 text-[#dc9b5f] font-medium">
                  <Icon name="chat" className="w-3.5 h-3.5" />
                  Order on WhatsApp
                </span>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-2 right-0 sm:right-2 bg-[#0d1420] border border-white/15 rounded-2xl px-4 py-2.5 shadow-xl">
            <div className="text-[9px] tracking-[0.15em] text-[#6b7280] font-semibold mb-0.5">
              WHATSAPP ORDERS
            </div>
            <div className="text-[#dc9b5f] font-semibold text-sm">
              Direct to you
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="border-t border-white/10" />
      </div>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-[#dc9b5f] uppercase mb-3">
              Simple packages
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">
              Pick a better way to sell.
            </h2>
          </div>
          <p className="text-[#98a2b3] text-sm max-w-xs">
            Everything you need to turn your catalogue into a storefront.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free plan */}
          <div className="rounded-2xl border border-white/12 bg-[#0d1420] p-7 sm:p-8 flex flex-col">
            <div className="text-[11px] font-semibold tracking-[0.15em] text-[#6b7280] uppercase mb-3">
              Start selling online
            </div>
            <h3 className="text-xl font-semibold mb-3">Free</h3>
            <div className="mb-4">
              <span className="font-display text-4xl">KSh 0</span>
              <span className="text-[#98a2b3] text-sm ml-1.5">forever</span>
            </div>
            <p className="text-[#98a2b3] text-md leading-relaxed mb-6">
              A simple storefront to get your products in front of more
              customers.
            </p>

            <div className="border-t border-white/10 mb-6" />

            <ul className="space-y-3.5 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f.label}
                  className={`flex items-start gap-2.5 text-sm ${
                    f.included ? "" : "text-[#4b5563]"
                  }`}
                >
                  <Icon
                    name={f.included ? "check" : "x"}
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      f.included ? "text-[#dc9b5f]" : "text-[#4b5563]"
                    }`}
                  />
                  {f.label}
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#f3efe4] text-[#0a0f1a] font-semibold text-md rounded-full py-3.5 hover:bg-white transition-colors"
            >
              <Icon name="chat" className="w-5 h-5" />
              Get My Site
            </a>
          </div>

          {/* Premium plan */}
          <div className="relative rounded-2xl border border-[#dc9b5f]/50 bg-[#0d1420] p-7 sm:p-8 flex flex-col shadow-[0_0_40px_-8px_rgba(220,155,95,0.25)]">
            <span className="absolute top-7 right-7 sm:top-8 sm:right-8 bg-[#dc9b5f] text-[#0a0f1a] text-[10px] font-bold tracking-wide uppercase rounded-full px-3 py-1">
              Most popular
            </span>

            <div className="text-[11px] font-semibold tracking-[0.15em] text-[#dc9b5f] uppercase mb-3">
              Grow with confidence
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium</h3>
            <div className="mb-4">
              <span className="font-display text-4xl">KSh 150</span>
              <span className="text-[#98a2b3] text-md ml-1.5">per month</span>
            </div>
            <p className="text-[#98a2b3] text-md leading-relaxed mb-6">
              A powerful, polished store for sellers ready to grow their
              business.
            </p>

            <div className="border-t border-white/10 mb-6" />

            <ul className="space-y-3.5 mb-8 flex-1">
              {PREMIUM_FEATURES.map((label) => (
                <li key={label} className="flex items-start gap-2.5 text-sm">
                  <Icon
                    name="check"
                    className="w-4 h-4 mt-0.5 shrink-0 text-[#dc9b5f]"
                  />
                  {label}
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#dc9b5f] text-[#0a0f1a] font-semibold text-md rounded-full py-3.5 hover:bg-[#e5a86e] transition-colors"
            >
              <Icon name="chat" className="w-5 h-5" />
              Get My Site
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="border-t border-white/10" />
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="font-semibold">
            KaziFlow <span className="text-[#dc9b5f]">Stores</span>
          </div>
          <div className="text-[#6b7280]">
            Made for ambitious online sellers.
          </div>
          <div className="flex items-center gap-1.5 text-[#6b7280]">
            <Icon name="sparkle" className="w-3.5 h-3.5" />
            Easy admin management
          </div>
        </div>
      </footer>
    </div>
  );
}
