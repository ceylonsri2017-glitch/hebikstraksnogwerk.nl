import { NextResponse } from "next/server";
import OpenAI from "openai";

// Gebruik OPENAI_API_KEY als fallback omdat de SDK dit standaard verwacht
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { job } = await request.json();
    
    // Check of we überhaupt een sleutel hebben
    if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
        throw new Error("Geen API Key gevonden in de omgeving");
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
      model: "meta-llama/llama-3.3-70b-instruct:free",
    });

    const content = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json({ 
      ai_response: content.report,
      score: content.score,
      tasks_disappearing: content.tasks_disappearing || []
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      ai_response: "Onze analyse-service is tijdelijk onbereikbaar.",
      score: 5,
      tasks_disappearing: ["Geen data beschikbaar"]
    }, { status: 500 });
  }
}
