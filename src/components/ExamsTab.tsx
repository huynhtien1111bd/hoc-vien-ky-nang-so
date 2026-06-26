import React, { useState, useEffect } from "react";
import { PlayCircle, Clock, CheckCircle, ArrowLeft, ArrowRight, ClipboardCheck, Bot } from "lucide-react";
import { Exam } from "../types";

interface ExamsTabProps {
  exams: Exam[];
  showToast: (msg: string) => void;
  onConsultAi: (examTitle: string, scoreStr: string, wrongTopic: string) => void;
  preSelectedExamId?: string;
  clearPreSelectedExamId?: () => void;
}

export default function ExamsTab({ exams, showToast, onConsultAi, preSelectedExamId, clearPreSelectedExamId }: ExamsTabProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timerSeconds, setTimerSeconds] = useState(900);
  const [showResults, setShowResults] = useState(false);

  const startExam = (examId: string) => {
    setSelectedExamId(examId);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimerSeconds(examId === "mos_excel" ? 900 : 1200);
    setIsPlaying(true);
    setShowResults(false);
    showToast("📝 Đã bắt đầu bài thi thử. Hãy tập trung làm bài!");
  };

  useEffect(() => {
    if (preSelectedExamId) {
      startExam(preSelectedExamId);
      if (clearPreSelectedExamId) clearPreSelectedExamId();
    }
  }, [preSelectedExamId]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeExam = exams.find((e) => e.id === selectedExamId);

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: optIdx }));
  };

  const handlePrev = () => {
    if (currentQIndex > 0) setCurrentQIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (activeExam && currentQIndex < activeExam.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setIsPlaying(false);
    setShowResults(true);
    showToast("💯 Đã nộp bài thi thành công. Đang tính điểm...");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getResults = () => {
    if (!activeExam) return { score: 0, percent: 0, passed: false };
    let score = 0;
    activeExam.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score++;
      }
    });
    const percent = Math.round((score / activeExam.questions.length) * 100);
    const passed = percent >= 70;
    return { score, percent, passed };
  };

  const { score, percent, passed } = getResults();

  return (
    <div className="p-6 flex flex-col gap-6 text-left">
      {/* Tab Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-400" />
            Phòng luyện thi thử chứng chỉ số (MOS & IC3)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Luyện tập đề thi bấm giờ thực tế, giúp bạn tích lũy kinh nghiệm và đạt điểm tối đa khi đi thi thật.
          </p>
        </div>

        {isPlaying && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2 flex items-center gap-2.5 self-start shadow-sm animate-pulse">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono font-extrabold text-rose-300">
              Thời gian còn lại: {formatTime(timerSeconds)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: list of prep exams */}
        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm h-fit">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Đề ôn thi sẵn có</h3>
          
          {exams.map((exam) => {
            const isCurrent = exam.id === selectedExamId;
            return (
              <button
                key={exam.id}
                onClick={() => startExam(exam.id)}
                disabled={isPlaying && selectedExamId !== exam.id}
                className={`w-full text-left border rounded-xl p-3.5 flex justify-between items-center transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                    : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-350 hover:border-slate-700 disabled:opacity-50"
                }`}
              >
                <div>
                  <span className="bg-slate-900 text-slate-400 border border-slate-800 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">
                    {exam.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 mt-1">{exam.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {exam.questions.length} câu hỏi • {exam.timeMinutes} phút làm bài
                  </p>
                </div>
                <PlayCircle className={`w-6 h-6 shrink-0 ${isCurrent ? 'text-indigo-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Middle/Right Side: Interactive Playfield */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col gap-5 relative shadow-sm min-h-[350px]">
          
          {/* 1. Welcome state */}
          {!isPlaying && !showResults && (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-md font-bold text-slate-200">Sẵn sàng ôn thi bấm giờ</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Hãy chọn một đề ôn thi ở cột danh mục bên trái để kích hoạt trình làm bài thi trắc nghiệm lập tức.
                </p>
              </div>
              <button
                onClick={() => startExam(exams[0]?.id || "mos_excel")}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Mở đề luyện mẫu MOS Excel
              </button>
            </div>
          )}

          {/* 2. Active exam state */}
          {isPlaying && activeExam && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {activeExam.badge} • Trắc nghiệm
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-100 mt-1.5">{activeExam.title}</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  Câu {currentQIndex + 1}/{activeExam.questions.length}
                </span>
              </div>

              {/* Question rendering */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-slate-200">
                  {activeExam.questions[currentQIndex].q}
                </h4>
                <div className="flex flex-col gap-2.5">
                  {activeExam.questions[currentQIndex].options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentQIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500 font-bold"
                            : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-350"
                        }`}
                      >
                        <span className="font-bold mr-2 text-slate-500">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Câu trước
                </button>

                {currentQIndex === activeExam.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Nộp bài
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    Câu tiếp
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. Results scorecard state */}
          {showResults && activeExam && (
            <div className="flex flex-col gap-5 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl mx-auto shadow-sm">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-md font-bold text-slate-200">Kết quả bài thi ôn luyện</h3>
                <p className="text-xs text-slate-400 mt-0.5">Hệ thống đã chấm và tổng hợp điểm số thi thử của bạn.</p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto my-2">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 uppercase font-black">Số điểm</span>
                  <h4 className="text-md font-black text-slate-200 mt-1">
                    {score}/{activeExam.questions.length}
                  </h4>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 uppercase font-black">Tỉ lệ đạt</span>
                  <h4 className="text-md font-black text-indigo-400 mt-1">{percent}%</h4>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-center items-center">
                  <span className="text-[9px] text-slate-500 uppercase font-black">Kết luận</span>
                  <span
                    className={`text-[10px] font-extrabold mt-1 uppercase ${
                      passed ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {passed ? "ĐẠT (PASS)" : "CHƯA ĐẠT"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-left max-w-lg mx-auto text-xs text-slate-400 leading-relaxed shadow-sm">
                <p className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
                  Đánh giá thông minh từ AI Tutor:
                </p>
                {passed ? (
                  <span>
                    Chúc mừng! Bạn nắm vững lý thuyết chứng chỉ này rất tốt. Bạn có thể bấm nút ở dưới để yêu cầu AI Tutor phân tích nâng cao các câu hỏi thi MOS/IC3 khó hơn nhằm đạt điểm thi 1000/1000 tuyệt đối!
                  </span>
                ) : (
                  <span>
                    Bạn bị sai một số câu hỏi căn bản (đặc biệt là phần tra cứu dữ liệu / bảo mật an ninh). Đừng lo lắng! Hãy nhấp nút dưới đây để nhờ AI Tutor giải thích chi tiết đáp án và gỡ rối kiến thức ngay.
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={() => startExam(selectedExamId)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Làm lại đề thi
                </button>
                <button
                  onClick={() =>
                    onConsultAi(
                      activeExam.title,
                      `${score}/${activeExam.questions.length} (${percent}%)`,
                      passed ? "Nâng cao" : "Cơ bản / Các câu hỏi đã sai"
                    )
                  }
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                  Nhờ AI giải thích đáp án sai
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
