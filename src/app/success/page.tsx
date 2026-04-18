"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SuccessPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skills = JSON.parse(localStorage.getItem("premium_skills") || "[]");
    const job = localStorage.getItem("premium_job") || "Algemeen";

    fetch("/api/swot", {
      method: "POST",
      body: JSON.stringify({ job, skills }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <main className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin" /></main>;

  return (
    <main className="p-8 max-w-2xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Jouw Toekomst-Rapport</h1>
      <Card className="p-6">
        <CardContent className="space-y-6">
          <div><h3 className="font-bold">SWOT-Analyse</h3><p>{report.swot.strengths}</p></div>
          <div><h3 className="font-bold">Risico's (5, 10, 15 jaar)</h3><p>{report.risk_assessment.y5}</p></div>
          <div><h3 className="font-bold">Route naar de toekomst</h3><p>{report.future_route}</p></div>
        </CardContent>
      </Card>
    </main>
  );
}
