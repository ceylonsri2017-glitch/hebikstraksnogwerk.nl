import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { job } = await request.json();
    
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set");
    }

    const completion = await groq.chat.completions.create({
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
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json({ 
      ai_response: content.report,
      score: content.score,
      tasks_disappearing: content.tasks_disappearing || []
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ 
      ai_response: "Onze analyse-service is tijdelijk onbereikbaar. Controleer je internetverbinding of API-sleutel.",
      score: 5,
      tasks_disappearing: ["Geen data beschikbaar"]
    }, { status: 500 });
  }
}
