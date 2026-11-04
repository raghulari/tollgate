import { ShieldCheck, KeyRound, Gauge, DollarSign, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              T
            </div>
            <span className="font-semibold text-xl tracking-tight text-slate-900">Tollgate</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ml-2">
              v0.1.0-alpha
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#docs"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Docs
            </a>
            <a
              href="#login"
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Log in
            </a>
            <a
              href="#get-started"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-8">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>AI Spend Firewall & Key Vault</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Take total control of your <br className="hidden sm:inline" />
            <span className="text-blue-600">AI infrastructure & spend</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop worrying about runaway LLM bills. Tollgate provides enforceable budgets, virtual
            API keys, envelope-encrypted provider vaults, and instant kill switches for small teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="#dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow transition-colors"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/raghulari/tollgate"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-lg text-base font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors"
            >
              View GitHub
            </a>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Architected for Security & Financial Control
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base">
                Decoupled control plane and low-latency Fastify data plane.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Virtual API Keys</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generate scoped, rotatable virtual keys for team members and apps. Plaintext keys
                  are never persisted, and credentials never leak to clients.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Atomic Spend Limits</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Budget reservations prevent race conditions and concurrent request overages. Zero
                  floating-point drift using exact micro-dollar accounting.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Gauge className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Fastify AI Gateway</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sub-millisecond routing overhead with full OpenAI compatibility for OpenAI,
                  Anthropic, and Google Gemini models.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Tollgate. Production-Grade AI Gateway & Spend Management.
          </p>
        </div>
      </footer>
    </div>
  );
}
