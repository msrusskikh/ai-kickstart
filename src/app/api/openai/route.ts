import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log('=== OpenAI API route called ===')
    console.log('Environment variables check:')
    console.log('- OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
    console.log('- OPENAI_API_KEY length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0)
    console.log('- OPENAI_API_KEY preview:', process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 10)}...` : 'undefined')
    
    const body = await request.json()
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('❌ Missing OPENAI_API_KEY - Environment variable not loaded!')
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')))
      return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 })
    }

    console.log('✅ API key loaded successfully')

    // Handle lab prompts (new format)
    if (body.prompt) {
      console.log('Processing lab prompt:', body.prompt.substring(0, 100) + '...')
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: body.model || "gpt-4o-mini",
          temperature: body.temperature || 0.7,
          max_tokens: body.max_tokens || 400,
          messages: [
            {
              role: "system",
              content: "Ты — AI-ассистент для анализа клиентских отзывов. Отвечай на русском языке, будь конкретным и структурированным.",
            },
            { role: "user", content: body.prompt },
          ],
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('OpenAI API error:', response.status, text)
        return NextResponse.json(
          { error: "OpenAI API error", details: text },
          { status: response.status }
        )
      }

      const data = await response.json()
      const response_text = data?.choices?.[0]?.message?.content || ""
      console.log('OpenAI response received, length:', response_text.length)
      return NextResponse.json({ response: response_text })
    }

    // Handle lab analysis prompts (new format for workflow builder lab)
    if (body.contextPrompt && body.testQuestion) {
      console.log('Processing lab analysis prompt:', body.contextPrompt.substring(0, 100) + '...')
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: body.model || "gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 800,
          messages: [
            {
              role: "system",
              content: "Ты — эксперт по автоматизации рабочих процессов с помощью ИИ-инструментов. Отвечай на русском языке, будь конкретным и структурированным. Всегда возвращай ответ в запрошенном формате. Фокусируйся ТОЛЬКО на ИИ-технологиях (ChatGPT, Claude, Gemini, ИИ-функции в таблицах, Zapier с ИИ) и НЕ рекомендуй традиционные BI-инструменты (Power BI, Tableau, Qlik).",
            },
            { role: "user", content: body.contextPrompt },
          ],
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('OpenAI API error:', response.status, text)
        return NextResponse.json(
          { error: "OpenAI API error", details: text },
          { status: response.status }
        )
      }

      const data = await response.json()
      const content = data?.choices?.[0]?.message?.content || ""
      console.log('Lab analysis response received, length:', content.length)
      return NextResponse.json({ content })
    }

    // Handle existing product launch prompts
    const { contextPrompt, testQuestion, model } = body
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


