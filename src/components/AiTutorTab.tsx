import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2, Sparkles } from "lucide-react";
import { ChatMessage } from "../types";

interface AiTutorTabProps {
  showToast: (msg: string) => void;
  presetPrompt?: string;
  clearPresetPrompt?: () => void;
}

export default function AiTutorTab({ showToast, presetPrompt, clearPresetPrompt }: AiTutorTabProps) {
  const [chat, setAiChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial greetings
    setAiChat([
      {
        id: "greet",
        sender: "ai",
        text: "Xin chào bạn! Tôi là **AI Tutor** - trợ lý gia sư cá nhân số của bạn tại Học viện Kỹ năng Số.\n\nTôi có thể giải đáp mọi bài thi MOS (Excel/Word/PPT), đề trắc nghiệm IC3 GS6, gỡ lỗi lập trình Scratch/Python/C++ và hướng dẫn thuật toán ôn thi HSG.\n\nHôm nay bạn có thắc mắc công nghệ nào cần tôi hỗ trợ gỡ rối không?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (presetPrompt) {
      sendPrompt(presetPrompt);
      if (clearPresetPrompt) clearPresetPrompt();
    }
  }, [presetPrompt]);

  const sendPrompt = async (textToSend: string) => {
    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChat((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           prompt: textToSend,
           chatHistory: chat.slice(-6).map((m) => ({ sender: m.sender, text: m.text }))
         })
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: data.text || "Tôi chưa chuẩn bị được đáp án.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChat((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: "err_" + Date.now(),
        sender: "ai",
        text: "⚠️ Hiện tại cổng kết nối AI Server đang bận. Mẹo nhanh cho bạn:\n- Trong Excel: Phím **F4** chuyển đổi nhanh vùng tham chiếu tuyệt đối (`$A$1`).\n- IC3 GS6: Ghi nhớ **mật khẩu bảo mật mạnh** cần tối thiểu 8 ký tự kèm chữ hoa, số và ký tự đặc biệt.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChat((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    sendPrompt(text);
  };

  const handlePreset = (type: "explain_excel" | "make_quiz") => {
    if (type === "explain_excel") {
      sendPrompt("Giải thích chi tiết giúp tôi quy tắc cố định tham chiếu $ trong Excel và khi nào dùng?");
    } else {
      sendPrompt("Hãy tạo cho tôi 1 câu hỏi trắc nghiệm ôn thi chứng chỉ IC3 GS6 về chủ đề Bảo mật mạng và Điện toán đám mây");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Tab Header bar */}
      <div className="p-4 border-b border-slate-800 shrink-0 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white relative shadow-md">
            <Bot className="w-5 h-5 text-slate-100" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-100">AI Tutor - Gia sư Kỹ năng Số</h2>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Đang trực tuyến 24/7 (Gemini)
            </p>
          </div>
        </div>

        {/* Preset query helpers */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            onClick={() => handlePreset("explain_excel")}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Giải thích Excel MOS
          </button>
          <button
            onClick={() => handlePreset("make_quiz")}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Tạo đề luyện trắc nghiệm
          </button>
        </div>
      </div>

      {/* Chat History content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-950">
        {chat.map((m) => (
          <div key={m.id} className={`flex gap-3 max-w-2xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto text-left"}`}>
            {m.sender !== "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-indigo-400 border border-slate-800 flex items-center justify-center text-xs shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col">
              <div
                className={`border rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "bg-indigo-600/20 border-indigo-500/35 text-slate-100 rounded-tr-none font-medium"
                    : "bg-slate-900/80 border-slate-800 text-slate-200 rounded-tl-none font-sans"
                }`}
              >
                {m.text}
              </div>
              <span className={`text-[9px] text-slate-500 mt-1 font-mono ${m.sender === "user" ? "text-right" : "text-left"}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3 max-w-2xl mr-auto text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-indigo-400 border border-slate-800 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 leading-relaxed shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>AI Tutor đang phân tích dữ liệu bài giảng...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input panel footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 shrink-0 shadow-sm">
        <form onSubmit={handleSend} className="flex gap-2.5 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Hỏi AI Tutor về các hàm Word, Excel, IC3, thuật toán Python HSG..."
            className="flex-1 bg-slate-950 hover:bg-slate-900 focus:bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center shadow-md shrink-0 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
