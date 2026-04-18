import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { job, skills } = await request.json();
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `Je bent een carrière-strateeg. Maak een SWOT-analyse voor het beroep ${job} met de vaardigheden: ${skills.join(', ')}.
        Output in JSON:
        - swot: { strengths: string, weaknesses: string, opportunities: string, threats: string }
        - risk_assessment: { y5: string, y10: string, y15: string }
        - future_route: string (max 5 zinnen)
        - action_plan: array of strings` },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
  } catch (error) {
    return NextResponse.json({ error: "Analyse mislukt" }, { status: 500 });
  }
}
