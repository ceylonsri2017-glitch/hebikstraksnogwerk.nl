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
      {/* Nieuwe container om de verticale banner en de hoofdinhoud naast elkaar te plaatsen */}
      <div className="flex justify-center w-full gap-4">
        {/* ADVERTENTIEPLAATS 2: Verticale banner links */}
        <div className="ad-vertical-banner-container hidden md:block w-40 bg-gray-100 border p-2 rounded-md flex-shrink-0">
          ADVERTENTIEPLAATS 2 - VERTICALE BANNER
        </div>

        <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">Heb ik straks nog werk?</h1>
          <p className="text-slate-600">Hoe groot is AI-risico voor jouw baan?</p>
          <p className="mt-4 text-left text-slate-700 leading-relaxed max-w-lg mx-auto">
            Welkom bij hebikstraksnogwerk.nl. In een snel veranderende wereld, waar kunstmatige intelligentie (AI) steeds meer taken overneemt, is het essentieel om te begrijpen hoe jouw beroep zich tot deze disruptieve technologie verhoudt. Onze tool helpt je een schatting te maken van de mate waarin jouw werkzaamheden blootgesteld kunnen worden aan automatisering door AI.
            Ontdek in hoeverre AI jouw takenpakket kan beïnvloeden en welke vaardigheden belangrijk blijven in de toekomst. Dit is geen garantie voor de toekomst, maar een inschatting gebaseerd op de huidige trends en data.
          </p>
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

        {/* ADVERTENTIEPLAATS 1: Tijdens wachten op resultaat */}
        {!result && <div className="ad-container my-4 text-center border p-4 bg-gray-100 rounded-md">ADVERTENTIEPLAATS 1 - WACHTELIJST</div>}

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

              </div>
            </CardContent>
          </Card>
        )}

        <section className="text-left space-y-6 pt-12 border-t border-slate-100 mt-12 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-3xl font-bold text-slate-950 text-center mb-6">Veelgestelde vragen over AI en jouw werk</h2>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">Wat is AI-exposure en waarom is het belangrijk?</h3>
            <p className="text-slate-700 leading-relaxed">
              AI-exposure verwijst naar de mate waarin de taken en processen binnen een bepaald beroep beïnvloed of vervangen kunnen worden door kunstmatige intelligentie. Het is belangrijk om dit te begrijpen omdat AI-technologieën snel evolueren en een significante impact hebben op de arbeidsmarkt. Door je AI-exposure te kennen, kun je proactief stappen ondernemen om je vaardigheden aan te passen, je te specialiseren, of te heroriënteren op gebieden waar menselijke interactie en creativiteit onmisbaar blijven.
            </p>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">Hoe wordt de risicoscore berekend?</h3>
            <p className="text-slate-700 leading-relaxed">
              De risicoscore wordt berekend op basis van een analyse van de typische taken die bij een beroep horen en de huidige capaciteiten van AI-systemen. We kijken naar factoren zoals de repetitiviteit van taken, de mate van creativiteit of empathie die vereist is, en de noodzaak van complexe probleemoplossing. Een hogere score betekent dat een groter deel van de taken potentieel geautomatiseerd kan worden door AI. De score is een inschatting en dient als leidraad, niet als definitieve voorspelling.
            </p>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">Betekent een hoge score dat ik mijn baan verlies?</h3>
            <p className="text-slate-700 leading-relaxed">
              Nee, een hoge score betekent niet automatisch dat je je baan zult verliezen. Het duidt er wel op dat een aanzienlijk deel van je takenpakket in de toekomst mogelijk door AI kan worden overgenomen of ondersteund. Dit kan leiden tot een verandering in de aard van je werk, waarbij de focus verschuift naar taken die complementair zijn aan AI, zoals het managen van AI-systemen, het ontwikkelen van strategieën, of het uitvoeren van werk dat een hoge mate van menselijke interpersoonlijke vaardigheden vereist. Het is een kans om je te ontwikkelen en je rol aan te passen aan de nieuwe realiteit.
            </p>
          </article>

          <article className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">Wat kan ik doen als mijn beroep een hoog AI-risico heeft?</h3>
            <p className="text-slate-700 leading-relaxed">
              Als je beroep een hoge AI-exposure heeft, zijn er verschillende stappen die je kunt overwegen. Investeer in het leren van nieuwe vaardigheden die complementair zijn aan AI, zoals data-analyse, prompt engineering, of AI-management. Overweeg specialisatie in aspecten van je vak die (nog) niet gemakkelijk te automatiseren zijn, zoals complexe besluitvorming, strategische planning, creatief denken, of mensgerichte taken zoals coaching en leiderschap. Levenslang leren en aanpassingsvermogen zijn cruciaal in het tijdperk van AI.
            </p>
          </article>
        </section>
      </div>
        </div>
    </main>
  );
}
