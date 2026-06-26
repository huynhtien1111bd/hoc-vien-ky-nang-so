import React, { useState } from "react";
import { Settings, Shield, GraduationCap, ClipboardCheck, QrCode, Trash2, Plus, CheckCircle, RefreshCw } from "lucide-react";
import { Course, Exam, PurchaseLog, AdminStats } from "../types";

interface AdminPortalTabProps {
  courses: Course[];
  exams: Exam[];
  purchaseLogs: PurchaseLog[];
  stats: AdminStats;
  onAddCourse: (c: any) => void;
  onDeleteCourse: (id: string) => void;
  onAddExam: (e: any) => void;
  onDeleteExam: (id: string) => void;
  onApprovePayment: (id: string) => void;
  onRefresh: () => void;
}

export default function AdminPortalTab({
  courses,
  exams,
  purchaseLogs,
  stats,
  onAddCourse,
  onDeleteCourse,
  onAddExam,
  onDeleteExam,
  onApprovePayment,
  onRefresh
}: AdminPortalTabProps) {
  const [subSection, setSubSection] = useState<"stats" | "courses" | "exams" | "payments">("stats");

  // Form states for creating a course
  const [cTitle, setCTitle] = useState("");
  const [cCat, setCCat] = useState<"cert" | "schools">("cert");
  const [cDesc, setCDesc] = useState("");
  const [cBadge, setCBadge] = useState("MOS Word");

  // Form states for creating an exam
  const [eTitle, setETitle] = useState("");
  const [eMinutes, setEMinutes] = useState(15);
  const [eCat, setECat] = useState("MOS");
  const [eBadge, setEBadge] = useState("Core 365");
  const [qText, setQText] = useState("");
  const [qOptA, setQOptA] = useState("");
  const [qOptB, setQOptB] = useState("");
  const [qOptC, setQOptBCorrect] = useState("");
  const [qOptD, setQOptD] = useState("");
  const [qCorrect, setQCorrect] = useState(0);

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle.trim()) return;
    onAddCourse({
      title: cTitle,
      category: cCat,
      description: cDesc,
      lessonsCount: 15,
      examCount: 5,
      badge: cBadge,
      files: [{ name: "Bài_thi_thử_hệ_thống.xlsx", size: "120 KB" }],
      quiz: [{ q: "Nên làm gì khi gặp sự cố phần mềm?", options: ["Khởi động lại", "Cài lại HĐH", "Mua máy mới", "Không làm gì"], correct: 0 }]
    });
    setCTitle("");
    setCDesc("");
  };

  const handleAddExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle.trim() || !qText.trim() || !qOptA.trim() || !qOptB.trim()) return;
    onAddExam({
      title: eTitle,
      timeMinutes: Number(eMinutes),
      category: eCat,
      badge: eBadge,
      questions: [
        {
          q: qText,
          options: [qOptA, qOptB, qOptC || "Khác", qOptD || "Không có"].filter(Boolean),
          correct: Number(qCorrect)
        }
      ]
    });
    setETitle("");
    setQText("");
    setQOptA("");
    setQOptB("");
  };

  return (
    <div className="p-6 flex flex-col gap-6 text-left">
      
      {/* Admin Title bar */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
        <div>
          <h2 className="text-sm font-black text-rose-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Trạm quản trị hệ thống CMS (Admin Control Panel)
          </h2>
          <p className="text-xs text-rose-300 mt-0.5">
            Cấu trúc bài thi, phê duyệt giao dịch ngân hàng chuyển khoản, thêm sửa khóa học đào tạo và quản lý tiêu thụ AI.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-1.5 bg-slate-950 border border-rose-500/30 text-rose-300 hover:bg-slate-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-pulse-slow" />
          Đồng bộ CMS
        </button>
      </div>

      {/* Sub tabs nav */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 shrink-0">
        <button
          onClick={() => setSubSection("stats")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            subSection === "stats" ? "bg-rose-500/20 border border-rose-500/35 text-rose-300" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          Tổng quan số liệu
        </button>
        <button
          onClick={() => setSubSection("courses")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            subSection === "courses" ? "bg-rose-500/20 border border-rose-500/35 text-rose-300" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          Quản lý khóa học ({courses.length})
        </button>
        <button
          onClick={() => setSubSection("exams")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            subSection === "exams" ? "bg-rose-500/20 border border-rose-500/35 text-rose-300" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          Quản lý đề thi ({exams.length})
        </button>
        <button
          onClick={() => setSubSection("payments")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            subSection === "payments" ? "bg-rose-500/20 border border-rose-500/35 text-rose-300" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          Duyệt VietQR MB Bank ({purchaseLogs.length})
        </button>
      </div>

      {/* 1. SECTION: SYSTEM STATS VIEW */}
      {subSection === "stats" && (
        <div className="flex flex-col gap-6 text-left">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500">Người dùng kích hoạt</span>
              <h3 className="text-lg font-extrabold text-slate-200 mt-1">{stats.totalUsers.toLocaleString()} tài khoản</h3>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500">Doanh thu hệ thống</span>
              <h3 className="text-lg font-extrabold text-emerald-400 mt-1">{stats.totalRevenue.toLocaleString()} đ</h3>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500">Khóa học đăng tải</span>
              <h3 className="text-lg font-extrabold text-indigo-400 mt-1">{stats.totalCourses} chương trình</h3>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500">Sử dụng API Gemini</span>
              <h3 className="text-lg font-extrabold text-slate-200 mt-1">{stats.apiCallsCount} lượt gọi</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-sm text-left">
            <h3 className="text-xs font-bold text-slate-200 uppercase mb-3">Mô tả cấu trúc quản trị viên</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống quản trị này giúp ban giám hiệu và admin quản trị:
              <br />- **Cập nhật video bài giảng và tệp thực hành** lập tức cho học viên.
              <br />- **Quản lý danh sách câu hỏi ngân hàng đề thi thử** phục vụ thi chuẩn hóa MOS & IC3 GS6.
              <br />- **Kiểm soát dòng tiền & phê duyệt chuyển khoản VietQR**.
            </p>
          </div>
        </div>
      )}

      {/* 2. SECTION: COURSE MANAGEMENT VIEW */}
      {subSection === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Create new course form */}
          <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-sm h-fit">
            <h3 className="text-xs font-bold text-slate-200 uppercase mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-400" />
              Tạo khóa học mới
            </h3>
            <form onSubmit={handleAddCourseSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tên khóa học</label>
                <input
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                  type="text"
                  placeholder="ví dụ: Luyện thi MOS PowerPoint..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Chuyên mục</label>
                <select
                  value={cCat}
                  onChange={(e: any) => setCCat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100 cursor-pointer"
                >
                  <option value="cert">Chứng chỉ số quốc tế</option>
                  <option value="schools">Tin học phổ thông & HSG THCS</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Bản học (Badge / Nhãn)</label>
                <input
                  value={cBadge}
                  onChange={(e) => setCBadge(e.target.value)}
                  type="text"
                  placeholder="MOS PPT 2019"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Mô tả tóm tắt</label>
                <textarea
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  rows={3}
                  placeholder="Tóm tắt về khóa học cho học viên..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Đăng tải khóa học mới
              </button>
            </form>
          </div>

          {/* List of current courses in system */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Danh sách khóa học hiện tại</h3>
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex justify-between items-center gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/25 text-[9px] font-bold px-2 py-0.5 rounded">
                      {course.badge}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200">{course.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{course.description}</p>
                </div>
                <button
                  onClick={() => onDeleteCourse(course.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                  title="Xóa khóa học"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SECTION: EXAM MANAGEMENT VIEW */}
      {subSection === "exams" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Create custom exam question form */}
          <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-sm h-fit">
            <h3 className="text-xs font-bold text-slate-200 uppercase mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-400" />
              Thêm đề thi thử & Câu hỏi
            </h3>
            <form onSubmit={handleAddExamSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tên đề thi</label>
                <input
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  type="text"
                  placeholder="MOS Word 2019 Practice..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Thời gian (Phút)</label>
                  <input
                    value={eMinutes}
                    onChange={(e) => setEMinutes(Number(e.target.value))}
                    type="number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Phân mục</label>
                  <input
                    value={eCat}
                    onChange={(e) => setECat(e.target.value)}
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <label className="block text-[10px] uppercase font-extrabold text-indigo-400 mb-1">Nội dung câu hỏi</label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  rows={2}
                  placeholder="Đặt câu hỏi trắc nghiệm..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] text-slate-500 font-bold mb-0.5">Đáp án A</label>
                  <input
                    value={qOptA}
                    onChange={(e) => setQOptA(e.target.value)}
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 font-bold mb-0.5">Đáp án B</label>
                  <input
                    value={qOptB}
                    onChange={(e) => setQOptB(e.target.value)}
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Đáp án đúng</label>
                <select
                  value={qCorrect}
                  onChange={(e) => setQCorrect(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 cursor-pointer"
                >
                  <option value={0}>Đáp án A</option>
                  <option value={1}>Đáp án B</option>
                  <option value={2}>Đáp án C</option>
                  <option value={3}>Đáp án D</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Thêm đề thi & câu hỏi
              </button>
            </form>
          </div>

          {/* List of current prep exams */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Danh sách đề thi sẵn có</h3>
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex justify-between items-center gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/25 text-[9px] font-bold px-2 py-0.5 rounded">
                      {exam.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200">{exam.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {exam.questions.length} câu hỏi trắc nghiệm • {exam.timeMinutes} phút làm bài
                  </p>
                </div>
                <button
                  onClick={() => onDeleteExam(exam.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                  title="Xóa đề thi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SECTION: PAYMENTS / PURCHASE LOGS AUDIT */}
      {subSection === "payments" && (
        <div className="flex flex-col gap-3 text-left">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Danh sách hóa đơn chuyển khoản VietQR</h3>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5 font-bold">Mã HĐ</th>
                  <th className="p-3.5 font-bold">Học liệu mua</th>
                  <th className="p-3.5 font-bold">Số tiền</th>
                  <th className="p-3.5 font-bold">Cú pháp chuyển</th>
                  <th className="p-3.5 font-bold">Người mua</th>
                  <th className="p-3.5 font-bold">Trạng thái</th>
                  <th className="p-3.5 font-bold text-right">Duyệt ngân hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {purchaseLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/50 transition-colors">
                    <td className="p-3.5 font-mono text-[10px] font-bold text-slate-500">{log.id}</td>
                    <td className="p-3.5 font-bold text-slate-200">{log.itemName}</td>
                    <td className="p-3.5 font-black text-slate-200">{(log.price).toLocaleString()} đ</td>
                    <td className="p-3.5 font-mono font-bold text-indigo-450">{log.syntax}</td>
                    <td className="p-3.5 text-slate-400 font-medium">{log.buyerName}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          log.status === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {log.status === "success" ? "Thành công" : "Chờ quét"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {log.status === "pending" ? (
                        <button
                          onClick={() => onApprovePayment(log.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black flex items-center gap-1 ml-auto cursor-pointer shadow-sm transition-all"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Duyệt VietQR
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium font-mono">MB Auto OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
