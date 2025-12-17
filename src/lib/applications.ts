import { mockApplications } from "./mockData";
import type { Application } from "../types/application";
import {
  getLocalApplications,
  getLocalApplicationsForClub,
  getLocalApplicationsForUser,
  findLocalApplicationById,
  upsertLocalApplication,
} from "./localApplications";
import type { InterviewSlot } from "../types/interview";

function mergeApplications(payload: Application[], additional: Application[]) {
  return [...payload, ...additional];
}

export function getAllApplications(): Application[] {
  return mergeApplications(mockApplications, getLocalApplications());
}

export function getApplicationsForUser(userId: string): Application[] {
  const local = getLocalApplicationsForUser(userId);
  return mergeApplications(
    mockApplications.filter((application) => application.applicantId === userId),
    local
  );
}

export function getApplicationsForClub(clubId: string): Application[] {
  return mergeApplications(
    mockApplications.filter((application) => application.clubId === clubId),
    getLocalApplicationsForClub(clubId)
  );
}

export function findApplication(applicationId: string): Application | undefined {
  return (
    findLocalApplicationById(applicationId) ??
    mockApplications.find((application) => application.id === applicationId)
  );
}

export function assignInterviewSlot(
  applicationId: string,
  slot: InterviewSlot
): Application | undefined {
  const application = findApplication(applicationId);
  if (!application) return undefined;
  return upsertLocalApplication(application, {
    interviewSlot: `${slot.date} ${slot.startTime}-${slot.endTime}`,
    interviewLocation: slot.location,
    status: "interview_scheduled",
  });
}

export { upsertLocalApplication } from "./localApplications";
