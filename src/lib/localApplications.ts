import type { Application } from "../types/application";

const APPLICATIONS_STORAGE_KEY = "joinus-local-applications";
const APPLICATIONS_CHANGED_EVENT = "joinus-local-applications-changed";

function readStoredApplications(): Application[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as Application[];
  } catch (error) {
    console.error("Failed to read stored applications", error);
    return [];
  }
}

function writeStoredApplications(applications: Application[]) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(
    APPLICATIONS_STORAGE_KEY,
    JSON.stringify(applications)
  );
  notifyApplicationsChanged();
}

function notifyApplicationsChanged() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(APPLICATIONS_CHANGED_EVENT));
}

export function getLocalApplications(): Application[] {
  return readStoredApplications();
}

export function addLocalApplication(application: Application) {
  const existing = readStoredApplications();
  const updated = [...existing, application];
  writeStoredApplications(updated);
}

export function getLocalApplicationsForUser(userId: string) {
  return readStoredApplications().filter(
    (application) => application.applicantId === userId
  );
}

export function getLocalApplicationsForClub(clubId: string) {
  return readStoredApplications().filter(
    (application) => application.clubId === clubId
  );
}

export function findLocalApplicationById(applicationId: string) {
  return readStoredApplications().find(
    (application) => application.id === applicationId
  );
}

export function upsertLocalApplication(
  application: Application,
  patch: Partial<Application>
): Application {
  const existing = readStoredApplications().filter(
    (item) => item.id !== application.id
  );
  const updated = { ...application, ...patch };
  const next = [...existing, updated];
  writeStoredApplications(next);
  return updated;
}

export const LOCAL_APPLICATIONS_EVENT = APPLICATIONS_CHANGED_EVENT;
