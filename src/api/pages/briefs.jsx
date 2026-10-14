import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { EmptyState } from "@/components/EmptyState";
import { FileText, Plus, Loader2, BadgeCheck, DollarSign, Calendar } from "lucide-react";

const typeLabel = { video: "Video", animation: "Animation", image: "Image", "3d": "3D", music: "Music", motion: "Motion" };
const statusStyle = { open: "bg-emerald-500/10 text-emerald-600", in_progress: "bg-amber-500/10 text-amber-600", closed: "bg-muted text-muted-foreground" };

export default function Briefs() {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("open");

  useEffect(() => {
    setLoading(true);
    const query = status === "all" ? {} : { status };
    base44.entities.Brief.filter(query, { sort: "-created_date", limit: 50 })
      .then((page) => setBriefs(page.items || []))
      .catch(() => setBriefs([]))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Open briefs</h1>
          <p className="text-muted-foreground">Creative briefs published by brands and agencies.</p>
        </div>
        <Link to="/briefs/new" className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90"><Plus className="w-4 h-4" /> New brief</Link>
      </div>

      <div className="flex gap-2 mb-6">
        {[["all", "All"], ["open", "Open"], ["in_progress", "In progress"], ["closed", "Closed"]].map(([k, l]) => (
          <button key={k} onClick={() => setStatus(k)} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${status === k ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : briefs.length === 0 ? (
        <EmptyState title="No briefs here" body="Be the first to publish a creative brief." action={<Link to="/briefs/new" className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium">Create a brief</Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {briefs.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300">{typeLabel[b.content_type] || b.content_type}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[b.status]}`}>{b.status.replace("_", " ")}</span>
              </div>
              <h3 className="font-semibold mt-3">{b.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3 flex-1">{b.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(b.skills_required || []).slice(0, 3).map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300">{s}</span>)}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-sm text-muted-foreground">
                {b.budget > 0 && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {b.budget.toLocaleString()}</span>}
                {b.deadline && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(b.deadline).toLocaleDateString()}</span>}
                {b.commercial_use && <span className="flex items-center gap-1 text-emerald-600"><BadgeCheck className="w-4 h-4" /> Commercial</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">by {b.brand_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}