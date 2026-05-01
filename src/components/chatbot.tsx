"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface ChatbotProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export function Chatbot({ isAuthenticated = false, userName }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim pesan.");
      }

      const data = (await response.json()) as { message: string };
      setMessages((prev) => [...prev, { role: "model", content: data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const greeting = isAuthenticated && userName
    ? `Halo ${userName}! Saya Sinau AI, asisten belajar pribadimu. Ada yang bisa saya bantu hari ini?`
    : "Halo! Saya Sinau AI, asisten virtual Stack Sinau. Tanyakan apa saja tentang platform kami!";

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[4.5rem] sm:bottom-6 right-4 sm:right-6 z-40 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary text-primary-foreground border-[3px] border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-300 group"
          aria-label="Buka Chatbot"
        >
          <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse"></span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[60] flex items-end sm:items-stretch justify-end">
          {/* Backdrop for mobile */}
          <div className="absolute inset-0 bg-black/30 sm:hidden" onClick={() => setIsOpen(false)}></div>

          <Card className="relative w-full h-[calc(100%-1rem)] sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] border-[3px] border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden z-10 bg-background mt-auto">
            {/* Header */}
            <CardHeader className="p-4 border-b-[3px] border-border bg-card flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center border-2 border-primary">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black flex items-center gap-2">
                      Sinau AI
                      <Badge className="bg-green-500/20 text-green-500 text-[10px] font-bold">Online</Badge>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-medium">
                      {isAuthenticated ? "Asisten Belajar" : "Asisten Virtual"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div ref={scrollRef} className="p-4 space-y-4 min-h-full">
                  {/* Welcome Message */}
                  <div className="flex gap-3 items-start">
                    <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/50 flex-shrink-0 mt-0.5">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                      <p className="text-sm font-medium leading-relaxed">{greeting}</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          msg.role === "user"
                            ? "bg-primary/20 border-primary/50"
                            : "bg-violet-500/20 border-violet-500/50"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="h-4 w-4 text-primary" />
                        ) : (
                          <Bot className="h-4 w-4 text-violet-500" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl p-3 max-w-[85%] ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Loading */}
                  {isLoading && (
                    <div className="flex gap-3 items-start">
                      <div className="h-8 w-8 bg-violet-500/20 rounded-lg flex items-center justify-center border border-violet-500/50 flex-shrink-0 mt-0.5">
                        <Bot className="h-4 w-4 text-violet-500" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="p-3 border-t-[3px] border-border bg-card flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors max-h-24 scrollbar-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="neo-button h-11 w-11 rounded-xl flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
