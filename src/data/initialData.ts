import { Course, Exam, Resource } from "../types";

export const initialCourses: Course[] = [
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

export const initialExams: Exam[] = [
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

export const initialResources: Resource[] = [
  {
    id: "store_1",
    title: "Bộ 15 đề thi thử MOS Excel 2019 kèm file thực hành",
    category: "MOS Excel",
    description: "Tổng hợp trọn bộ 15 đề luyện thi chính thức có file dữ liệu nguồn .xlsx đi kèm phục vụ thực hành trực tiếp.",
    price: 199000,
    type: "paid",
    downloadCount: 1240
  },
  {
    id: "store_2",
    title: "Ebook tóm tắt toàn bộ lý thuyết IC3 GS6 (Level 1)",
    category: "IC3 GS6",
    description: "Kiến thức cô đọng nhất về phần cứng, phần mềm, mạng máy tính chuẩn hóa theo ngân hàng câu hỏi chính thức.",
    price: 0,
    type: "free",
    downloadCount: 4890
  },
  {
    id: "store_3",
    title: "50 File Bài tập lập trình Python thi HSG THCS",
    category: "HSG Tin Học",
    description: "Tuyển tập 50 thuật toán số học, đệ quy, xử lý mảng từ cơ bản đến nâng cao phục vụ thi Olympic THCS.",
    price: 0,
    type: "free",
    downloadCount: 3200
  },
  {
    id: "store_4",
    title: "Combo Thiết kế đồ họa Canva AI & Prompt thông minh",
    category: "Canva AI",
    description: "Hướng dẫn chi tiết sử dụng các tính năng thông minh của Canva AI phục vụ làm slide thuyết trình sáng tạo.",
    price: 149000,
    type: "paid",
    downloadCount: 950
  },
  {
    id: "store_5",
    title: "Sổ tay cấu trúc dữ liệu và giải thuật C++ cho HSG THCS",
    category: "C++",
    description: "Bao gồm toàn bộ các cấu trúc ngăn xếp (Stack), hàng đợi (Queue), cây và thuật toán đồ thị cơ bản.",
    price: 99000,
    type: "paid",
    downloadCount: 740
  }
];

export const initialForumThreads = [
  {
    id: "f_1",
    author: "Trần Minh Hiếu (Lớp 8C)",
    avatarText: "MH",
    timeAgo: "5 phút trước",
    title: "Làm sao để giải quyết lỗi tràn bộ nhớ đệ quy trong Python vậy ạ?",
    content: "Em đang code giải bài toán quy hoạch động cấp thành phố trong tập đề thi cũ nhưng cứ chạy dữ liệu lớn là bị báo lỗi Recursion Error. Có cách nào tăng giới hạn đệ quy trong Python hay đổi sang tối ưu vòng lặp không ạ?",
    replies: 5,
    category: "Python HSG"
  },
  {
    id: "f_2",
    author: "Lê Quốc Thịnh (Lớp 9A)",
    avatarText: "QT",
    timeAgo: "2 giờ trước",
    title: "Làm sao phân biệt nhanh các phím tắt tham chiếu trong MOS Excel?",
    content: "Mỗi lần em làm đề thi thử phần cố định vùng em hay bị nhầm lẫn giữa cố định hàng hay cố định cột. Khi ấn phím F4, thứ tự xoay vòng của nó là như thế nào để ghi nhớ nhanh nhất ạ?",
    replies: 3,
    category: "MOS Excel"
  }
];
