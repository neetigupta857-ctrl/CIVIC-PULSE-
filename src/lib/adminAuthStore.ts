import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface AdminAccountRecord {
  officerId: string;
  name: string;
  badge: string;
  salt: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory registry with safe file-based fallback persistence if local storage file exists
const STORE_PATH = path.join(process.cwd(), '.system_generated', 'admin_accounts.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Initial provisioned municipal officers
const DEFAULT_ACCOUNTS: AdminAccountRecord[] = [
  (() => {
    const salt = 'a8f9c1e2d3b4a5f60718293a4b5c6d7e';
    return {
      officerId: 'admin-delhi',
      name: 'Er. R. K. Mishra',
      badge: 'Chief Executive Engineer - Road Infrastructure, New Delhi',
      salt,
      hash: hashPassword('ZonalDirector9941', salt),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  })(),
  (() => {
    const salt = 'b7e8d9c0a1f2e3d4c5b6a708192a3b4c';
    return {
      officerId: 'admin-lucknow',
      name: 'Er. S. N. Sharma',
      badge: 'Zonal Municipal Commissioner, Lucknow Nagar Nigam',
      salt,
      hash: hashPassword('LucknowNagar2026', salt),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  })(),
];

let cachedAccounts: AdminAccountRecord[] | null = null;

export function loadAdminAccounts(): AdminAccountRecord[] {
  if (cachedAccounts) return cachedAccounts;

  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      cachedAccounts = JSON.parse(data);
      return cachedAccounts!;
    }
  } catch (err) {
    console.warn('Could not read admin accounts from persistence:', err);
  }

  // Load from environment variable if present
  try {
    const envAccounts = process.env.ADMIN_ACCOUNTS;
    if (envAccounts) {
      const parsed = JSON.parse(envAccounts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedAccounts = parsed.map((acc: any) => {
          const salt = generateSalt();
          return {
            officerId: String(acc.officerId).trim(),
            name: acc.name || 'Municipal Administrator',
            badge: acc.badge || 'Executive Municipal Officer',
            salt,
            hash: hashPassword(acc.passkey || 'Admin@CivicPulse2026', salt),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });
        saveAdminAccounts(cachedAccounts);
        return cachedAccounts;
      }
    }
  } catch (err) {
    console.warn('Could not parse ADMIN_ACCOUNTS env:', err);
  }

  cachedAccounts = [...DEFAULT_ACCOUNTS];
  saveAdminAccounts(cachedAccounts);
  return cachedAccounts;
}

export function saveAdminAccounts(accounts: AdminAccountRecord[]): void {
  cachedAccounts = accounts;
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(accounts, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist admin accounts to disk:', err);
  }
}

export function verifyAdminCredentials(
  officerId: string,
  passkey: string
): { success: boolean; account?: AdminAccountRecord; error?: string } {
  const accounts = loadAdminAccounts();
  const cleanId = officerId.trim();
  const cleanPass = passkey.trim();

  const account = accounts.find(
    (a) => a.officerId.toLowerCase() === cleanId.toLowerCase()
  );

  if (!account) {
    return { success: false, error: 'Officer ID not registered in municipal system.' };
  }

  const computedHash = hashPassword(cleanPass, account.salt);
  if (computedHash !== account.hash) {
    return { success: false, error: 'Incorrect security passkey. Please check capitalization or reset.' };
  }

  return { success: true, account };
}

export function provisionOrResetAdminAccount(
  officerId: string,
  newPasskey: string,
  name?: string,
  badge?: string
): AdminAccountRecord {
  const accounts = loadAdminAccounts();
  const cleanId = officerId.trim();
  const cleanPass = newPasskey.trim();
  const salt = generateSalt();
  const hash = hashPassword(cleanPass, salt);

  const existingIndex = accounts.findIndex(
    (a) => a.officerId.toLowerCase() === cleanId.toLowerCase()
  );

  if (existingIndex >= 0) {
    const updated: AdminAccountRecord = {
      ...accounts[existingIndex],
      salt,
      hash,
      name: name || accounts[existingIndex].name,
      badge: badge || accounts[existingIndex].badge,
      updatedAt: new Date().toISOString(),
    };
    accounts[existingIndex] = updated;
    saveAdminAccounts(accounts);
    return updated;
  } else {
    const created: AdminAccountRecord = {
      officerId: cleanId,
      name: name || 'Municipal Administrator',
      badge: badge || 'Authorized Municipal Triage Officer',
      salt,
      hash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    accounts.push(created);
    saveAdminAccounts(accounts);
    return created;
  }
}

