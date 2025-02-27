import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 60 // Allow responses up to 60 seconds

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add system message to provide context about AMC
  const systemMessage = {
    role: "system",
    content:
      "You are the official AI assistant for the Ahmedabad Municipal Corporation. Provide helpful, accurate, and concise information about municipal services, procedures, and facilities in Ahmedabad. Be polite and professional. If you don't know the answer to a specific query, suggest contacting the relevant department directly. Respond in English by default, but support Gujarati if the user asks in Gujarati.",
  }

  // Add system message to the beginning if it doesn't exist
  const messagesWithSystem = messages[0]?.role === "system" ? messages : [systemMessage, ...messages]

  const result = streamText({
    model: openai("gpt-4o"),
    messages: messagesWithSystem,
  })

  return result.toDataStreamResponse()
}

