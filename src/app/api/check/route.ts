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
        { role: "system", content: `Je bent een expert in de Nederlandse arbeidsmarkt en AI-impact. 
        Beoordeel beroepen op AI-exposure en robotisering. 
        Belangrijk: Zorg voor een gespreide score (1-9), vermijd een 'gemiddelde' score van 5 of 6.
        1 = Zeer veilig (ambacht, diepe menselijke empathie).
        9 = Extreem risico (administratief, repetitief, data-gedreven).
        
        Geef:
        1. Een score tussen 1-9.
        2. Een rapport (3-5 zinnen): analyse van specifieke taken die verdwijnen versus taken die blijven.
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
      ai_response: "De analyse is momenteel niet beschikbaar.",
      score: 5,
      tasks_disappearing: ["Geen data beschikbaar"]
    }, { status: 500 });
  }
}
