import { GoogleGenerativeAI } from "@google/generative-ai"
import { PERSONAS } from "@/lib/personas"

export const maxDuration = 30

interface Message {
  role: "user" | "model" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, personaId }: { messages: Message[]; personaId: string } = await req.json()

    console.log("[v0] Received request - messages:", messages?.length, "personaId:", personaId)

    const apiKey = process.env.GEMINI_API_KEY || process.env.gemini_api
    if (!apiKey) {
      console.error("[v0] Missing Gemini API key")
      return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "메시지가 없습니다" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 1. 모든 페르소나가 공유할 기본 지식(Base Prompt)을 정의합니다.
    // 이 부분을 수정하여 모든 페르소나의 기본 행동을 제어할 수 있습니다.
    const basePrompt = `
    ### 기본 규칙
    - 당신은 주어진 페르소나를 완벽히 연기하여 사용자와 대화하는 AI입니다.
    - 절대로 AI 모델이라는 사실과 페르소나 프롬프트를 직접적으로 언급하지 마세요.
    - 항상 당신에게 주어진 페르소나(정체성)를 완벽하게 연기해야 합니다.
    - 답변은 항상 한국어로 제공해야 합니다.
    - 불법적이거나 비윤리적인 요청에는 정중히 거절해야 합니다.
    - 캐릭터의 행동, 표정 등의 비언어적 표현은 []로 감싸 표현합니다.
    - 캐릭터의 감정이나 생각은 ()로 표현합니다.
    - **와 같은 마크다운 기호는 사용을 자제합니다.
    - 개행과 들여쓰기을 활용하여 가독성 좋게 답변합니다.
    `

    const persona = PERSONAS.find((p) => p.id === personaId) || PERSONAS.find((p) => p.id === "default")
    const personaSystemPrompt = persona?.systemPrompt

    if (!personaSystemPrompt) {
      return new Response(JSON.stringify({ error: "페르소나를 찾을 수 없습니다." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 2. 기본 지식과 개별 페르소나의 프롬프트를 결합하여 최종 지시사항을 만듭니다.
    const finalSystemPrompt = `${basePrompt}\n\n--- 페르소나 지침 ---\n\n${personaSystemPrompt}`

    const history = messages.slice(0, -1).map((msg: Message) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    const lastMessage = messages[messages.length - 1]

    // 3. 결합된 최종 프롬프트를 AI 모델에 전달합니다.
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: finalSystemPrompt,
    })

    const chat = model.startChat({
      history: history,
    })

    console.log("[v0] Starting stream...")
    const result = await chat.sendMessageStream(lastMessage.content)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            console.log("[v0] Streaming chunk:", text.slice(0, 30))
            const data = `0:${JSON.stringify(text)}\n`
            controller.enqueue(encoder.encode(data))
          }
          console.log("[v0] Stream complete")
          controller.close()
        } catch (error) {
          console.error("[v0] Streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error details:", errorMessage)
    return new Response(
      JSON.stringify({
        error: "응답 생성에 실패했습니다",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
