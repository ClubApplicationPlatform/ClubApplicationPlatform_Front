import { useMemo } from "react";
import { useAuthStore } from "../stores/authStore";
import { getCampusById, matchCampusByEmail, type Campus } from "../lib/campuses";

export function useActiveCampus(): Campus | null {
  const user = useAuthStore((state) => state.user);

  return useMemo(() => {
    if (!user) {
      return null;
    }
    return getCampusById(user.campusId) ?? matchCampusByEmail(user.email);
  }, [user]);
}

export function useActiveCampusId(): string | null {
  const campus = useActiveCampus();
  return campus?.id ?? null;
}
