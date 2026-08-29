export function UpgradeGate({ title, description }) {
  return (
    <div className="max-w-md border border-[#dc9b5f]/40 bg-[#dc9b5f]/10 rounded-xl p-6">
      <p className="text-[10px] uppercase tracking-wide font-semibold text-[#dc9b5f] mb-2">
        Premium feature
      </p>
      <h2 className="font-semibold text-lg text-[#f3efe4] mb-2">{title}</h2>
      <p className="text-sm text-[#98a2b3] mb-4">{description}</p>
      <a
        href="https://wa.me/254728482191?text=Hi%2C%20I%20want%20to%20upgrade%20my%20KaziFlow%20store%20to%20Premium"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#dc9b5f] text-[#0a0f1a] text-xs font-semibold rounded-full px-4 py-2.5"
      >
        Upgrade for KSH 150/month →
      </a>
    </div>
  );
}
