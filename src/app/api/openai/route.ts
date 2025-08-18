import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { contextPrompt, testQuestion, model } = await request.json()
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 })
    }

    const composedUserMessage = [
      "You are helping plan a product launch. Use the following context refresh strictly:",
      contextPrompt || "",
      "\nNow answer this question based on the context above:",
      testQuestion || "",
    ].join("\n\n")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are an expert enterprise product launch assistant. You strictly honor constraints (budget caps, CEO directives, timelines). Prefer digital marketing over trade shows if the context forbids trade shows. Be concise and actionable.",
          },
          { role: "user", content: composedUserMessage },
        ],
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: "OpenAI API error", details: text },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content || ""
    return NextResponse.json({ content })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(error?.message || error) },
      { status: 500 }
    )
  }
}


