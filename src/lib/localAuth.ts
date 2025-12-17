import type { AuthUser } from "../stores/authStore";

const USERS_STORAGE_KEY = "joinus-local-users";

interface StoredLocalUser extends AuthUser {
  password: string;
}

function readUsers(): StoredLocalUser[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry): entry is StoredLocalUser => Boolean(entry?.email));
  } catch (error) {
    console.error("Failed to parse stored users", error);
    return [];
  }
}

function writeUsers(users: StoredLocalUser[]) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function findLocalUserByEmail(email: string): StoredLocalUser | undefined {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((user) => user.email.toLowerCase() === normalized);
}

export function registerLocalUser({
  email,
  password,
  nickname,
  campusId,
  role = "user",
}: {
  email: string;
  password: string;
  nickname: string;
  campusId: string;
  role?: AuthUser["role"];
}): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = findLocalUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("이미 등록된 이메일입니다.");
  }

  const timestamp = Date.now();
  const newUser: StoredLocalUser = {
    id: `local-${timestamp}`,
    email: normalizedEmail,
    nickname: nickname.trim(),
    role,
    campusId,
    password,
  };

  const updated = [...readUsers(), newUser];
  writeUsers(updated);

  const { password: _p, ...payload } = newUser;
  return payload;
}

export function authenticateLocalUser(
  email: string,
  password: string
): AuthUser {
  const user = findLocalUserByEmail(email);
  if (!user) {
    throw new Error("등록된 계정이 없습니다.");
  }
  if (user.password !== password) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
  const { password: _p, ...payload } = user;
  return payload;
}
