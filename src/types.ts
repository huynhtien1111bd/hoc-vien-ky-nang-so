export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
}

export interface CourseQuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface Course {
  id: string;
  title: string;
  category: 'cert' | 'schools';
  description: string;
  lessonsCount: number;
  examCount: number;
  registered: boolean;
  progress: number; // percentage 0 - 100
  badge: string;
  files: { name: string; size: string }[];
  quiz: CourseQuizQuestion[];
  lessons?: Lesson[];
}

export interface ExamQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface Exam {
  id: string;
  title: string;
  questionsCount: number;
  timeMinutes: number;
  questions: ExamQuestion[];
  category: string;
  badge: string;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  type: 'free' | 'paid';
  downloadCount: number;
}

export interface PurchaseLog {
  id: string;
  itemName: string;
  price: number;
  buyerName: string;
  syntax: string;
  date: string;
  status: 'pending' | 'success';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  totalCourses: number;
  apiCallsCount: number;
}
