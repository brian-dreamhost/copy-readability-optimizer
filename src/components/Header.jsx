export default function Header() {
  return (
    <header className="mb-8">
      <nav className="mb-8 text-sm text-galactic">
        <a
          href="https://seo-tools-tau.vercel.app/"
          className="text-azure hover:text-white transition-colors"
        >
          Free Tools
        </a>
        <span className="mx-2 text-metal">/</span>
        <a
          href="https://seo-tools-tau.vercel.app/copywriting/"
          className="text-azure hover:text-white transition-colors"
        >
          Copywriting Tools
        </a>
        <span className="mx-2 text-metal">/</span>
        <span className="text-cloudy">Copy Readability Optimizer</span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <span className="border border-turtle text-turtle rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide">
          Free Tool
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        Copy Readability Optimizer
      </h1>
      <p className="text-cloudy text-lg max-w-2xl">
        Get sentence-by-sentence feedback to make your marketing copy clearer,
        more scannable, and more persuasive — plus platform character limits,
        truncation previews, and keyword density analysis.
      </p>
    </header>
  );
}
