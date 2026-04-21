import { NextResponse } from "next/server";
import OpenAI from "openai";

// Configurar OpenRouter client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { job } = await request.json();
    
    // Debug log: Controleer of de sleutel beschikbaar is tijdens runtime
    const apiKeyAvailable = !!(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY);
    console.log("API key availability:", apiKeyAvailable);
    if (!apiKeyAvailable) {
        console.error("API key is not available for OpenRouter.");
        // Zorg voor een duidelijke foutmelding aan de gebruiker als de sleutel niet gevonden wordt
        return NextResponse.json({ 
            ai_response: "Kon geen API sleutel vinden voor de analyse service. Controleer je Vercel instellingen.",
            score: 5,
            tasks_disappearing: ["Geen data beschikbaar"]
          }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `Je bent een professionele AI-baananalist. 
        Beoordeel beroepen objectief op AI-exposure en robotisering.
        Geef:
        1. Een score tussen 0-10 (0 = veilig, 10 = volledig vervangbaar).
        2. Een rapport van 3-5 zinnen: analyse van taken onder druk en toekomstperspectief.
        3. Een lijstje van 3 specifieke taken die onder druk staan.
        4. 1 concreet toekomstscenario (1-2 zinnen).
        
        Stijl: Professioneel, objectief en eerlijk.
        Response formaat: JSON met velden 'score' (number), 'report' (string), 'tasks_disappearing' (array of strings).` },
        { role: "user", content: `Beoordeel de functie: ${job}` }
      ],
      // Gebruik een algemeen geldig model ID voor Gemini Flash Lite
      model: "google/gemini-2.5-flash-lite", // Dit is het aangepaste model ID
    });

    let responseContent = completion.choices[0].message.content || "{}";

    // Verwijder markdown code block delimiters als ze aanwezig zijn
    if (responseContent.startsWith("```json") && responseContent.endsWith("```")) {
      responseContent = responseContent.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (responseContent.startsWith("```") && responseContent.endsWith("```")) {
      // Fallback voor algemene code blocks
       responseContent = responseContent.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const content = JSON.parse(responseContent);
    return NextResponse.json({ 
      ai_response: content.report,
      score: content.score,
      tasks_disappearing: content.tasks_disappearing || []
    });
  } catch (error: any) {
    console.error("OpenRouter API Error:", error);
    // Deze fallback melding wordt getoond als er iets misgaat.
    // Als je deze nog steeds ziet, controleer dan je credits/limieten op OpenRouter of model-ID.
    return NextResponse.json({ 
      ai_response: "Analyse service tijdelijk onbereikbaar. Controleer credits/tarieflimieten op OpenRouter of het model ID.",
      score: 5,
      tasks_disappearing: ["Geen data beschikbaar"]
    }, { status: 500 });
  }
}
