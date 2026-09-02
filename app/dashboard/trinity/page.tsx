"use client";
import { useEffect, useState } from "react";
import { calculateTrinity, ThrowRecord } from "@/lib/trinityEngine";

export default function TrinityPage() {
  const [drill, setDrill] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ avg: 52.3, ssf: 1.12, trinityScore: 19.5, consistency: 71, clutch: 34 });
  const mockThrows: ThrowRecord[] = Array.from({ length: 30 }).map((_, i) => ({ score: Math.random() > 0.3 ? 60 : Math.floor(Math.random() * 60), target: 20, timestamp: Date.now() - i * 1000, isDouble: i % 7 === 0 }));
  useEffect(() => { const calc = calculateTrinity(mockThrows); setStats(calc); }, []);
  async function generate() {
    setLoading(true);
    const res = await fetch("/api/ai/generate-drill", { method: "POST", body: JSON.stringify({ stats, weakAreas: ["D16", "T20 low grouping"] }) });
    const data = await res.json();
    setDrill(data.drill);
    setLoading(false);
  }
  return (<div className="min-h-screen bg-[#050A14] text-white p-6 font-mono"><div className="max-w-4xl mx-auto"><h1 className="text-3xl font-bold tracking-tight">TRINITY DASHBOARD</h1><div className="grid grid-cols-3 gap-4 mt-8"><div className="border border-[#1a233a] p-4 rounded-lg bg-[#0A1120]"><p className="text-xs text-zinc-500">SSF</p><p className="text-2xl text-[#22C55E] font-bold">{stats.ssf}</p></div><div className="border border-[#1a233a] p-4 rounded-lg bg-[#0A1120]"><p className="text-xs text-zinc-500">AVG</p><p className="text-2xl font-bold">{stats.avg}</p></div><div className="border border-[#1a233a] p-4 rounded-lg bg-[#0A1120]"><p className="text-xs text-zinc-500">TRINITY</p><p className="text-2xl text-[#22C55E] font-bold">{stats.trinityScore}</p></div></div><button onClick={generate} className="mt-8 bg-[#22C55E] text-black px-6 py-3 rounded font-bold hover:bg-[#16a34a] transition">{loading ? "GENEROWANIE..." : "GENERUJ DRILL AI >"}</button>{drill && (<pre className="mt-8 p-4 bg-[#0A1120] border border-[#1a233a] rounded-lg overflow-auto text-sm">{JSON.stringify(drill, null, 2)}</pre>)}</div></div>);
}
