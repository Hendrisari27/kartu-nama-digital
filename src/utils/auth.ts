/**
 * Lapisan autentikasi frontend-only.
 *
 * CATATAN KEAMANAN: Semua data akun & sesi disimpan di localStorage browser dan
 * password hanya di-hash (SHA-256), bukan dienkripsi dengan aman. Ini cocok untuk
 * demo / kontrol akses ringan, BUKAN pengganti autentikasi backend sungguhan.
 */

export type UserRole = 'admin' | 'user';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  /** Hash SHA-256 dari password (hex). */
  passwordHash: string;
  role: UserRole;
  createdAt: number;
}

/** Data user tanpa hash password, aman dipakai di UI. */
export type SafeUser = Omit<StoredUser, 'passwordHash'>;

const USERS_KEY = 'knd_users';
const SESSION_KEY = 'knd_session';

// Akun admin bawaan (seed) agar aplikasi bisa langsung dipakai.
const DEFAULT_ADMIN = {
  name: 'Administrator',
  email: 'saya.hendrians@gmail.com',
  password: 'Hendrisari27',
  role: 'admin' as UserRole,
};

// Akun bawaan yang selalu dipastikan ada (admin + user default).
const SEED_ACCOUNTS: { name: string; email: string; password: string; role: UserRole }[] = [
  DEFAULT_ADMIN,
  {
    name: 'Marketing Arcamanik',
    email: 'marketing.arcamanik@herminahospitals.com',
    password: 'mkt123',
    role: 'user',
  },
];

// Email admin bawaan lama yang perlu dimigrasikan otomatis ke kredensial baru
// pada instalasi yang sudah terlanjur menyimpan akun admin versi sebelumnya.
const LEGACY_ADMIN_EMAILS = ['admin@hermina.com'];

/**
 * Hash fallback (non-kriptografis) untuk lingkungan tanpa Web Crypto
 * (mis. konteks non-secure). Diberi prefix agar bisa dibedakan dari hash SHA-256.
 * Cukup untuk kontrol akses ringan frontend-only.
 */
function fallbackHash(password: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (let i = 0; i < password.length; i++) {
    const c = password.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 + c + i, 0x01000193) >>> 0;
  }
  return 'fb$' + h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

/**
 * Menghasilkan hash password. Memakai Web Crypto (SHA-256) bila tersedia,
 * dan jatuh ke fallback bila `crypto.subtle` tidak ada (mis. konteks non-secure)
 * agar registrasi/login tetap berfungsi di lingkungan seperti preview iframe.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    if (
      typeof crypto !== 'undefined' &&
      crypto.subtle &&
      typeof crypto.subtle.digest === 'function'
    ) {
      const data = new TextEncoder().encode(password);
      const digest = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // Abaikan dan gunakan fallback di bawah.
  }
  return fallbackHash(password);
}

function generateId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    throw new Error(
      'Tidak dapat menyimpan akun. Nonaktifkan mode penyamaran/privat atau izinkan penyimpanan situs, lalu coba lagi.'
    );
  }
}

function toSafeUser(user: StoredUser): SafeUser {
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * Memastikan akun bawaan (admin + user default) tersedia. Dipanggil sekali
 * saat aplikasi dimulai.
 *
 * - Migrasi akun admin bawaan lama (mis. admin@hermina.com) ke kredensial admin terbaru.
 * - Menambahkan setiap akun di SEED_ACCOUNTS yang belum ada, sehingga akun
 *   admin & user default selalu bisa dipakai baik di instalasi baru maupun lama.
 */
export async function ensureSeedAdmin(): Promise<void> {
  let users = readUsers();
  const defaultAdminEmail = DEFAULT_ADMIN.email.toLowerCase();
  let changed = false;

  // Migrasi akun admin bawaan lama -> admin terbaru (bila admin terbaru belum ada).
  if (!users.some((u) => u.email === defaultAdminEmail)) {
    const legacyIndex = users.findIndex(
      (u) => u.role === 'admin' && LEGACY_ADMIN_EMAILS.includes(u.email)
    );
    if (legacyIndex !== -1) {
      users = [...users];
      users[legacyIndex] = {
        ...users[legacyIndex],
        name: DEFAULT_ADMIN.name,
        email: defaultAdminEmail,
        passwordHash: await hashPassword(DEFAULT_ADMIN.password),
        role: 'admin',
      };
      changed = true;
    }
  }

  // Pastikan setiap akun bawaan ada.
  for (const seed of SEED_ACCOUNTS) {
    const email = seed.email.toLowerCase();
    if (users.some((u) => u.email === email)) continue;
    users = [
      ...users,
      {
        id: generateId(),
        name: seed.name,
        email,
        passwordHash: await hashPassword(seed.password),
        role: seed.role,
        createdAt: Date.now(),
      },
    ];
    changed = true;
  }

  if (changed) writeUsers(users);
}

/** Mengembalikan seluruh user (tanpa hash password). */
export function listUsers(): SafeUser[] {
  return readUsers()
    .map(toSafeUser)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export type VerifyResult =
  | { ok: true; user: SafeUser }
  | { ok: false; reason: 'not_found' | 'wrong_password' };

/**
 * Memverifikasi kredensial dengan alasan kegagalan yang spesifik.
 * Menangani hash lama (SHA-256) maupun fallback secara transparan.
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<VerifyResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) return { ok: false, reason: 'not_found' };

  // Cocokkan dengan hash utama (SHA-256/fallback saat ini).
  const hash = await hashPassword(password);
  if (hash === user.passwordHash) return { ok: true, user: toSafeUser(user) };

  // Kompatibilitas: bila hash tersimpan dibuat dengan metode berbeda
  // (mis. akun lama SHA-256 tetapi lingkungan kini memakai fallback, atau sebaliknya),
  // coba cocokkan juga dengan hash fallback murni.
  if (user.passwordHash === fallbackHash(password)) {
    return { ok: true, user: toSafeUser(user) };
  }

  return { ok: false, reason: 'wrong_password' };
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Menambah user baru. Melempar Error bila email sudah dipakai.
 */
export async function createUser(input: CreateUserInput): Promise<SafeUser> {
  const users = readUsers();
  const email = input.email.trim().toLowerCase();

  if (users.some((u) => u.email === email)) {
    throw new Error('Email sudah terdaftar.');
  }

  const user: StoredUser = {
    id: generateId(),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    createdAt: Date.now(),
  };

  writeUsers([...users, user]);
  return toSafeUser(user);
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  /** Bila diisi, password diganti. Bila kosong/undefined, password lama dipertahankan. */
  password?: string;
  role?: UserRole;
}

/**
 * Memperbarui user berdasarkan id. Melempar Error bila email bentrok atau user tidak ada.
 */
export async function updateUser(id: string, input: UpdateUserInput): Promise<SafeUser> {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error('Akun tidak ditemukan.');
  }

  const current = users[index];
  const nextEmail = input.email !== undefined ? input.email.trim().toLowerCase() : current.email;

  if (
    input.email !== undefined &&
    users.some((u) => u.id !== id && u.email === nextEmail)
  ) {
    throw new Error('Email sudah dipakai akun lain.');
  }

  const updated: StoredUser = {
    ...current,
    name: input.name !== undefined ? input.name.trim() : current.name,
    email: nextEmail,
    role: input.role !== undefined ? input.role : current.role,
    passwordHash:
      input.password && input.password.length > 0
        ? await hashPassword(input.password)
        : current.passwordHash,
  };

  const next = [...users];
  next[index] = updated;
  writeUsers(next);
  return toSafeUser(updated);
}

/**
 * Menghapus user berdasarkan id. Mencegah penghapusan admin terakhir.
 */
export function deleteUser(id: string): void {
  const users = readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return;

  if (target.role === 'admin') {
    const adminCount = users.filter((u) => u.role === 'admin').length;
    if (adminCount <= 1) {
      throw new Error('Tidak dapat menghapus admin terakhir.');
    }
  }

  writeUsers(users.filter((u) => u.id !== id));
}

/** Menyimpan sesi login (id user) ke localStorage. */
export function saveSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

/** Menghapus sesi (logout). */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/** Mengambil user yang sedang login dari sesi tersimpan, atau null. */
export function getSessionUser(): SafeUser | null {
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) return null;
  const user = readUsers().find((u) => u.id === userId);
  return user ? toSafeUser(user) : null;
}
