import type { ClubQuestion } from "../types/question";

const QUESTIONS_STORAGE_KEY = "joinus-local-questions";
const QUESTIONS_CHANGED_EVENT = "joinus-local-questions-changed";

function readStoredQuestions(): Record<string, ClubQuestion[]> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }
    return parsed as Record<string, ClubQuestion[]>;
  } catch (error) {
    console.error("Failed to read stored questions", error);
    return {};
  }
}

function writeStoredQuestions(payload: Record<string, ClubQuestion[]>) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(payload));
  notifyQuestionsChanged();
}

function notifyQuestionsChanged() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(QUESTIONS_CHANGED_EVENT));
}

export function getLocalQuestionsForClub(clubId: string) {
  const data = readStoredQuestions();
  return data[clubId] ?? [];
}

export function saveLocalQuestionsForClub(clubId: string, questions: ClubQuestion[]) {
  const data = readStoredQuestions();
  const next = { ...data, [clubId]: questions };
  writeStoredQuestions(next);
}

export const LOCAL_QUESTIONS_EVENT = QUESTIONS_CHANGED_EVENT;
