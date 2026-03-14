"use client";

export type User = {
  id: string;
  email: string;
  password: string; // fake store, do NOT use in production
  fullName?: string;
  createdAt: string;
};

const USERS_KEY = "ttm_users_v1";
const SESSION_KEY = "ttm_session_v1";

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(userId: string | null) {
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
}

function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function register(email: string, password: string, fullName?: string) {
  const users = readUsers();
  const exists = users.find((u) => u.email === email.toLowerCase());
  if (exists) {
    return { ok: false, error: "Пользователь с таким почтой уже существует" };
  }

  const newUser: User = {
    id: Math.random().toString(36).slice(2, 9),
    email: email.toLowerCase(),
    password: password,
    fullName: fullName || "",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  setSession(newUser.id);
  return { ok: true, user: newUser };
}

export function login(email: string, password: string) {
  const users = readUsers();
  const user = users.find(
    (u) => u.email === email.toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: "Неверные email или пароль" };
  setSession(user.id);
  return { ok: true, user };
}

export function logout() {
  setSession(null);
}

export function getCurrentUser(): User | null {
  const sid = getSession();
  if (!sid) return null;
  const users = readUsers();
  return users.find((u) => u.id === sid) ?? null;
}

export function updateProfile(
  updates: Partial<Pick<User, "fullName" | "email">>
) {
  const sid = getSession();
  if (!sid) return { ok: false, error: "Не авторизован" };
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === sid);
  if (idx === -1) return { ok: false, error: "Пользователь не найден" };

  if (updates.email) users[idx].email = updates.email.toLowerCase();
  if (updates.fullName !== undefined) users[idx].fullName = updates.fullName;

  writeUsers(users);
  return { ok: true, user: users[idx] };
}

export default { register, login, logout, getCurrentUser, updateProfile };
