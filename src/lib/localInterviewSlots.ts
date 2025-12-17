import type { InterviewSlot } from "../types/interview";

const SLOT_STORAGE_KEY = "joinus-local-interview-slots";

interface StoredInterviewSlot extends InterviewSlot {
  applicants?: string[];
}

function readSlots(): StoredInterviewSlot[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(SLOT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredInterviewSlot[];
  } catch (error) {
    console.error("Failed to read interview slots", error);
    return [];
  }
}

function writeSlots(slots: StoredInterviewSlot[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify(slots));
}

export function getLocalInterviewSlots(clubId: string) {
  return readSlots().filter((slot) => slot.clubId === clubId);
}

export function addLocalInterviewSlot(slot: InterviewSlot) {
  const current = readSlots();
  const next: StoredInterviewSlot = {
    ...slot,
    currentCount: slot.currentCount ?? 0,
    location: slot.location ?? "미정",
    applicants: [],
  };
  writeSlots([...current, next]);
  return next;
}

export function updateLocalInterviewSlot(
  slotId: string,
  patch: Partial<StoredInterviewSlot>
) {
  const slots = readSlots();
  const index = slots.findIndex((slot) => slot.id === slotId);
  if (index === -1) {
    return null;
  }
  const updated = { ...slots[index], ...patch };
  slots[index] = updated;
  writeSlots(slots);
  return updated;
}

export function bookInterviewSlot(slotId: string, applicantId: string) {
  const slots = readSlots();
  const slot = slots.find((item) => item.id === slotId);
  if (!slot) {
    return null;
  }
  if ((slot.applicants?.length ?? 0) >= (slot.capacity ?? 0)) {
    return null;
  }
  slot.applicants = [...(slot.applicants ?? []), applicantId];
  slot.currentCount = (slot.currentCount ?? 0) + 1;
  writeSlots(slots);
  return slot;
}

export function deleteLocalInterviewSlot(slotId: string) {
  const slots = readSlots();
  const filtered = slots.filter((slot) => slot.id !== slotId);
  if (filtered.length === slots.length) {
    return false;
  }
  writeSlots(filtered);
  return true;
}
