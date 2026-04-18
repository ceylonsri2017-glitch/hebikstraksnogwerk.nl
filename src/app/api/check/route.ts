import { NextResponse } from "next/server";
import OpenAI from "openai";

// Zorg dat we expliciet de OpenRouter sleutel pakken
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { job } = await request.json();
    
    // Debugging log voor Vercel (kijk in Vercel logs)
    console.log("Checking API key availability:", !!process.env.OPENROUTER_API_KEY);

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
      model: "meta-llama/llama-3.3-70b-instruct:free",
    });

    const content = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json({ 
      ai_response: content.report,
      score: content.score,
      tasks_disappearing: content.tasks_disappearing || []
    });
  } catch (error: any) {
    console.error("OpenRouter API Error:", error);
    return NextResponse.json({ 
      ai_response: "De analyse-service is tijdelijk onbereikbaar. Controleer de API-key in Vercel instellingen.",
      score: 5,
      tasks_disappearing: ["Geen data beschikbaar"]
    }, { status: 500 });
  }
}
