"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { Send, Loader2, ThumbsUp, ThumbsDown } from "lucide-react"
import Image from "next/image"

export default function ChatbotInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Common queries for quick replies
  const quickReplies = [
    "Property tax payment",
    "Water bill status",
    "Garbage collection schedule",
    "Report a civic issue",
    "Birth certificate application",
  ]

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Show feedback option after bot responds
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setShowFeedback(true)
      setFeedbackSubmitted(false)
    }
  }, [messages])

  const handleFeedback = (isPositive: boolean) => {
    // Here you would typically send this feedback to your backend
    console.log(`User gave ${isPositive ? "positive" : "negative"} feedback`)
    setFeedbackSubmitted(true)
  }

  const handleQuickReply = (query: string) => {
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>

    // Set the input value and submit the form
    handleInputChange({ target: { value: query } } as React.ChangeEvent<HTMLInputElement>)
    setTimeout(() => handleSubmit(fakeEvent), 100)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#3b82f6]">
      {/* Header */}
      <header className="bg-[#0f2557] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <div className="flex items-center">
            <Image
              src="/placeholder.svg?height=60&width=60"
              alt="Ahmedabad Municipal Corporation Logo"
              width={60}
              height={60}
              className="mr-4"
            />
            <div>
              <h1 className="text-xl font-bold">AMDAVAD MUNICIPAL CORPORATION</h1>
              <p className="text-sm">અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Chat Title */}
          <div className="bg-[#0f2557] text-white p-4">
            <h2 className="text-center text-lg font-medium">AI Agents for the Ahmedabad Municipal Corporation</h2>
          </div>

          {/* Chat Messages */}
          <div className="h-[60vh] overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="mb-4 text-center">Welcome to Ahmedabad Municipal Corporation's AI Assistant</p>
                <p className="text-center">How can I help you today?</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-[#0f2557] text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Typing...</span>
                </div>
              </div>
            )}
            {showFeedback &&
              messages.length > 0 &&
              !feedbackSubmitted &&
              messages[messages.length - 1].role === "assistant" && (
                <div className="flex justify-center mt-2 mb-4">
                  <div className="bg-gray-100 rounded-full px-4 py-1 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Was this helpful?</span>
                    <button
                      onClick={() => handleFeedback(true)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                      aria-label="Thumbs up"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                      aria-label="Thumbs down"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            {feedbackSubmitted && (
              <div className="flex justify-center mt-2 mb-4">
                <div className="bg-gray-100 rounded-full px-4 py-1">
                  <span className="text-sm text-gray-500">Thank you for your feedback!</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="p-3 bg-gray-100 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Common queries:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(query)}
                  className="bg-white text-[#0f2557] text-sm px-3 py-1 rounded-full border border-[#0f2557] hover:bg-[#0f2557] hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0f2557]"
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                type="submit"
                className="bg-[#0f2557] text-white p-2 rounded-full hover:bg-[#1e3a8a] transition-colors disabled:opacity-50"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f2557] text-white p-3 text-center text-sm">
        <p>© {new Date().getFullYear()} Ahmedabad Municipal Corporation. All rights reserved.</p>
      </footer>
    </div>
  )
}

