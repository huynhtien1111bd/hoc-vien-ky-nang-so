import React, { useState, useEffect } from "react";
import { 
  House, BookOpen, FlaskConical, Bot, Store, Users, Map, Shield, GraduationCap, 
  Bell, ChevronRight, Download, Play, ShoppingCart, Lock, Key, LogOut, CheckCircle2 
} from "lucide-react";
import { Course, Exam, Resource, PurchaseLog, AdminStats } from "./types";
import { initialCourses, initialExams, initialResources, initialForumThreads } from "./data/initialData";

import VietQrModal from "./components/VietQrModal";
import CourseViewer from "./components/CourseViewer";
import AiTutorTab from "./components/AiTutorTab";
import ExamsTab from "./components/ExamsTab";
import StoreTab from "./components/StoreTab";
import CommunityTab from "./components/CommunityTab";
import AdminPortalTab from "./components/AdminPortalTab";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core LMS data states loaded from localStorage or fallback defaults
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [purchaseLogs, setPurchaseLogs] = useState<PurchaseLog[]>([]);
  const [preSelectedExamId, setPreSelectedExamId] = useState<string>("");
  
  // Shopping Cart & Auto Payment Modal States
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [checkoutPrice, setCheckoutPrice] = useState(0);
  const [checkoutSyntax, setCheckoutSyntax] = useState("");

  // Course Viewer player Modal States
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);

  // System Role State ('student' | 'instructor' | 'admin')
  const [systemRole, setSystemRole] = useState<"student" | "instructor" | "admin">("student");

  // Admin login credential prompt modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // AI Tutor contextual pre-set query from other panels
  const [aiPresetPrompt, setAiPresetPrompt] = useState<string>("");

  // Database connection status state
  const [dbStatus, setDbStatus] = useState<{ active: boolean; url: string | null } | null>(null);

  // System admin metrics
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 1450,
    totalRevenue: 82400000,
    totalCourses: 3,
    apiCallsCount: 142
  });

  // Floating Toast Notification
  const [toastMsg, setToastMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  // Initialize DB from LocalStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem("hvkns_courses");
    const savedExams = localStorage.getItem("hvkns_exams");
    const savedResources = localStorage.getItem("hvkns_resources");
    const savedThreads = localStorage.getItem("hvkns_threads");
    const savedLogs = localStorage.getItem("hvkns_logs");
    const savedStats = localStorage.getItem("hvkns_stats");

    if (savedCourses) setCourses(JSON.parse(savedCourses));
    else {
      setCourses(initialCourses);
      localStorage.setItem("hvkns_courses", JSON.stringify(initialCourses));
    }

    if (savedExams) setExams(JSON.parse(savedExams));
    else {
      setExams(initialExams);
      localStorage.setItem("hvkns_exams", JSON.stringify(initialExams));
    }

    if (savedResources) setResources(JSON.parse(savedResources));
    else {
      setResources(initialResources);
      localStorage.setItem("hvkns_resources", JSON.stringify(initialResources));
    }

    if (savedThreads) setThreads(JSON.parse(savedThreads));
    else {
      setThreads(initialForumThreads);
      localStorage.setItem("hvkns_threads", JSON.stringify(initialForumThreads));
    }

    if (savedLogs) setPurchaseLogs(JSON.parse(savedLogs));
    else {
      setPurchaseLogs([]);
    }

    if (savedStats) setAdminStats(JSON.parse(savedStats));
    else {
      localStorage.setItem("hvkns_stats", JSON.stringify(adminStats));
    }

    // Sync from server backend database on startup to stay consistent with custom API endpoints
    syncWithBackend();
  }, []);

  const [toastMessage, setToastMessage] = useState("");
  const [toastText, setToastText] = useState("");
  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    const toast = document.getElementById("reactToastNotification");
    if (toast) {
      toast.classList.remove("translate-y-20", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
      setTimeout(() => {
        toast.classList.remove("translate-y-0", 'opacity-100');
        toast.classList.add("translate-y-20", "opacity-0");
      }, 3000);
    }
  };

  const syncWithBackend = async () => {
    try {
      // 0. Fetch database connection status
      try {
        const statusRes = await fetch("/api/supabase-status");
        if (statusRes.ok) {
          const sData = await statusRes.json();
          setDbStatus(sData);
        }
      } catch (err) {
        console.warn("Could not check Supabase status:", err);
      }

      // 1. Fetch courses
      const coursesRes = await fetch("/api/courses");
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data);
        localStorage.setItem("hvkns_courses", JSON.stringify(data));
      }

      // 2. Fetch exams
      const examsRes = await fetch("/api/exams");
      if (examsRes.ok) {
        const data = await examsRes.json();
        setExams(data);
        localStorage.setItem("hvkns_exams", JSON.stringify(data));
      }

      // 3. Fetch purchase logs
      const logsRes = await fetch("/api/purchase-logs");
      if (logsRes.ok) {
        const data = await logsRes.json();
        setPurchaseLogs(data);
        localStorage.setItem("hvkns_logs", JSON.stringify(data));
      }

      // 4. Fetch admin stats
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setAdminStats(data);
        localStorage.setItem("hvkns_stats", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Backend sync failed, using localStorage fallbacks:", e);
    }
  };

  const handleForceSeed = async () => {
    showToastMsg("Đang đồng bộ và nạp dữ liệu mẫu lên Supabase...");
    try {
      const res = await fetch("/api/supabase-status?seed=true");
      if (res.ok) {
        const sData = await res.json();
        setDbStatus(sData);
        if (sData.active) {
          if (sData.tablesConfigured) {
            showToastMsg("Đồng bộ & Nạp dữ liệu mẫu thành công! 🎉");
            await syncWithBackend();
          } else {
            showToastMsg("⚠️ Đang thiếu các bảng. Hãy đảm bảo bạn đã chạy SQL trong file SUPABASE_SETUP.md");
          }
        } else {
          showToastMsg("⚠️ Supabase chưa được kích hoạt biến môi trường.");
        }
      }
    } catch (err) {
      showToastMsg("Không thể nạp dữ liệu mẫu. Hãy kiểm tra kết nối mạng.");
    }
  };


  // 1. ADD DOCUMENT TO CART
  const handleAddToCart = (itemName: string, itemPrice: number) => {
    if (cart.some((c) => c.name === itemName)) {
      showToastMsg("⚠️ Học liệu này đã nằm sẵn trong giỏ hàng!");
      return;
    }
    setCart((prev) => [...prev, { name: itemName, price: itemPrice }]);
    showToastMsg(`🛒 Đã thêm: "${itemName}" vào giỏ tài liệu số!`);
  };

  // 2. REMOVE DOCUMENT FROM CART
  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToastMsg("🗑️ Đã xóa học liệu khỏi giỏ hàng.");
  };

  // 3. SHOW VIETQR AUTOPAY CHECKOUT MODAL
  const handleCheckoutInit = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    setCheckoutPrice(total);
    const randCode = Math.floor(1000 + Math.random() * 9000);
    setCheckoutSyntax(`HVKNS-KHANG-${randCode}`);
    setIsQrOpen(true);
  };

  // 4. SIMULATE SUCCESSFUL BANK PAYMENT RECEIVED
  const handlePaymentSuccess = async () => {
    setIsQrOpen(false);

    try {
      const response = await fetch("/api/purchase-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: cart.map((c) => c.name).join(", "),
          price: checkoutPrice,
          buyerName: "Nguyễn Văn Khang",
          syntax: checkoutSyntax,
          status: "success"
        })
      });
      if (response.ok) {
        showToastMsg("🎉 Thanh toán thành công! Học liệu VIP đã được mở khóa tự động.");
        await syncWithBackend();
      } else {
        showToastMsg("⚠️ Có lỗi khi lưu hóa đơn giao dịch.");
      }
    } catch (err) {
      console.error("Payment registration failed:", err);
      showToastMsg("⚠️ Có lỗi khi kết nối máy chủ.");
    }

    setCart([]);
    setActiveTab("courses");
  };


  // 5. ATTEMPT SYSTEM ROLE CHANGE WITH PASS PROMPT FOR ADMIN
  const handleRoleSelection = (role: "student" | "instructor" | "admin") => {
    if (role === "admin") {
      setLoginError("");
      setLoginUser("");
      setLoginPass("");
      setShowLoginModal(true);
    } else if (role === "instructor") {
      setSystemRole("instructor");
      setActiveTab("instructor-portal");
      showToastMsg("💼 Đã chuyển sang bảng điều khiển Giảng viên.");
    } else {
      setSystemRole("student");
      setActiveTab("home");
      showToastMsg("🎓 Vai trò hiện tại: Nguyễn Văn Khang (Học viên)");
    }
  };

  // 6. EXECUTE ADMIN LOGIN CREDENTIAL CHECK (admin / admin)
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === "admin" && loginPass === "admin") {
      setSystemRole("admin");
      setShowLoginModal(false);
      setActiveTab("admin-portal");
      showToastMsg("🔑 Đăng nhập quản trị thành công! Chào mừng trở lại.");
    } else {
      setLoginError("Tài khoản hoặc mật khẩu không chính xác. Thử lại (admin/admin)!");
    }
  };

  const handleCourseRegister = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/register`, {
        method: "POST"
      });
      if (response.ok) {
        showToastMsg("📝 Đăng ký khóa học thành công! Bắt đầu học ngay.");
        await syncWithBackend();
      } else {
        showToastMsg("⚠️ Đăng ký khóa học không thành công.");
      }
    } catch (err) {
      console.error("Course registration failed:", err);
      showToastMsg("⚠️ Không thể kết nối với máy chủ.");
    }
  };

  // 8. ADD DISCUSSION THREAD TO FORUM STATE
  const handleAddThread = (title: string, category: string, content: string) => {
    const newThread = {
      id: "f_" + Date.now(),
      author: "Nguyễn Văn Khang (Lớp 8A)",
      avatarText: "NK",
      timeAgo: "Vừa xong",
      title: title,
      content: content,
      replies: 0,
      category: category
    };
    const updated = [newThread, ...threads];
    setThreads(updated);
    localStorage.setItem("hvkns_threads", JSON.stringify(updated));
  };

  // 9. EXAMS: ON CONSULT AI WRONG ANSWERS
  const handleConsultAiWrongAnswers = (examTitle: string, scoreStr: string, wrongTopic: string) => {
    const query = `Tôi vừa làm đề thi thử "${examTitle}" và đạt số điểm ${scoreStr}. Hãy phân tích chủ đề "${wrongTopic}" và đưa ra giải pháp giúp tôi cải thiện điểm số để thi MOS/IC3 an toàn.`;
    setAiPresetPrompt(query);
    setActiveTab("aitutor");
    showToastMsg("🤖 Đang tải câu hỏi phân tích từ AI Tutor...");
  };

  // 10. ADMIN CMS: ADD COURSE
  const handleAdminAddCourse = async (newCourseData: any) => {
    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourseData)
      });
      if (response.ok) {
        showToastMsg(`✅ Đã đăng tải khóa học mới thành công: "${newCourseData.title}"`);
        await syncWithBackend();
      } else {
        showToastMsg("⚠️ Có lỗi xảy ra khi tạo khóa học.");
      }
    } catch (err) {
      console.error("Add course failed:", err);
    }
  };

  // 11. ADMIN CMS: DELETE COURSE
  const handleAdminDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        showToastMsg("🗑️ Đã xóa khóa học khỏi hệ thống.");
        await syncWithBackend();
      } else {
        showToastMsg("⚠️ Có lỗi xảy ra khi xóa khóa học.");
      }
    } catch (err) {
      console.error("Delete course failed:", err);
    }
  };

  // 12. ADMIN CMS: ADD EXAM
  const handleAdminAddExam = async (newExamData: any) => {
    try {
      const response = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExamData)
      });
      if (response.ok) {
        showToastMsg(`✅ Đã thêm mới đề thi thử thành công: "${newExamData.title}"`);
        await syncWithBackend();
      } else {
        showToastMsg("⚠️ Có lỗi xảy ra khi tạo đề thi.");
      }
    } catch (err) {
      console.error("Add exam failed:", err);
    }
  };

  // 13. ADMIN CMS: DELETE EXAM
  const handleAdminDeleteExam = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/exams/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        showToastMsg("🗑️ Đã xóa đề thi chuẩn hóa.");
        await syncWithBackend();
      } else {
        showToastMsg("⚠️ Có lỗi xảy ra khi xóa đề thi.");
      }
    } catch (err) {
      console.error("Delete exam failed:", err);
    }
  };

  // 14. ADMIN CMS: APPROVE PURCHASE TRANSACTION
  const handleAdminApprovePayment = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/purchase-logs/${id}/approve`, {
        method: "POST"
      });
      if (response.ok) {
        const data = await response.json();
        showToastMsg(`✅ Đã duyệt VietQR MB Bank thành công cho giao dịch ${data.log?.syntax || ""}.`);
        await syncWithBackend();
      } else {
        showToastMsg("⚠️ Duyệt giao dịch không thành công.");
      }
    } catch (err) {
      console.error("Approve payment failed:", err);
    }
  };


  // Computed data calculations
  const activeCoursesProgress = courses.filter((c) => c.registered && c.progress < 100);

  return (
    <div className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* top HERO MARKETING BANNER */}
      <section className="w-full shrink-0 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b border-slate-850 py-6 md:py-8 lg:py-10 px-4 md:px-8 overflow-hidden shadow-lg text-left">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[10px] md:text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full w-fit uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              Học hôm nay - Làm chủ công nghệ ngày mai
            </div>
            
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black leading-tight text-white tracking-tight">
              HỆ THỐNG ĐÀO TẠO & ÔN THI <br />
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">CHỨNG CHỈ SỐ QUỐC TẾ</span> HÀNG ĐẦU
            </h2>
            
            <p className="text-[11px] md:text-xs text-slate-350 leading-relaxed max-w-xl">
              Tích hợp trợ lý <strong className="text-indigo-300">AI Tutor</strong> trực tuyến giải đáp lỗi viết hàm 24/7, ngân hàng đề thi thử <strong className="text-indigo-200">MOS, IC3 GS6</strong> bám sát đề thi thật cùng thư viện bồi dưỡng học sinh giỏi hoàn hảo.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Tỷ lệ thi đỗ</span>
                <span className="text-lg font-extrabold text-emerald-400">99.2%</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Học viên online</span>
                <span className="text-lg font-extrabold text-indigo-400">1,480+</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-left">
              <h4 className="text-[10px] text-amber-400 font-extrabold tracking-wider uppercase mb-2">Vào thi thử nhanh:</h4>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => { setActiveTab("exam"); setPreSelectedExamId("mos_excel"); }}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/60 hover:bg-slate-850/60 border border-slate-800 transition-all text-white cursor-pointer"
                >
                  <span className="text-[9px] font-bold">MOS Excel</span>
                </button>
                <button
                  onClick={() => { setActiveTab("exam"); setPreSelectedExamId("ic3_level1"); }}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/60 hover:bg-slate-850/60 border border-slate-800 transition-all text-white cursor-pointer"
                >
                  <span className="text-[9px] font-bold">IC3 GS6</span>
                </button>
                <button
                  onClick={() => { setActiveTab("courses"); }}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/60 hover:bg-slate-850/60 border border-slate-800 transition-all text-white cursor-pointer"
                >
                  <span className="text-[9px] font-bold">Khóa học</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEADER NAVBAR */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md shrink-0 z-30 sticky top-0 shadow-lg shadow-slate-950/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen((prev) => !prev)} 
              className="text-slate-400 hover:text-slate-250 text-lg p-1.5 cursor-pointer"
              title="Mở rộng menu"
            >
              <House className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xs font-black tracking-tight text-indigo-400 uppercase hidden sm:block">
                Học viện Kỹ năng Số
              </h1>
            </div>
          </div>

          {/* Role changer Matrix selector */}
          <div className="flex items-center gap-3">
            <div className="relative bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="text-[9px] uppercase font-bold text-slate-400">Vai trò:</span>
              <select
                value={systemRole}
                onChange={(e) => handleRoleSelection(e.target.value as any)}
                className="bg-transparent text-[11px] font-extrabold text-indigo-400 focus:outline-none cursor-pointer outline-none"
              >
                <option value="student" className="bg-slate-950 text-slate-200">Học viên</option>
                <option value="instructor" className="bg-slate-950 text-slate-200">Giảng viên</option>
                <option value="admin" className="bg-slate-950 text-slate-200">Quản trị viên (admin/admin)</option>
              </select>
            </div>

            <button
              onClick={() => showToastMsg("Không có thông báo mới.")}
              className="relative w-8 h-8 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </button>

            {dbStatus && (
              <button 
                onClick={dbStatus.active ? handleForceSeed : undefined}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium tracking-wide transition-all ${
                  dbStatus.active 
                    ? (dbStatus as any).tablesConfigured 
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer active:scale-95" 
                      : "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20 cursor-pointer active:scale-95 animate-pulse"
                    : "bg-slate-800/40 border-slate-700/65 text-slate-400"
                }`}
                title={
                  dbStatus.active 
                    ? (dbStatus as any).tablesConfigured 
                      ? `Kết nối Supabase ổn định: ${dbStatus.url}. Click để chạy nạp lại dữ liệu mẫu (Auto-Seed).` 
                      : `Đã kết nối nhưng thiếu bảng. Hãy chạy lệnh SQL trong file SUPABASE_SETUP.md. Click để kiểm tra & nạp lại.`
                    : "Đang sử dụng bộ nhớ cục bộ tạm thời"
                }
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  dbStatus.active 
                    ? (dbStatus as any).tablesConfigured 
                      ? "bg-emerald-400 animate-pulse" 
                      : "bg-amber-400 animate-bounce"
                    : "bg-slate-500"
                }`}></span>
                <span>
                  {dbStatus.active 
                    ? (dbStatus as any).tablesConfigured 
                      ? "Supabase Connected" 
                      : "Supabase (Nạp dữ liệu mẫu)"
                    : "Local Database"}
                </span>
              </button>
            )}

            {/* Profile widget bar */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
                {systemRole === "admin" ? "AD" : systemRole === "instructor" ? "GV" : "HV"}
              </div>
              <div className="hidden lg:block text-left">
                <h4 className="text-[11px] font-bold text-slate-200">
                  {systemRole === "admin" ? "Admin CMS" : systemRole === "instructor" ? "Thầy Trần Đức Hùng" : "Nguyễn Văn Khang"}
                </h4>
                <p className="text-[8px] text-indigo-400 uppercase font-bold">
                  {systemRole === "admin" ? "Administrator" : systemRole === "instructor" ? "Giảng viên" : "Học viên Đăng ký"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CORE FRAME CONTAINER: SIDEBAR + MAIN AREA */}
      <div className="flex-1 flex overflow-hidden relative max-w-7xl mx-auto w-full">
        
        {/* Sidebar Nav rail */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } bg-slate-900/60 border-r border-slate-800 shrink-0 flex flex-col justify-between z-20 h-full transition-all duration-300 text-left`}
        >
          <div className="p-3 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h3 className={`text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 ${!sidebarOpen && 'sr-only'}`}>
                Chương trình
              </h3>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "home" ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-250 border border-transparent"
                  }`}
                >
                  <House className="w-4 h-4 text-slate-400" />
                  {sidebarOpen && <span>Tổng quan học tập</span>}
                </button>

                <button
                  onClick={() => setActiveTab("courses")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "courses" ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-250 border border-transparent"
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  {sidebarOpen && <span>Kho khóa học ôn thi</span>}
                </button>

                <button
                  onClick={() => setActiveTab("exam")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "exam" ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-250 border border-transparent"
                  }`}
                >
                  <FlaskConical className="w-4 h-4 text-slate-400" />
                  {sidebarOpen && <span>Phòng Thi Thử</span>}
                </button>

                <button
                  onClick={() => setActiveTab("aitutor")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "aitutor" ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-250 border border-transparent"
                  }`}
                >
                  <Bot className="w-4 h-4 text-indigo-400 animate-pulse-slow" />
                  {sidebarOpen && <span>Gia sư AI Tutor</span>}
                </button>
              </nav>
            </div>

            <div>
              <h3 className={`text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 ${!sidebarOpen && 'sr-only'}`}>
                Học liệu & Tài nguyên
              </h3>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("store")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "store" ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-250 border border-transparent"
                  }`}
                >
                  <Store className="w-4 h-4 text-slate-400" />
                  {sidebarOpen && <span>Cửa hàng tài liệu</span>}
                </button>

                <button
                  onClick={() => setActiveTab("community")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "community" ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-250 border border-transparent"
                  }`}
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  {sidebarOpen && <span>Diễn đàn thảo luận</span>}
                </button>
              </nav>
            </div>

            {/* Special Administrative views shortcut */}
            {systemRole !== "student" && (
              <div>
                <h3 className={`text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 ${!sidebarOpen && 'sr-only'}`}>
                  Cổng nghiệp vụ
                </h3>
                <nav className="flex flex-col gap-1">
                  {systemRole === "instructor" && (
                    <button
                      onClick={() => setActiveTab("instructor-portal")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "instructor-portal" ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-350 font-black" : "text-indigo-400 hover:bg-slate-800/50 hover:text-indigo-350 border border-transparent"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      {sidebarOpen && <span>Portal Giảng viên</span>}
                    </button>
                  )}

                  {systemRole === "admin" && (
                    <button
                      onClick={() => setActiveTab("admin-portal")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "admin-portal" ? "bg-rose-500/10 border border-rose-500/25 text-rose-300 font-black animate-pulse" : "text-rose-400 hover:bg-slate-800/50 hover:text-rose-350 border border-transparent"
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      {sidebarOpen && <span>Bảng quản trị CMS</span>}
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse mr-2"></span>
            {sidebarOpen && <span className="text-[9px] text-slate-400 font-mono font-bold">Phiên bản LMS v2.1</span>}
          </div>
        </aside>

        {/* Scrollable Main Content Container */}
        <main className="flex-1 bg-slate-950 overflow-y-auto flex flex-col relative border-l border-slate-800" id="appMainScrollable">
          
          {/* TAB 1: HOME PANEL */}
          {activeTab === "home" && (
            <div className="p-6 flex flex-col gap-8 text-left">
              
              {/* Active studying progress */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-slate-900/50 border border-slate-800 px-4 py-2.5 rounded-2xl inline-flex items-center gap-2 shadow-sm mb-4">
                  <Play className="w-4 h-4 text-indigo-400 animate-pulse" />
                  Khóa học đang học dở của bạn
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCoursesProgress.map((course) => (
                    <div
                      key={course.id}
                      className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all shadow-lg"
                    >
                      <div className="min-w-0">
                        <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-extrabold text-[9px] uppercase px-2 py-1 rounded-md">
                          {course.badge}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-100 mt-2.5 truncate">{course.title}</h4>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          <span>{course.lessonsCount} bài giảng</span>
                          <span>•</span>
                          <span>Đã hoàn thành {course.progress}%</span>
                        </div>
                        <div className="w-32 h-1.5 bg-slate-950 rounded-full mt-2.5 overflow-hidden border border-slate-800/40">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>

                      <button
                        onClick={() => setViewingCourseId(course.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer shadow-sm"
                      >
                        Học tiếp
                      </button>
                    </div>
                  ))}

                  {activeCoursesProgress.length === 0 && (
                    <div className="col-span-full bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500">
                      <p className="text-xs">Bạn chưa đăng ký khóa học nào. Hãy truy cập tab "Kho khóa học ôn thi" nhé!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* General resources cards from HTML */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-slate-900/50 border border-slate-800 px-4 py-2.5 rounded-2xl inline-flex items-center gap-2 shadow-sm mb-4">
                  Học liệu tiêu biểu tiêu thụ cao
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {resources.slice(0, 4).map((res) => (
                    <div
                      key={res.id}
                      className="bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[8px] font-black uppercase px-2 py-0.5 rounded w-fit">
                          {res.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-2">{res.title}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{res.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-200">
                          {res.type === "free" ? "Miễn phí" : `${res.price.toLocaleString()} đ`}
                        </span>
                        {res.type === "free" ? (
                          <button
                            onClick={() => showToastMsg(`🚀 Đã tải: ${res.title}`)}
                            className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-850 text-slate-200 text-[10px] font-bold rounded-xl transition-all cursor-pointer border border-slate-750"
                          >
                            Tải về
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(res.title, res.price)}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Mua tài liệu
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COURSES TAB */}
          {activeTab === "courses" && (
            <div className="p-6 flex flex-col gap-6 text-left">
              <div>
                <h2 className="text-sm font-black text-slate-100">Kho khóa học chuẩn hóa</h2>
                <p className="text-xs text-slate-400 mt-1">Đăng ký tham gia ngay để bắt đầu lộ trình rèn luyện công nghệ.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-indigo-950/25 transition-all group"
                  >
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] font-extrabold px-2.5 py-1 rounded uppercase">
                          {course.category === "cert" ? "Chứng chỉ số" : "Giải thuật"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{course.badge}</span>
                      </div>
                      <h3 className="text-xs font-extrabold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="p-5 border-t border-slate-850 bg-slate-950/40 flex items-center justify-between gap-4">
                      {course.registered ? (
                        <>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-500">Đã đăng ký</span>
                            <p className="text-xs font-black text-slate-350">{course.progress}% hoàn tất</p>
                          </div>
                          <button
                            onClick={() => setViewingCourseId(course.id)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                          >
                            Vào học tiếp
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-slate-500">Chưa kích hoạt</span>
                          <button
                            onClick={() => handleCourseRegister(course.id)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
                          >
                            Đăng ký miễn phí
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE EXAM PLAYFIELD */}
          {activeTab === "exam" && (
            <ExamsTab
              exams={exams}
              showToast={showToastMsg}
              onConsultAi={handleConsultAiWrongAnswers}
              preSelectedExamId={preSelectedExamId}
              clearPreSelectedExamId={() => setPreSelectedExamId("")}
            />
          )}

          {/* TAB 4: AI TUTOR CONVERSATION */}
          {activeTab === "aitutor" && (
            <AiTutorTab
              showToast={showToastMsg}
              presetPrompt={aiPresetPrompt}
              clearPresetPrompt={() => setAiPresetPrompt("")}
            />
          )}

               {/* TAB: INSTRUCTOR PORTAL VIEW */}
          {activeTab === "instructor-portal" && (
            <div className="p-6 flex flex-col gap-6 text-left">
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                <h2 className="text-sm font-black text-indigo-300">Bảng điều khiển nghiệp vụ Giảng viên</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nơi bạn quản lý thông báo, tạo cập nhật cho học viên, và xem thống kê doanh số chia sẻ khóa học.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Học sinh đăng ký học</span>
                    <h3 className="text-lg font-extrabold text-slate-200 mt-1">154 Học sinh</h3>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Doanh thu chia sẻ</span>
                    <h3 className="text-lg font-extrabold text-emerald-400 mt-1">24.500.000 đ</h3>
                  </div>
                </div>
              </div>

              {/* Announcement helper creation tool */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-300 uppercase mb-3">Tạo thông báo giảng dạy</h3>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Tiêu đề thông báo..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Nội dung gửi cho học sinh toàn trường..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                  <button
                    onClick={() => showToastMsg("🎉 Đã phát hành thông báo lớp học thành công!")}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all w-fit cursor-pointer"
                  >
                    Gửi thông báo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM ADMIN PORTAL VIEW */}
          {activeTab === "admin-portal" && systemRole === "admin" && (
            <AdminPortalTab
              courses={courses}
              exams={exams}
              purchaseLogs={purchaseLogs}
              stats={adminStats}
              onAddCourse={handleAdminAddCourse}
              onDeleteCourse={handleAdminDeleteCourse}
              onAddExam={handleAdminAddExam}
              onDeleteExam={handleAdminDeleteExam}
              onApprovePayment={handleAdminApprovePayment}
              onRefresh={syncWithBackend}
            />
          )}

        </main>
      </div>

      {/* ADMIN CREDENTIALS LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl relative animate-fade-in text-left">
            <button
              onClick={() => { setShowLoginModal(false); setSystemRole("student"); }}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-200 transition-colors"
              title="Đóng"
            >
              <XCloseIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 animate-pulse" />
              <span>Xác minh quản trị viên</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn cần mật khẩu ủy quyền để truy cập CMS quản trị hệ thống. Nhập tài khoản dùng thử bên dưới:
            </p>

            <form onSubmit={handleAdminLoginSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tài khoản</label>
                <input
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  type="text"
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs focus:outline-none focus:border-rose-500 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Mật khẩu</label>
                <input
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  type="password"
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs focus:outline-none focus:border-rose-500 text-slate-200"
                  required
                />
              </div>

              {loginError && (
                <div className="text-[10px] font-bold text-rose-400 bg-rose-950/20 border border-rose-900/30 rounded-lg p-2 leading-relaxed">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-1 cursor-pointer"
              >
                Xác minh (admin / admin)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AUTOMATIC QR BANK SIMULATOR MODAL */}
      <VietQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        price={checkoutPrice}
        syntax={checkoutSyntax}
        onSuccess={handlePaymentSuccess}
      />

      {/* LESSONS AND QUIZZES COURSE PLAYER MODAL */}
      {viewingCourseId && (
        <CourseViewer
          course={courses.find((c) => c.id === viewingCourseId) || null}
          onClose={() => setViewingCourseId(null)}
          showToast={showToastMsg}
        />
      )}

      {/* FLOATING ACTION TOAST */}
      <div
        id="reactToastNotification"
        className="fixed bottom-4 right-4 bg-slate-900 border border-slate-800 text-xs text-slate-200 px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="font-medium text-slate-300">{toastMessage}</span>
      </div>

    </div>
  );
}

function XCloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
