import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Scan, ShieldCheck, ArrowRight, Zap, Globe, Lock } from "lucide-react";
import { BlackHole } from "@/components/BlackHole";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-slate-200 overflow-hidden font-sans selection:bg-primary/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col items-center text-center">
        {/* Cosmic Background Glow */}
        {/* Cosmic Background Glow */}
        <BlackHole />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-slate-300 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Next-Gen Supply Chain Verification
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,1)]">
            Trust what you <br className="hidden md:block" /> track with Tracely
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light">
            Assign a QR-backed digital identity, capture baseline photos, verify each handoff, and persist proofs on a tamper-proof ledger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base font-medium shadow-[0_0_20px_rgba(138,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(138,92,246,0.5)]"
              onClick={() => navigate("/admin")}
            >
              Start tracking
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent hover:bg-white/5 text-white border-white/10 px-8 h-12 text-base font-medium transition-colors"
              onClick={() => navigate("/verify")}
            >
              Verify a product
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid / Core functionalities (Reflect App Style) */}
      <section className="py-24 px-4 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#0c0c0e] to-black">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Give your supply chain superpowers
            </h2>
            <p className="text-slate-400 text-lg">
              Mirror the physical journey with cryptographic certainty.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: "Create & Register",
                desc: "Register a batch and generate a unique QR code. Add baseline product photos for later visual comparison.",
              },
              {
                icon: Scan,
                title: "Scan & Log Events",
                desc: "Every handoff is captured. Supply chain actors upload photos and notes, securely hashed to the ledger.",
              },
              {
                icon: ShieldCheck,
                title: "Instant Verification",
                desc: "Consumers and regulators simply scan the QR to see product journey, compliance proofs, and trust score.",
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-24 h-24 bg-primary/20 blur-[40px] rounded-full" />
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6 relative z-10 transition-colors group-hover:border-primary/50">
                  <f.icon className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{f.title}</h3>
                <p className="text-slate-400 relative z-10 font-light leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical list feature area */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                What can you do with Tracely?
              </h2>
              <p className="text-slate-400 text-lg font-light mb-12">
                Bring unprecedented transparency to any global supply chain operation without the need for complex hardware.
              </p>

              <div className="space-y-10">
                {[
                  {
                    icon: Globe,
                    title: "Global Supply Chains",
                    desc: "Track items across borders with a unified, tamper-proof system."
                  },
                  {
                    icon: Lock,
                    title: "Cryptographic Trust",
                    desc: "No more forged documents. Everything is mathematically verified."
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast Audits",
                    desc: "Generate compliance reports and audit trails in seconds."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="mt-1">
                      <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                        <item.icon className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-12 md:mt-0">
              <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative border border-white/10 bg-black/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                {/* Mock UI for Visual Interest */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">TR</div>
                    <div>
                      <div className="text-base font-medium text-white">Batch #HT-1029</div>
                      <div className="text-sm text-slate-400">Verified Origin</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20 tracking-wider">
                    SECURE
                  </div>
                </div>

                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                  <div className="flex gap-4 items-start relative">
                    <div className="w-4 h-4 rounded-full bg-primary mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(138,92,246,0.5)] z-10" />
                    <div>
                      <div className="text-base font-medium text-slate-200">Manufactured at Facility A</div>
                      <div className="text-sm text-slate-500 mt-1">Oct 12, 10:00 AM • GPS: 34.05, -118.24</div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start relative">
                    <div className="w-4 h-4 rounded-full bg-primary mt-1 flex-shrink-0 shadow-[0_0_10px_rgba(138,92,246,0.5)] z-10" />
                    <div>
                      <div className="text-base font-medium text-slate-200">Quality Assured & Sealed</div>
                      <div className="text-sm text-slate-500 mt-1">Oct 13, 08:30 AM • Inspector ID: 492</div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start relative">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 bg-[#0c0c0e] mt-1 flex-shrink-0 z-10" />
                    <div>
                      <div className="text-base font-medium text-slate-500">In Transit to Warehouse Hub</div>
                      <div className="text-sm text-slate-600 mt-1">Pending Arrival</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 text-center mt-20 bg-black/20">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Tracely. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-slate-600">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
