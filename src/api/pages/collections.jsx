import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { PortfolioCard } from "@/components/PortfolioCard";
import { PortfolioModal } from "@/components/PortfolioModal";
import { EmptyState } from "@/components/EmptyState";
import { MOODS, MOOD_ACCENTS } from "@/lib/explore";
import { Crown, Gift, Palette, Loader2, ArrowRight } from "lucide-react";

export default function Collections() {
  const [premium, setPremium] = useState([]);
  const [free, setFree] = useState([]);
  const [counts, setCounts] = useState({ premium: 0, free: 0 });
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.PortfolioItem.filter({ pricing_type: "premium" }, { sort: "-views", limit: 8 }).catch(() => ({ items: [] })),
      base44.entities.PortfolioItem.filter({ pricing_type: "free" }, { sort: "-views", limit: 8 }).catch(() => ({ items: [] })),
      base44.entities.PortfolioItem.count({ pricing_type: "premium" }).catch(() => 0),
      base44.entities.PortfolioItem.count({ pricing_type: "free" }).catch(() => 0),
    ])
      .then(([pp, fp, pc, fc]) => {
        setPremium(pp.items || []);
        setFree(fp.items || []);
        setCounts({ premium: pc, free: fc });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-heading text-3xl font-bold">Collections</h1>
      <p className="text-muted-foreground mt-1">Curated groupings across the marketplace — premium showpieces, free gallery picks, and mood-based sets.</p>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Premium */}
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold flex items-center gap-2"><Crown className="w-6 h-6 text-amber-500" /> Premium Collections</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{counts.premium} licensable showpiece{counts.premium === 1 ? "" : "s"} for brands and campaigns.</p>
              </div>
              <Link to="/explore?pricing=premium" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 shrink-0">
                Browse premium <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {premium.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {premium.map((it) => <PortfolioCard key={it.id} item={it} onOpen={setActive} />)}
              </div>
            ) : (
              <EmptyState title="No premium pieces yet" body="Premium artwork will appear here as creators publish it." />
            )}
          </section>

          {/* Free */}
          <section className="mt-12">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold flex items-center gap-2"><Gift className="w-6 h-6 text-emerald-500" /> Free Gallery</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{counts.free} free piece{counts.free === 1 ? "" : "s"} — check each license and attribution terms.</p>
              </div>
              <Link to="/explore?pricing=free" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 shrink-0">
                Browse free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {free.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {free.map((it) => <PortfolioCard key={it.id} item={it} onOpen={setActive} />)}
              </div>
            ) : (
              <EmptyState title="No free pieces yet" body="Free artwork will appear here as creators publish it." />
            )}
          </section>

          {/* Mood sets */}
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold flex items-center gap-2"><Palette className="w-6 h-6 text-primary" /> Mood Collections</h2>
            <p className="text-sm text-muted-foreground mt-0.5 mb-6">Every mood is a living collection — open one to browse its works.</p>
            <div className="flex flex-wrap gap-2.5">
              {MOODS.map((m, i) => (
                <Link
                  key={m}
                  to={`/explore?mood=${encodeURIComponent(m)}`}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r ${MOOD_ACCENTS[i]} hover:opacity-90 shadow-sm`}
                >
                  {m}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <PortfolioModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}