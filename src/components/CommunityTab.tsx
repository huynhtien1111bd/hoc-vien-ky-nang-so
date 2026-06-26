import React, { useState } from "react";
import { MessageSquare, ThumbsUp, Plus, Award } from "lucide-react";

interface Thread {
  id: string;
  author: string;
  avatarText: string;
  timeAgo: string;
  title: string;
  content: string;
  replies: number;
  category: string;
}

interface CommunityTabProps {
  threads: Thread[];
  onAddThread: (title: string, category: string, content: string) => void;
  showToast: (msg: string) => void;
}

export default function CommunityTab({ threads, onAddThread, showToast }: CommunityTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("MOS Excel");
  const [newContent, setNewContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast("⚠️ Vui lòng nhập đầy đủ tiêu đề và nội dung thảo luận!");
      return;
    }
    onAddThread(newTitle, newCategory, newContent);
    setNewTitle("");
    setNewContent("");
    setShowAddForm(false);
    showToast("🎉 Đã tạo thảo luận thành công trên cộng đồng!");
  };

  const handleLike = (title: string) => {
    showToast(`👍 Bạn đã thích chủ đề: "${title}"`);
  };

  return (
    <div className="p-6 flex flex-col gap-6 text-left">
      
      {/* Forum title banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Diễn đàn cộng đồng học viên & Bảng xếp hạng tuần
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Nơi hỏi đáp, hỗ trợ sửa file lỗi thực hành văn phòng và trao đổi giải thuật bồi dưỡng học sinh giỏi Tin học.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tạo câu hỏi mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: discussions list and thread form */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Create thread form */}
          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-md animate-fade-in"
            >
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Đặt câu hỏi / thảo luận</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Tiêu đề bài viết</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    type="text"
                    placeholder="ví dụ: Cách sửa lỗi hiển thị #VALUE! trong Excel..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Chuyên mục</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all text-slate-200 cursor-pointer"
                  >
                    <option value="MOS Excel">MOS Excel</option>
                    <option value="MOS Word">MOS Word</option>
                    <option value="IC3 GS6">IC3 GS6</option>
                    <option value="Python HSG">Python HSG</option>
                    <option value="Scratch THCS">Scratch THCS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Chi tiết câu hỏi</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Mô tả chi tiết câu hỏi, đính kèm các hàm hoặc giải thuật của bạn để mọi người và AI gỡ lỗi cùng nhé..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 transition-all text-slate-200"
                  required
                ></textarea>
              </div>

              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-slate-100 text-xs font-bold bg-slate-800 hover:bg-slate-750 transition-all border border-slate-750"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Đăng lên cộng đồng
                </button>
              </div>
            </form>
          )}

          {/* Discussion feed list */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Chủ đề thảo luận nổi bật</h3>
            
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 text-slate-300 flex items-center justify-center font-bold text-xs shadow-inner">
                      {thread.avatarText}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{thread.author}</h4>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{thread.timeAgo}</p>
                    </div>
                  </div>
                  <span className="bg-slate-950 border border-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {thread.category}
                  </span>
                </div>

                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-100 hover:text-indigo-400 transition-colors cursor-pointer leading-snug">
                    {thread.title}
                  </h4>
                  <p className="text-xs leading-relaxed mt-1 text-slate-400 whitespace-pre-wrap">
                    {thread.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-slate-800/80 pt-3 mt-1 text-[11px] text-slate-500">
                  <button
                    onClick={() => handleLike(thread.title)}
                    className="flex items-center gap-1.5 hover:text-slate-300 transition-all font-semibold cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Thích
                  </button>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {thread.replies} câu trả lời
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: weekly leaderboard */}
        <div className="flex flex-col gap-4 text-left">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Bảng xếp hạng tuần này</h3>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm h-fit">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2 font-bold text-slate-500">
              <span>Học viên tích cực</span>
              <span>Năng lượng XP</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs py-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-300 flex items-center justify-center font-black text-[10px] border border-amber-500/20 shadow-sm">
                    1
                  </span>
                  <span className="font-semibold text-slate-200">Hoàng Xuân Bách</span>
                </div>
                <span className="font-extrabold text-amber-400 font-mono">1,250 XP</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-slate-500/10 text-slate-300 flex items-center justify-center font-black text-[10px] border border-slate-500/20 shadow-sm">
                    2
                  </span>
                  <span className="font-semibold text-slate-200">Trần Minh Hiếu</span>
                </div>
                <span className="font-extrabold text-slate-400 font-mono">980 XP</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-amber-700/10 text-amber-600/90 flex items-center justify-center font-black text-[10px] border border-amber-700/20 shadow-sm">
                    3
                  </span>
                  <span className="font-semibold text-slate-200">Nguyễn Văn Khang</span>
                </div>
                <span className="font-extrabold text-amber-500/70 font-mono">850 XP</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-mono text-[10px] text-slate-500 font-bold">
                    4
                  </span>
                  <span className="font-semibold text-slate-350">Phạm Thùy Linh</span>
                </div>
                <span className="font-extrabold text-slate-500 font-mono">720 XP</span>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[10px] text-slate-550 flex gap-2 items-start mt-2">
              <Award className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Cố gắng giải các đề thi thử và tích lũy XP của bạn để xuất hiện trong bảng vàng danh dự của HVKNS!
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
