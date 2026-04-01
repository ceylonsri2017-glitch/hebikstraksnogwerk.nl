"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import jobs from "../../data/jobs.json";

// Component voor de advertentie-ruimte
const AdSensePlaceholder = ({ slot, label }: { slot: string, label: string }) => (
  <div className="w-full h-32 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm my-4 border-dashed">
    {label} ({slot})
  </div>
);

export default function Home() {
  const [job, setJob] = useState("");
  const [result, setResult] = useState<{ score: number, report: string, tasks_disappearing?: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-red-600";
    if (score >= 5) return "bg-amber-500";
    return "bg-green-600";
  };

  const checkJob = async () => {
    setLoading(true);
    setResult(null);

    const found = jobs.find((j: any) => j.job.toLowerCase() === job.toLowerCase());

    if (found) {
      setResult({ 
        score: found.score * 10, 
        report: found.report || `Dit beroep heeft een AI-exposure score van ${found.score}/10.` 
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">Heb ik straks nog werk?</h1>
          <p className="text-slate-600">AI-exposure en robotiseringsrisico van jouw beroep</p>
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

        {loading && (
            <div className="space-y-4">
                <AdSensePlaceholder slot="loading-top" label="Ad" />
                <p className="animate-pulse text-slate-500">Analyseren...</p>
            </div>
        )}

        {result && (
          <Card className="bg-white border-slate-200 shadow-xl animate-in fade-in zoom-in duration-300">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium uppercase tracking-widest text-slate-500">Risicoscore (0=Veilig, 10=Gevaar)</span>
                <span className="text-3xl font-bold text-slate-900">
                   {result.score / 10}/10 
                </span>
              </div>
              <Progress value={result.score} indicatorClassName={getScoreColor(result.score / 10)} className="h-4 bg-slate-100" />
              
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
                <AdSensePlaceholder slot="result-footer" label="Ad" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="mt-20 text-center text-xs text-slate-400 pb-10">
        <p className="opacity-60">Disclaimer: AI is onvoorspelbaar. Gebruik deze tool voor entertainment.</p>
      </footer>
    </main>
  );
}
