"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import jobs from "../../data/jobs.json";
import { Copy, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [job, setJob] = useState("");
  const [result, setResult] = useState<{ score: number, report: string, tasks_disappearing?: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkJob = async () => {
    setLoading(true);
    setResult(null);

    const found = jobs.find((j: any) => j.job.toLowerCase() === job.toLowerCase());

    if (found) {
      setResult({ 
        score: found.score * 10, 
        report: "Dit beroep heeft een AI-exposure score van " + found.score + "/10. " + (found.score >= 8 ? 'Zeer hoog risico.' : found.score >= 5 ? 'Gemiddeld risico.' : 'Veilig.')
      });
    } else {
      const response = await fetch("/api/check", {
        method: "POST",
        body: JSON.stringify({ job }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setResult({ 
        score: (data.score || 5) * 10, 
        report: data.ai_response,
        tasks_disappearing: data.tasks_disappearing 
      });
    }
    setLoading(false);
  };

  const shareResult = async () => {
    if (!result) return;
    const text = "Mijn baan '" + job + "' heeft een AI-exposure score van " + (result.score / 10) + "/10 op hebikstraksnogwerk.nl";
    try {
      await navigator.clipboard.writeText(text);
      alert("Resultaat gekopieerd!");
    } catch (err) {
      console.error("Fout", err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">Heb ik straks nog werk?</h1>
          <p className="text-slate-600">Hoe groot is AI-risico voor jouw baan?</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              placeholder="Typ je beroep..." 
              value={job} 
              onChange={(e) => setJob(e.target.value)} 
              className="bg-slate-50 border-slate-200 text-lg flex-1"
            />
            <Button 
              onClick={checkJob} 
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-amber-500 hover:opacity-90 transition-opacity font-semibold w-full sm:w-auto text-white"
            >
              Check
            </Button>
          </div>
        </div>

        {loading && <p className="animate-pulse text-slate-500">Analyseren...</p>}

        {result && (
          <Card className="bg-white border-slate-200 shadow-xl animate-in fade-in zoom-in duration-300">
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium uppercase tracking-widest text-slate-500">Risicoscore (0=Veilig, 10=Gevaar)</span>
                <span className="text-3xl font-bold text-slate-900">{result.score / 10}/10</span>
              </div>
              <Progress value={result.score} className="h-4 bg-slate-100" />
              
              <div className="text-left space-y-4 pt-4 border-t border-slate-100">
                <p className="text-lg leading-relaxed text-slate-800">{result.report}</p>
                {result.tasks_disappearing && result.tasks_disappearing.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Taken onder druk:</h4>
                        <ul className="list-disc pl-5 text-slate-600 space-y-1 text-sm">
                            {result.tasks_disappearing.map((task, i) => (
                                <li key={i}>{task}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <Button variant="ghost" onClick={shareResult} className="w-full text-xs text-slate-500 hover:text-slate-900">
                  <Copy className="w-3 h-3 mr-2" /> Deel resultaat
                </Button>
                <Link href="/premium" className="block mt-4">
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                     <Sparkles className="w-4 h-4 mr-2 text-orange-500" /> Bekijk jouw toekomstperspectief
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
