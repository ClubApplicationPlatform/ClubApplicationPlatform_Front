export type ApplicationStatus =
  | "pending"
  | "document_passed"
  | "interview_scheduled"
  | "accepted"
  | "rejected";

export interface ApplicationAnswer {
  question: string;
  answer: string;
}

export interface DocumentResult {
  status: "passed" | "failed";
  message: string;
  decidedAt: string;
}

export interface ApplicationResult {
  status: "accepted" | "rejected";
  message: string;
  decidedAt: string;
  openChatLink?: string;
}

export interface Application {
  id: string;
  clubId: string;
  clubName: string;
  applicantId: string;
  applicantName: string;
  studentId: string;
  department: string;
  phone: string;
  status: ApplicationStatus;
  answers: ApplicationAnswer[];
  appliedAt: string;
  interviewSlot: string | null;
  interviewLocation?: string | null;
  documentResult?: DocumentResult | null;
  result?: ApplicationResult | null;
}
