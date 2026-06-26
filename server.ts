import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

let useSupabase = false;
let supabase: any = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    });
    useSupabase = true;
    console.log("Supabase client initialized successfully at: " + supabaseUrl);
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
} else {
  console.warn("Supabase credentials not found in environment. Falling back to in-memory store.");
}


const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database to keep state real and interactive
let courses = [
  {
    id: "ic3_gs6",
    title: "Luyện thi chứng chỉ quốc tế IC3 GS6 (Đầy đủ Level 1, 2, 3)",
    category: "cert",
    description: "Đạt chứng chỉ phổ cập công nghệ quốc tế nhanh nhất thông qua ngân hàng đề chuẩn Certiport và hướng dẫn chi tiết của chuyên gia tin học.",
    lessonsCount: 20,
    examCount: 15,
    registered: true,
    progress: 90,
    badge: "IC3 GS6",
    files: [
      { name: "Sách_tóm_tắt_lý_thuyết_Level_1_PDF.pdf", size: "1.2 MB" },
      { name: "Sơ_đồ_khái_niệm_phần_cứng_máy_tính.png", size: "450 KB" }
    ],
    quiz: [
      { q: "Hệ điều hành máy tính (OS) thuộc danh mục nào sau đây?", options: ["Phần cứng", "Thiết bị ngoại vi", "Phần mềm hệ thống", "Phần mềm ứng dụng"], correct: 2 }
    ],
    lessons: [
      { id: "l1", title: "Bài 01: Giới thiệu chứng chỉ IC3 GS6 & Cấu trúc bài thi", duration: "12:30" },
      { id: "l2", title: "Bài 02: Khái niệm về Phần cứng, Phần mềm và Hệ điều hành", duration: "18:45" },
      { id: "l3", title: "Bài 03: Thiết bị lưu trữ và Quản lý tệp tin khoa học", duration: "15:20" },
      { id: "l4", title: "Bài 04: Căn bản về mạng máy tính và bảo mật tài khoản", duration: "22:10" }
    ]
  },
  {
    id: "excel_mos",
    title: "Luyện thi chứng chỉ MOS Excel (2019 & 365) - Bao đỗ 99%",
    category: "cert",
    description: "Nắm vững các kỹ năng lập bảng biểu phức tạp, định dạng có điều kiện, các hàm nâng cao (VLOOKUP, INDEX, MATCH) và thao tác thi chuẩn hóa.",
    lessonsCount: 24,
    examCount: 10,
    registered: true,
    progress: 50,
    badge: "MOS Expert",
    files: [
      { name: "Bài_thực_hành_Hàm_IF_Excel.xlsx", size: "154 KB" },
      { name: "Bộ_bài_tập_Mẹo_VLOOKUP_độc_quyền.xlsx", size: "202 KB" }
    ],
    quiz: [
      { q: "Hàm nào sau đây trả về giá trị dựa trên chỉ số dòng và cột cho trước trong bảng tính?", options: ["VLOOKUP", "INDEX", "MATCH", "HLOOKUP"], correct: 1 }
    ],
    lessons: [
      { id: "e1", title: "Bài 01: Làm quen giao diện và Thao tác vùng dữ liệu Excel", duration: "10:15" },
      { id: "e2", title: "Bài 02: Định dạng bảng biểu chuyên nghiệp (Format Styles)", duration: "14:30" },
      { id: "e3", title: "Bài 03: Kỹ năng viết hàm logic: IF, AND, OR, lồng nhau", duration: "25:40" },
      { id: "e4", title: "Bài 04: Hàm tra cứu dữ liệu tối ưu: VLOOKUP & XLOOKUP", duration: "30:15" }
    ]
  },
  {
    id: "python_hsg",
    title: "Bồi dưỡng học sinh giỏi Tin học THCS - Lập trình Python chuyên sâu",
    category: "schools",
    description: "Khám phá thế giới cấu trúc dữ liệu giải thuật, đệ quy, quy hoạch động, thiết lập tư duy giải các bài toán Olympic Tin học cấp cơ sở.",
    lessonsCount: 30,
    examCount: 8,
    registered: false,
    progress: 0,
    badge: "HSG Tin Học",
    files: [
      { name: "50_De_thi_HSG_Tin_hoc_THCS_co_dap_an.pdf", size: "3.5 MB" },
      { name: "Tuyet_chieu_on_thi_Tin_hoc_tre_Python.docx", size: "820 KB" }
    ],
    quiz: [
      { q: "Độ phức tạp thuật toán tối ưu của việc tìm kiếm nhị phân trên mảng đã sắp xếp là gì?", options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"], correct: 1 }
    ],
    lessons: [
      { id: "p1", title: "Bài 01: Cấu trúc điều khiển & Kiểu dữ liệu nâng cao trong Python", duration: "15:10" },
      { id: "p2", title: "Bài 02: Thuật toán Đệ quy và Phân tích độ phức tạp thời gian", duration: "22:45" },
      { id: "p3", title: "Bài 03: Cấu trúc dữ liệu Danh sách liên kết, Ngăn xếp & Hàng đợi", duration: "28:30" }
    ]
  }
];

let exams = [
  {
    id: "mos_excel",
    title: "MOS Excel 2019 Practice Test",
    questionsCount: 3,
    timeMinutes: 15,
    category: "MOS",
    badge: "Excel 2019",
    questions: [
      {
        q: "Trong Excel, hàm nào dùng để tìm kiếm giá trị ở cột đầu tiên của một bảng dữ liệu và trả về giá trị trong cùng dòng từ một cột khác?",
        options: ["INDEX", "HLOOKUP", "VLOOKUP", "MATCH"],
        correct: 2
      },
      {
        q: "Phím tắt chuẩn nào được sử dụng để chuyển đổi vùng tham chiếu từ Tương đối (A1) sang Tuyệt đối ($A$1) trong Excel?",
        options: ["F2", "F4", "F8", "F11"],
        correct: 1
      },
      {
        q: "Kết quả của công thức =AND(5>3, 2=4) trong Excel là gì?",
        options: ["TRUE", "FALSE", "#VALUE!", "#NAME?"],
        correct: 1
      }
    ]
  },
  {
    id: "ic3_level1",
    title: "IC3 GS6 Level 1 - Concept số",
    questionsCount: 5,
    timeMinutes: 20,
    category: "IC3",
    badge: "Level 1",
    questions: [
      {
        q: "Hành vi nào sau đây giúp bảo vệ an toàn thông tin cá nhân tốt nhất khi truy cập mạng xã hội?",
        options: ["Sử dụng mật khẩu ngắn để dễ nhớ", "Kích hoạt bảo mật xác thực hai yếu tố (2FA)", "Chia sẻ định vị thời gian thực của bạn", "Đăng nhập tài khoản trên mọi thiết bị công cộng"],
        correct: 1
      },
      {
        q: "Thiết bị nào sau đây đóng vai trò là 'bộ não' điều khiển và thực thi mọi phép toán, tập lệnh của máy tính?",
        options: ["Bộ nhớ RAM", "Ổ cứng SSD", "Bộ vi xử lý trung tâm CPU", "Bộ nguồn PSU"],
        correct: 2
      },
      {
        q: "Công nghệ đám mây nào sau đây được tích hợp sẵn trong hệ điều hành Windows 11?",
        options: ["Google Drive", "OneDrive", "Dropbox", "iCloud"],
        correct: 1
      },
      {
        q: "Khi nhận một email chứa file đính kèm từ người lạ, hành vi nào sau đây là an toàn nhất?",
        options: ["Mở file ngay để kiểm tra nội dung", "Quét virus và xác minh danh tính người gửi trước khi tải", "Chuyển tiếp cho bạn bè cùng xem", "Lưu về ổ cứng rồi bấm mở luôn"],
        correct: 1
      },
      {
        q: "Đơn vị đo lường tốc độ kết nối internet thông dụng là gì?",
        options: ["GHz", "Mbps", "GB", "DPI"],
        correct: 1
      }
    ]
  }
];

let purchaseLogs = [
  {
    id: "log_1",
    itemName: "Bộ đề MOS Excel 2019",
    price: 199000,
    buyerName: "Nguyễn Văn Khang",
    syntax: "HVKNS-KHANG-8842",
    date: "2026-06-25 21:30",
    status: "success"
  },
  {
    id: "log_2",
    itemName: "Combo Canva AI Prompt",
    price: 149000,
    buyerName: "Nguyễn Văn Khang",
    syntax: "HVKNS-KHANG-2035",
    date: "2026-06-25 23:10",
    status: "pending"
  }
];

let apiCallsCount = 142;
let systemStats = {
  totalUsers: 1450,
  totalRevenue: 82400000,
  totalCourses: 3,
};

// Supabase table presence state to prevent unnecessary DB calls and errors when tables do not exist yet
let coursesTableExists = true;
let examsTableExists = true;
let purchaseLogsTableExists = true;

// Supabase helper functions & auto-seeding
async function seedCourses() {
  if (!useSupabase || !coursesTableExists) return;
  try {
    console.log("Seeding default courses to Supabase...");
    for (const c of courses) {
      const { error } = await supabase.from("courses").insert({
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description,
        lessons_count: c.lessonsCount,
        exam_count: c.examCount,
        registered: c.registered,
        progress: c.progress,
        badge: c.badge,
        files: c.files,
        quiz: c.quiz,
        lessons: c.lessons
      });
      if (error) {
        console.warn(`Error seeding course ${c.id}:`, error.message);
      } else {
        console.log(`Successfully seeded course: ${c.id}`);
      }
    }
  } catch (err: any) {
    console.warn("Failed to seed courses:", err.message);
  }
}

async function seedExams() {
  if (!useSupabase || !examsTableExists) return;
  try {
    console.log("Seeding default exams to Supabase...");
    for (const e of exams) {
      const { error } = await supabase.from("exams").insert({
        id: e.id,
        title: e.title,
        questions_count: e.questionsCount,
        time_minutes: e.timeMinutes,
        category: e.category,
        badge: e.badge,
        questions: e.questions
      });
      if (error) {
        console.warn(`Error seeding exam ${e.id}:`, error.message);
      } else {
        console.log(`Successfully seeded exam: ${e.id}`);
      }
    }
  } catch (err: any) {
    console.warn("Failed to seed exams:", err.message);
  }
}

async function seedPurchaseLogs() {
  if (!useSupabase || !purchaseLogsTableExists) return;
  try {
    console.log("Seeding default purchase logs to Supabase...");
    for (const l of purchaseLogs) {
      const { error } = await supabase.from("purchase_logs").insert({
        id: l.id,
        item_name: l.itemName,
        price: l.price,
        buyer_name: l.buyerName,
        syntax: l.syntax,
        date: l.date,
        status: l.status
      });
      if (error) {
        console.warn(`Error seeding purchase log ${l.id}:`, error.message);
      } else {
        console.log(`Successfully seeded purchase log: ${l.id}`);
      }
    }
  } catch (err: any) {
    console.warn("Failed to seed purchase logs:", err.message);
  }
}

async function getCoursesFromDb() {
  if (!useSupabase || !coursesTableExists) return courses;
  try {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: true });
    if (error) {
      if (error.code === "P0001" || error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("⚠️ courses table does not exist in Supabase yet. Falling back to memory.");
        coursesTableExists = false;
      }
      throw error;
    }
    if (data && data.length > 0) {
      return data.map((c: any) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description,
        lessonsCount: c.lessons_count ?? c.lessonsCount ?? 10,
        examCount: c.exam_count ?? c.examCount ?? 5,
        registered: c.registered,
        progress: c.progress ?? 0,
        badge: c.badge,
        files: c.files || [],
        quiz: c.quiz || [],
        lessons: c.lessons || []
      }));
    } else {
      console.log("Courses table is empty in Supabase. Auto-seeding initial courses...");
      await seedCourses();
      return courses;
    }
  } catch (err: any) {
    console.warn("Failed to fetch courses from Supabase, falling back to memory:", err.message);
    return courses;
  }
}

async function getExamsFromDb() {
  if (!useSupabase || !examsTableExists) return exams;
  try {
    const { data, error } = await supabase.from("exams").select("*").order("created_at", { ascending: true });
    if (error) {
      if (error.code === "P0001" || error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("⚠️ exams table does not exist in Supabase yet. Falling back to memory.");
        examsTableExists = false;
      }
      throw error;
    }
    if (data && data.length > 0) {
      return data.map((e: any) => ({
        id: e.id,
        title: e.title,
        questionsCount: e.questions_count ?? e.questionsCount ?? 0,
        timeMinutes: e.time_minutes ?? e.timeMinutes ?? 15,
        category: e.category,
        badge: e.badge,
        questions: e.questions || []
      }));
    } else {
      console.log("Exams table is empty in Supabase. Auto-seeding initial exams...");
      await seedExams();
      return exams;
    }
  } catch (err: any) {
    console.warn("Failed to fetch exams from Supabase, falling back to memory:", err.message);
    return exams;
  }
}

async function getPurchaseLogsFromDb() {
  if (!useSupabase || !purchaseLogsTableExists) return purchaseLogs;
  try {
    const { data, error } = await supabase.from("purchase_logs").select("*").order("created_at", { ascending: false });
    if (error) {
      if (error.code === "P0001" || error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("⚠️ purchase_logs table does not exist in Supabase yet. Falling back to memory.");
        purchaseLogsTableExists = false;
      }
      throw error;
    }
    if (data && data.length > 0) {
      return data.map((l: any) => ({
        id: l.id,
        itemName: l.item_name ?? l.itemName,
        price: l.price,
        buyerName: l.buyer_name ?? l.buyerName,
        syntax: l.syntax,
        date: l.date,
        status: l.status
      }));
    } else {
      console.log("Purchase logs table is empty in Supabase. Auto-seeding initial purchase logs...");
      await seedPurchaseLogs();
      return purchaseLogs;
    }
  } catch (err: any) {
    console.warn("Failed to fetch purchase logs from Supabase, falling back to memory:", err.message);
    return purchaseLogs;
  }
}

async function registerCourseInDb(courseId: string) {
  if (!useSupabase) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.registered = true;
      course.progress = 0;
      return course;
    }
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("courses")
      .update({ registered: true, progress: 0 })
      .eq("id", courseId)
      .select();
    if (error) throw error;
    if (data && data.length > 0) {
      const c = data[0];
      return {
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description,
        lessonsCount: c.lessons_count ?? c.lessonsCount ?? 10,
        examCount: c.exam_count ?? c.examCount ?? 5,
        registered: c.registered,
        progress: c.progress ?? 0,
        badge: c.badge,
        files: c.files || [],
        quiz: c.quiz || [],
        lessons: c.lessons || []
      };
    }
    return null;
  } catch (err: any) {
    console.warn("Failed to register course in Supabase:", err.message);
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.registered = true;
      course.progress = 0;
      return course;
    }
    return null;
  }
}

async function addCourseToDb(course: any) {
  if (!useSupabase) {
    courses.push(course);
    return course;
  }
  try {
    const { error } = await supabase
      .from("courses")
      .insert({
        id: course.id,
        title: course.title,
        category: course.category,
        description: course.description,
        lessons_count: course.lessonsCount,
        exam_count: course.examCount,
        registered: course.registered,
        progress: course.progress,
        badge: course.badge,
        files: course.files,
        quiz: course.quiz,
        lessons: course.lessons
      });
    if (error) throw error;
    return course;
  } catch (err: any) {
    console.warn("Failed to add course to Supabase:", err.message);
    courses.push(course);
    return course;
  }
}

async function deleteCourseFromDb(courseId: string) {
  if (!useSupabase) {
    const initialLength = courses.length;
    courses = courses.filter(c => c.id !== courseId);
    return courses.length < initialLength;
  }
  try {
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.warn("Failed to delete course from Supabase:", err.message);
    const initialLength = courses.length;
    courses = courses.filter(c => c.id !== courseId);
    return courses.length < initialLength;
  }
}

async function addExamToDb(exam: any) {
  if (!useSupabase) {
    exams.push(exam);
    return exam;
  }
  try {
    const { error } = await supabase
      .from("exams")
      .insert({
        id: exam.id,
        title: exam.title,
        questions_count: exam.questionsCount,
        time_minutes: exam.timeMinutes,
        category: exam.category,
        badge: exam.badge,
        questions: exam.questions
      });
    if (error) throw error;
    return exam;
  } catch (err: any) {
    console.warn("Failed to add exam to Supabase:", err.message);
    exams.push(exam);
    return exam;
  }
}

async function deleteExamFromDb(examId: string) {
  if (!useSupabase) {
    const initialLength = exams.length;
    exams = exams.filter(e => e.id !== examId);
    return exams.length < initialLength;
  }
  try {
    const { error } = await supabase.from("exams").delete().eq("id", examId);
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.warn("Failed to delete exam from Supabase:", err.message);
    const initialLength = exams.length;
    exams = exams.filter(e => e.id !== examId);
    return exams.length < initialLength;
  }
}

async function addPurchaseLogToDb(log: any) {
  if (!useSupabase) {
    purchaseLogs.push(log);
    return log;
  }
  try {
    const { error } = await supabase
      .from("purchase_logs")
      .insert({
        id: log.id,
        item_name: log.itemName,
        price: log.price,
        buyer_name: log.buyerName,
        syntax: log.syntax,
        date: log.date,
        status: log.status
      });
    if (error) throw error;
    return log;
  } catch (err: any) {
    console.warn("Failed to add purchase log to Supabase:", err.message);
    purchaseLogs.push(log);
    return log;
  }
}

async function approvePurchaseLogInDb(logId: string) {
  if (!useSupabase) {
    const log = purchaseLogs.find(l => l.id === logId);
    if (log) {
      log.status = "success";
      systemStats.totalRevenue += log.price;

      let courseNameMatch = "";
      if (log.itemName.includes("MOS Excel")) courseNameMatch = "excel_mos";
      else if (log.itemName.includes("IC3")) courseNameMatch = "ic3_gs6";
      else if (log.itemName.includes("Python")) courseNameMatch = "python_hsg";

      if (courseNameMatch) {
        const course = courses.find(c => c.id === courseNameMatch);
        if (course) course.registered = true;
      }
      return log;
    }
    return null;
  }
  try {
    const { data: logs, error: fetchError } = await supabase.from("purchase_logs").select("*").eq("id", logId);
    if (fetchError) throw fetchError;
    if (!logs || logs.length === 0) return null;
    
    const log = logs[0];
    
    const { error: updateError } = await supabase
      .from("purchase_logs")
      .update({ status: "success" })
      .eq("id", logId);
    if (updateError) throw updateError;
    
    let courseNameMatch = "";
    const itemName = log.item_name ?? log.itemName ?? "";
    if (itemName.includes("MOS Excel")) courseNameMatch = "excel_mos";
    else if (itemName.includes("IC3")) courseNameMatch = "ic3_gs6";
    else if (itemName.includes("Python")) courseNameMatch = "python_hsg";

    if (courseNameMatch) {
      await supabase
        .from("courses")
        .update({ registered: true })
        .eq("id", courseNameMatch);
    }
    
    return {
      id: log.id,
      itemName: itemName,
      price: log.price,
      buyerName: log.buyer_name ?? log.buyerName,
      syntax: log.syntax,
      date: log.date,
      status: "success"
    };
  } catch (err: any) {
    console.warn("Failed to approve transaction in Supabase:", err.message);
    const log = purchaseLogs.find(l => l.id === logId);
    if (log) {
      log.status = "success";
      systemStats.totalRevenue += log.price;

      let courseNameMatch = "";
      if (log.itemName.includes("MOS Excel")) courseNameMatch = "excel_mos";
      else if (log.itemName.includes("IC3")) courseNameMatch = "ic3_gs6";
      else if (log.itemName.includes("Python")) courseNameMatch = "python_hsg";

      if (courseNameMatch) {
        const course = courses.find(c => c.id === courseNameMatch);
        if (course) course.registered = true;
      }
      return log;
    }
    return null;
  }
}

async function getAdminStatsFromDb() {
  const currentCourses = await getCoursesFromDb();
  const currentExams = await getExamsFromDb();
  const currentLogs = await getPurchaseLogsFromDb();

  const successLogs = currentLogs.filter((l: any) => l.status === "success");
  const baseRevenue = 82400000;
  const additionalRevenue = successLogs.reduce((sum: number, l: any) => sum + (Number(l.price) || 0), 0);

  return {
    totalUsers: 1450,
    totalRevenue: baseRevenue + additionalRevenue,
    totalCourses: currentCourses.length,
    totalExams: currentExams.length,
    totalLogs: currentLogs.length,
    apiCallsCount: apiCallsCount
  };
}


// Lazy initialization of Gemini client to prevent startup crashes
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables. AI Tutor will fall back to smart simulated answers.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API Routes

// Chat with Gemini API (Proxy)
app.post("/api/ai/chat", async (req, res) => {
  const { prompt, chatHistory = [], context = "" } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  apiCallsCount++;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Fallback response when key is missing or not configured
      const simulatedText = getSimulatedAnswer(prompt, context);
      return res.json({ text: simulatedText });
    }

    const ai = getAiClient();
    const systemInstruction = `
Bạn là AI Tutor - một giáo viên / gia sư công nghệ cực kỳ thông thái, tận tâm và thân thiện của "Học viện Kỹ năng Số" (HVKNS).
Nhiệm vụ của bạn là bồi dưỡng, giải đáp thắc mắc và hướng dẫn ôn luyện cho các học sinh ôn thi chứng chỉ quốc tế MOS Word, MOS Excel, IC3 GS6 và các môn học lập trình phổ thông THCS (Scratch, Python, C++).
Hãy nói bằng tiếng Việt rõ ràng, ngắn gọn, dễ hiểu, sử dụng markdown để trình bày đẹp mắt. Tránh viết quá dài dòng và luôn tạo động lực học tập.

Bối cảnh hiện tại của học viên: ${context || "Đang học tổng quan"}
`;

    // Format chat history for @google/genai SDK
    // It accepts contents array.
    const contents: any[] = [];
    
    // Add history if present
    for (const msg of chatHistory) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "Xin lỗi, tôi chưa nghĩ ra câu trả lời phù hợp." });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Không thể kết nối với trí tuệ nhân tạo Gemini.", 
      details: error.message,
      text: "⚠️ Hiện tại kết nối AI đang bận hoặc khóa API của bạn chưa cấu hình đúng. Tôi đề xuất mẹo làm bài nhanh:\n- Trong Excel: Phím **F4** chuyển đổi tham chiếu, **VLOOKUP** cần tham số cuối là **0** (False) để dò tìm tuyệt đối.\n- IC3 GS6: Hãy luôn bật xác thực 2 bước (2FA) để bảo vệ tài khoản số."
    });
  }
});

// Helper for high-quality mock answers when API key is missing
function getSimulatedAnswer(prompt: string, context: string): string {
  const clean = prompt.toLowerCase();
  let text = "";

  if (clean.includes("excel") || clean.includes("vlookup") || clean.includes("hàm") || context.includes("excel")) {
    text = `### 💡 Hướng dẫn ôn luyện MOS Excel từ AI Tutor:

Trong MOS Excel, lỗi phổ biến nhất của các bạn học sinh là thiếu tham chiếu tuyệt đối (Sử dụng dấu \`$\`). 

* **Tuyệt chiêu:** Nhấn phím **F4** sau khi chọn ô để tự động chèn nhanh dấu \`$\` (ví dụ: \`$A$1:$B$10\`). Điều này cố định bảng dò tìm khi sao chép công thức.
* **Hàm dò tìm VLOOKUP:** Công thức chuẩn là \`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`. Luôn nhớ để tham số thứ tư là \`0\` hoặc \`FALSE\` để dò tìm chính xác tuyệt đối nhé!

Bạn có muốn tôi tạo một câu hỏi trắc nghiệm thử thách nhanh về hàm Excel không?`;
  } else if (clean.includes("ic3") || clean.includes("bảo mật") || clean.includes("mạng") || context.includes("ic3")) {
    text = `### 🛡️ Trợ lý bảo mật số IC3 GS6:

Bài thi IC3 GS6 tập trung rất nhiều vào **An toàn kỹ thuật số** và **Cộng tác trực tuyến**. Để vượt qua bài thi dễ dàng, hãy chú ý các khái niệm cốt lõi sau:

1. **Xác thực hai yếu tố (2FA):** Là cách tối ưu nhất để bảo vệ mọi tài khoản mạng xã hội và email. Ngoài mật khẩu, hệ thống sẽ yêu cầu mã OTP gửi về điện thoại hoặc ứng dụng authenticator.
2. **Phần cứng & Phần mềm:** RAM là bộ nhớ truy cập ngẫu nhiên, dữ liệu sẽ bị mất khi tắt máy. SSD/HDD là bộ nhớ lưu trữ vĩnh viễn dữ liệu. CPU là trung tâm điều khiển thực thi toàn bộ tác vụ.

Bạn có thắc mắc cụ thể nào về phần cứng hay mạng máy tính cần tôi làm rõ thêm không?`;
  } else if (clean.includes("python") || clean.includes("giải thuật") || clean.includes("hsg") || clean.includes("thuật toán")) {
    text = `### 🐍 Góc giải thuật Python HSG cùng AI Tutor:

Để giải tốt các bài toán trong đề thi HSG Tin học THCS bằng Python, bạn cần nắm vững:

* **Tối ưu hóa độ phức tạp thuật toán:** Tránh sử dụng các vòng lặp lồng nhau sâu khi dữ liệu lớn ($N > 10^4$). Chuyển sang dùng **Tìm kiếm nhị phân** với độ phức tạp $O(\\log N)$ thay vì tìm tuyến tính $O(N)$.
* **Xử lý đệ quy:** Hãy nhớ thiết lập điểm dừng (base case) chính xác để tránh lỗi tràn bộ nhớ (RecursionError).

Bạn đang gặp khó khăn ở bài toán cụ thể nào? Hãy gửi mã code lỗi của bạn lên để tôi cùng phân tích sửa lỗi nhé!`;
  } else {
    text = `### 🌟 Chào mừng bạn đến với AI Tutor của Học viện Kỹ năng Số!

Tôi có thể hỗ trợ bạn đắc lực trong hành trình làm chủ công nghệ và chinh phục các chứng chỉ tin học quốc tế:

* 📊 **MOS Excel & Word:** Mẹo làm bài thi thực hành, gỡ rối lỗi viết hàm tính toán phức tạp.
* 💻 **IC3 GS6:** Căn bản số, bảo mật mạng, hệ điều hành đám mây.
* 🐍 **Lập trình THCS:** Hướng dẫn thuật toán Python, Scratch, C++ ôn thi HSG.

Hãy thử đặt câu hỏi như: *"Giải thích giúp tôi hàm INDEX MATCH"* hoặc *"Mẹo nhớ lý thuyết bảo mật IC3"* để bắt đầu nhé!`;
  }

  return text;
}

// Supabase configuration status API
app.get("/api/supabase-status", async (req, res) => {
  const forceSeed = req.query.seed === "true";

  if (useSupabase) {
    // Probe courses table
    if (!coursesTableExists || forceSeed) {
      try {
        const { data, error } = await supabase.from("courses").select("id").limit(1);
        const existsNow = !error || (!error.message?.includes("does not exist") && error.code !== "42P01" && error.code !== "P0001");
        if (existsNow) {
          const wasMissing = !coursesTableExists;
          coursesTableExists = true;
          console.log("⚡ Supabase courses table detected!");
          
          // If table is empty or forced, trigger auto-seed
          if (wasMissing || forceSeed || !data || data.length === 0) {
            await seedCourses();
          }
        }
      } catch (err) {
        console.warn("Probe courses table failed:", err);
      }
    }

    // Probe exams table
    if (!examsTableExists || forceSeed) {
      try {
        const { data, error } = await supabase.from("exams").select("id").limit(1);
        const existsNow = !error || (!error.message?.includes("does not exist") && error.code !== "42P01" && error.code !== "P0001");
        if (existsNow) {
          const wasMissing = !examsTableExists;
          examsTableExists = true;
          console.log("⚡ Supabase exams table detected!");
          
          if (wasMissing || forceSeed || !data || data.length === 0) {
            await seedExams();
          }
        }
      } catch (err) {
        console.warn("Probe exams table failed:", err);
      }
    }

    // Probe purchase_logs table
    if (!purchaseLogsTableExists || forceSeed) {
      try {
        const { data, error } = await supabase.from("purchase_logs").select("id").limit(1);
        const existsNow = !error || (!error.message?.includes("does not exist") && error.code !== "42P01" && error.code !== "P0001");
        if (existsNow) {
          const wasMissing = !purchaseLogsTableExists;
          purchaseLogsTableExists = true;
          console.log("⚡ Supabase purchase_logs table detected!");
          
          if (wasMissing || forceSeed || !data || data.length === 0) {
            await seedPurchaseLogs();
          }
        }
      } catch (err) {
        console.warn("Probe purchase_logs table failed:", err);
      }
    }
  }

  res.json({
    active: useSupabase,
    url: supabaseUrl ? supabaseUrl : null,
    tablesConfigured: coursesTableExists && examsTableExists && purchaseLogsTableExists,
    missingTables: {
      courses: !coursesTableExists,
      exams: !examsTableExists,
      purchase_logs: !purchaseLogsTableExists
    }
  });
});

// Get Courses
app.get("/api/courses", async (req, res) => {
  const data = await getCoursesFromDb();
  res.json(data);
});

// Update course progress or register (Admin or student simulated action)
app.post("/api/courses/:id/register", async (req, res) => {
  const courseId = req.params.id;
  const course = await registerCourseInDb(courseId);
  if (course) {
    res.json({ success: true, course });
  } else {
    res.status(404).json({ error: "Không tìm thấy khóa học" });
  }
});

// Admin Route: Add course
app.post("/api/admin/courses", async (req, res) => {
  const { title, category, description, lessonsCount, examCount, badge, files, quiz } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: "Tiêu đề và danh mục là bắt buộc" });
  }

  const newCourse = {
    id: "course_" + Date.now(),
    title,
    category,
    description: description || "",
    lessonsCount: Number(lessonsCount) || 10,
    examCount: Number(examCount) || 5,
    registered: false,
    progress: 0,
    badge: badge || "New Certificate",
    files: files || [],
    quiz: quiz || [],
    lessons: [
      { id: "l_new_1", title: "Bài 01: Nhập môn và Khái niệm nền tảng", duration: "10:00" }
    ]
  };

  const course = await addCourseToDb(newCourse);
  res.json({ success: true, course });
});

// Admin Route: Delete course
app.delete("/api/admin/courses/:id", async (req, res) => {
  const courseId = req.params.id;
  const success = await deleteCourseFromDb(courseId);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Không tìm thấy khóa học" });
  }
});

// Get Exams
app.get("/api/exams", async (req, res) => {
  const data = await getExamsFromDb();
  res.json(data);
});

// Admin Route: Add Exam
app.post("/api/admin/exams", async (req, res) => {
  const { title, timeMinutes, questions, category, badge } = req.body;
  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Tiêu đề và danh sách câu hỏi là bắt buộc" });
  }

  const newExam = {
    id: "exam_" + Date.now(),
    title,
    questionsCount: questions.length,
    timeMinutes: Number(timeMinutes) || 15,
    category: category || "General",
    badge: badge || "Practice Test",
    questions
  };

  const exam = await addExamToDb(newExam);
  res.json({ success: true, exam });
});

// Admin Route: Delete Exam
app.delete("/api/admin/exams/:id", async (req, res) => {
  const examId = req.params.id;
  const success = await deleteExamFromDb(examId);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Không tìm thấy đề thi" });
  }
});

// Get purchase logs
app.get("/api/purchase-logs", async (req, res) => {
  const data = await getPurchaseLogsFromDb();
  res.json(data);
});

// Add purchase log (triggered on VietQR creation or completion)
app.post("/api/purchase-logs", async (req, res) => {
  const { itemName, price, buyerName, syntax, status } = req.body;
  
  const newLog = {
    id: "log_" + Date.now(),
    itemName,
    price: Number(price) || 0,
    buyerName: buyerName || "Nguyễn Văn Khang",
    syntax: syntax || `HVKNS-KHANG-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: status || "pending"
  };

  const log = await addPurchaseLogToDb(newLog);
  res.json({ success: true, log });
});

// Admin Route: Approve/Success Purchase Log (Unlocks specific course automatically!)
app.post("/api/admin/purchase-logs/:id/approve", async (req, res) => {
  const logId = req.params.id;
  const log = await approvePurchaseLogInDb(logId);
  if (log) {
    res.json({ success: true, log });
  } else {
    res.status(404).json({ error: "Không tìm thấy hóa đơn giao dịch" });
  }
});

// Admin stats
app.get("/api/admin/stats", async (req, res) => {
  const stats = await getAdminStatsFromDb();
  res.json(stats);
});


// Vite & Static assets hosting logic
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode: integration with Vite dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built bundle from /dist directory
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });
}

// Only start the standalone Express listener if NOT running in a Vercel Serverless Function environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
