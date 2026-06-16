import Link from "next/link";

export default function RisicoUitleg() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-50 text-slate-900">
      <div className="max-w-3xl w-full text-center space-y-8 mt-12 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">AI en jouw Werk: Veelgestelde Vragen</h1>
        <p className="text-slate-600">Diepgaande informatie over het AI-risico voor diverse beroepen.</p>
      </div>

      <div className="max-w-xl w-full text-left space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <article className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">Wat is AI-exposure en waarom is het belangrijk?</h2>
          <p className="text-slate-700 leading-relaxed">
            AI-exposure verwijst naar de mate waarin de taken en processen binnen een bepaald beroep beïnvloed of vervangen kunnen worden door kunstmatige intelligentie. Het is belangrijk om dit te begrijpen omdat AI-technologieën snel evolueren en een significante impact hebben op de arbeidsmarkt. Door je AI-exposure te kennen, kun je proactief stappen ondernemen om je vaardigheden aan te passen, je te specialiseren, of te heroriënteren op gebieden waar menselijke interactie en creativiteit onmisbaar blijven.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">Hoe wordt de risicoscore berekend?</h2>
          <p className="text-slate-700 leading-relaxed">
            De risicoscore wordt berekend op basis van een analyse van de typische taken die bij een beroep horen en de huidige capaciteiten van AI-systemen. We kijken naar factoren zoals de repetitiviteit van taken, de mate van creativiteit of empathie die vereist is, en de noodzaak van complexe probleemoplossing. Een hogere score betekent dat een groter deel van de taken potentieel geautomatiseerd kan worden door AI. De score is een inschatting en dient als leidraad, niet als definitieve voorspelling.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">Betekent een hoge score dat ik mijn baan verlies?</h2>
          <p className="text-slate-700 leading-relaxed">
            Nee, een hoge score betekent niet automatisch dat je je baan zult verliezen. Het duidt er wel op dat een aanzienlijk deel van je takenpakket in de toekomst mogelijk door AI kan worden overgenomen of ondersteund. Dit kan leiden tot een verandering in de aard van je werk, waarbij de focus verschuift naar taken die complementair zijn aan AI, zoals het managen van AI-systemen, het ontwikkelen van strategieën, of het uitvoeren van werk dat een hoge mate van menselijke interpersoonlijke vaardigheden vereist. Het is een kans om je te ontwikkelen en je rol aan te passen aan de nieuwe realiteit.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">Wat kan ik doen als mijn beroep een hoog AI-risico heeft?</h2>
          <p className="text-slate-700 leading-relaxed">
            Als je beroep een hoge AI-exposure heeft, zijn er verschillende stappen die je kunt overwegen. Investeer in het leren van nieuwe vaardigheden die complementair zijn aan AI, zoals data-analyse, prompt engineering, of AI-management. Overweeg specialisatie in aspecten van je vak die (nog) niet gemakkelijk te automatiseren zijn, zoals complexe besluitvorming, strategische planning, creatief denken, of mensgerichte taken zoals coaching en leiderschap. Levenslang leren en aanpassingsvermogen zijn cruciaal in het tijdperk van AI.
          </p>
        </article>
        
        <div className="text-center mt-8">
          <Link href="/" className="text-orange-600 hover:underline">
            &larr; Terug naar de tool
          </Link>
        </div>

      </div>
    </main>
  );
}