import { useEffect, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const sections = [
  ["hero", "Hero film / poster"],
  ["intro", "Introduction image"],
  ["product-clear", "CLEAR product"],
  ["product-svva", "SVVA product"],
  ["product-beverages", "Beverage products"],
  ["product-gas", "Gas distribution"],
  ["product-other", "Other products"],
  ["service-water", "Water supply"],
  ["service-beverages", "Beverage distribution"],
  ["service-gas", "Gas agency"],
  ["service-business", "Business supply"],
  ["trichy", "Trichy location"],
] as const;

type FormState = { imageUrl: string; videoUrl: string; posterUrl: string; altText: string };
const emptyForm: FormState = { imageUrl: "", videoUrl: "", posterUrl: "", altText: "" };

export default function AdminMedia() {
  const { user, loading } = useAuth();
  const { data: records, isLoading } = trpc.media.list.useQuery();
  const utils = trpc.useUtils();
  const mutation = trpc.media.upsert.useMutation({
    onSuccess: () => { toast.success("Media record saved."); utils.media.list.invalidate(); },
    onError: (error) => toast.error(error.message || "Could not save media record."),
  });
  const [forms, setForms] = useState<Record<string, FormState>>({});

  useEffect(() => {
    if (!records) return;
    const next: Record<string, FormState> = {};
    records.forEach((record) => { next[record.sectionKey] = { imageUrl: record.imageUrl || "", videoUrl: record.videoUrl || "", posterUrl: record.posterUrl || "", altText: record.altText || "" }; });
    setForms(next);
  }, [records]);

  if (loading || isLoading) return <div className="media-admin-loading">Loading media library…</div>;
  if (!user) return <div className="media-admin-login"><p>PRK AGENCIES / MEDIA LIBRARY</p><h1>Sign in to manage<br /><em>section imagery.</em></h1><button onClick={() => startLogin()} className="button button-amber">SIGN IN <Save size={16} /></button><a href="/">← Back to site</a></div>;
  if (user.role !== "admin") return <div className="media-admin-login"><p>PRK AGENCIES / MEDIA LIBRARY</p><h1>Admin access<br /><em>required.</em></h1><p>Your signed-in account does not have media editing permission.</p><a href="/">← Back to site</a></div>;

  const update = (key: string, field: keyof FormState, value: string) => setForms((current) => ({ ...current, [key]: { ...(current[key] || emptyForm), [field]: value } }));
  return <div className="media-admin"><header><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to site</a><span>PRK AGENCIES / MEDIA LIBRARY</span></header><main><p className="admin-kicker">CONTENT CONTROL / VISUAL SYSTEM</p><h1>Manage the<br /><em>visual route.</em></h1><p className="admin-lede">Update one section at a time. Use persistent `/manus-storage/...` paths or full HTTPS URLs. The homepage will fall back to its built-in visual whenever a field is empty.</p><div className="media-grid">{sections.map(([key, label]) => { const form = forms[key] || emptyForm; return <article key={key} className="media-editor-card"><div className="media-card-heading"><span>{key}</span><h2>{label}</h2></div><label>IMAGE URL<input value={form.imageUrl} onChange={(e) => update(key, "imageUrl", e.target.value)} placeholder="/manus-storage/..." /></label><label>VIDEO URL<input value={form.videoUrl} onChange={(e) => update(key, "videoUrl", e.target.value)} placeholder="Optional MP4 URL" /></label><label>POSTER URL<input value={form.posterUrl} onChange={(e) => update(key, "posterUrl", e.target.value)} placeholder="Optional poster image" /></label><label>ALT TEXT<input value={form.altText} onChange={(e) => update(key, "altText", e.target.value)} placeholder="Describe this visual" /></label><button className="button button-amber" onClick={() => mutation.mutate({ sectionKey: key, imageUrl: form.imageUrl || null, videoUrl: form.videoUrl || null, posterUrl: form.posterUrl || null, altText: form.altText || null })} disabled={mutation.isPending}><Save size={15} /> {mutation.isPending ? "SAVING" : "SAVE SECTION"}</button></article>; })}</div></main></div>;
}
