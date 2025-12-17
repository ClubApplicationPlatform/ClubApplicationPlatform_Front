import type { Notice } from "../types/notice";

const NOTICES_STORAGE_KEY = "joinus-local-notices";
const NOTICES_CHANGED_EVENT = "joinus-local-notices-changed";

function readStoredNotices(): Record<string, Notice[]> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = localStorage.getItem(NOTICES_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }
    return parsed as Record<string, Notice[]>;
  } catch (error) {
    console.error("Failed to read stored notices", error);
    return {};
  }
}

function writeStoredNotices(payload: Record<string, Notice[]>) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(payload));
  notifyNoticesChanged();
}

function notifyNoticesChanged() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(NOTICES_CHANGED_EVENT));
}

export function getLocalNoticesForClub(clubId: string) {
  const data = readStoredNotices();
  return data[clubId] ?? [];
}

export function saveLocalNoticesForClub(clubId: string, notices: Notice[]) {
  const data = readStoredNotices();
  const next = { ...data, [clubId]: notices };
  writeStoredNotices(next);
}

export const LOCAL_NOTICES_EVENT = NOTICES_CHANGED_EVENT;
