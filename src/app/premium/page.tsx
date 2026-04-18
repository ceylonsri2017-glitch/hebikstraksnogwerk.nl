"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PremiumPage() {
  const [skills, setSkills] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    } else {
      setLoading(false);
      alert("Betalingssysteem is momenteel niet beschikbaar.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <Card className="max-w-md w-full bg-white border-slate-200 shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Ontgrendel je Toekomst-Rapport</h2>
        <p className="text-sm text-slate-600 mb-6">Voer hier je 4 belangrijkste vaardigheden in voor een diepgaande SWOT-analyse en carrière-advies.</p>
        
        <div className="space-y-4 mb-8">
          {skills.map((skill, i) => (
            <Input 
              key={i}
              placeholder={`Vaardigheid ${i + 1}`}
              value={skill}
              onChange={(e) => {
                const newSkills = [...skills];
                newSkills[i] = e.target.value;
                setSkills(newSkills);
              }}
              className="bg-slate-50 border-slate-200"
            />
          ))}
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:opacity-90 transition-opacity font-semibold text-white"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Ontgrendel voor €1,99"}
        </Button>
      </Card>
    </main>
  );
}
