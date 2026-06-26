import React, { useState, useEffect, useRef } from "react";
import { X, FileText, Download, HelpCircle, Bot, Send, Loader2, Play, CircleDot } from "lucide-react";
import { Course, ChatMessage } from "../types";

interface CourseViewerProps {
  course: Course | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export default function CourseViewer({ course, onClose, showToast }: CourseViewerProps) {
  const [activeTab, setActiveTab] = useState<"files" | "quiz" | "lessons">("lessons");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState<ChatMessage[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!course) return;
    if (course.lessons && course.lessons.length > 0) {
      setCurrentLessonId(course.lessons[0].id);
    }
    
    // Set default introduction chat
    setAiChat([
      {
        id: "intro",
        sender: "ai",
        text: `Chào bạn! Tôi là trợ lý học tập số. Bạn đang ôn luyện lớp **${course.title}**. Hãy chọn bài học hoặc tải tệp thực hành bên trái để làm. Có chỗ nào khó tính toán hay viết hàm, bạn cứ chat ở đây nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [course]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  if (!course) return null;

  const currentLesson = course.lessons?.find((l) => l.id === currentLessonId) || course.lessons?.[0];

  const handleSendAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || loadingAi) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: aiInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChat((prev) => [...prev, userMsg]);
    const promptToSend = aiInput;
    setAiInput("");
    setLoadingAi(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          context: `Học viên đang học bài "${currentLesson?.title || 'Tổng quan'}" thuộc khóa "${course.title}".`,
          chatHistory: aiChat.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: data.text || "Tôi chưa ghi nhận được câu trả lời.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChat((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: "ai_err_" + Date.now(),
        sender: "ai",
        text: "⚠️ Kết nối AI đang gián đoạn, hãy cố định vùng tuyệt đối với dấu `$` hoặc dùng đúng tham số trong các hàm nhé!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChat((prev) => [...prev, errMsg]);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/25 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {course.badge}
            </span>
            <h2 className="text-xs md:text-sm font-extrabold text-slate-100 line-clamp-1">
              {course.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Đóng lớp học"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left panel: player, documents, quizzes */}
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
            
            {/* Player aspect */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/40 opacity-85 z-0"></div>
              
              <div className="text-center flex flex-col items-center gap-3 pointer-events-none z-10 p-4">
                <div className="w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 animate-pulse">
                  <Play className="w-6 h-6 fill-indigo-400 text-indigo-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-white tracking-wide">
                    {currentLesson?.title || "Video Bài Giảng Đang Tải..."}
                  </span>
                  <p className="text-[10px] text-slate-500">Thời lượng bài học: {currentLesson?.duration || "15:00"}</p>
                </div>
              </div>
            </div>

            {/* Selection tabs */}
            <div className="flex gap-1 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab("lessons")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "lessons"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/25"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Bài học ({course.lessons?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "files"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/25"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                File thực hành ({course.files.length})
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/25"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Quick Quiz ({course.quiz.length})
              </button>
            </div>

            {/* Dynamic contents tab */}
            <div className="flex-1 text-xs text-slate-300">
              {activeTab === "lessons" && (
                <div className="flex flex-col gap-2">
                  <p className="text-slate-500 font-medium mb-1 text-left">Click chọn bài học trong danh sách bài giảng:</p>
                  {course.lessons?.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setCurrentLessonId(l.id)}
                      className={`w-full text-left p-3 rounded-lg border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        l.id === currentLessonId
                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-300 font-bold"
                          : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-350"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CircleDot className={`w-3.5 h-3.5 ${l.id === currentLessonId ? 'text-indigo-400 fill-indigo-400' : 'text-slate-600'}`} />
                        <span>{l.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{l.duration}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "files" && (
                <div className="flex flex-col gap-2">
                  <p className="text-slate-500 font-medium mb-2 text-left">Tải tệp mẫu thực hành về máy để làm theo bài giảng:</p>
                  {course.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="min-w-0 text-left">
                          <h4 className="font-bold text-slate-200 text-xs truncate">{file.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono">{file.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Đang tải tài liệu: ${file.name}`)}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-indigo-500/30 hover:border-transparent flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        Tải về
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "quiz" && (
                <div className="flex flex-col gap-3">
                  <p className="text-slate-500 font-medium mb-1 text-left">Kiểm tra nhanh kiến thức đã xem:</p>
                  {course.quiz.map((q, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <h4 className="font-bold text-slate-200 mb-2 flex items-start gap-1 text-left">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{q.q}</span>
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() =>
                              oIdx === q.correct
                                ? showToast("🎉 Hoàn toàn chính xác! Tuyệt vời.")
                                : showToast("❌ Chưa đúng rồi. Hãy xem kỹ lại video bài học.")
                            }
                            className="w-full text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2 rounded-lg text-[11px] text-slate-300 transition-all font-medium cursor-pointer"
                          >
                            {oIdx + 1}. {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: AI Tutor Support */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/40 flex flex-col overflow-hidden shrink-0">
            
            <div className="p-3 border-b border-slate-800 bg-slate-900/20 flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">AI Tutor hỗ trợ tại lớp</span>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 text-left">
              {aiChat.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[90%] shadow-sm ${
                      m.sender === "user"
                        ? "bg-indigo-600/25 border border-indigo-500/20 text-slate-100 rounded-tr-none"
                        : "bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[8px] text-slate-500 mt-0.5 px-1 font-mono">{m.timestamp}</span>
                </div>
              ))}
              {loadingAi && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900 border border-slate-850 rounded-lg p-2 max-w-[80%] shadow-inner">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>AI Tutor đang suy nghĩ...</span>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Chat input form */}
            <div className="p-2 border-t border-slate-800 bg-slate-900/50 shrink-0">
              <form onSubmit={handleSendAi} className="flex gap-2">
                <input
                  id="cvAiChatInput"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  type="text"
                  placeholder="Hỏi AI về bài học này..."
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loadingAi}
                  className="px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold flex items-center justify-center transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
