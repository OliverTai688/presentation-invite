import fs from "fs";
import path from "path";
import type { InvitationContent, Registration } from "./invitation-content";
import { defaultInvitationContent } from "./invitation-content";

// ---------------------------------------------------------------------------
// Storage mode detection
// ---------------------------------------------------------------------------

export function getStorageMode(): "upstash" | "local" {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? "upstash" : "local";
}

export function hasPersistentStorageConfig(): boolean {
  return getStorageMode() === "upstash";
}

// ---------------------------------------------------------------------------
// Upstash Redis helpers (only imported when configured)
// ---------------------------------------------------------------------------

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: (process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_REST_API_URL) as string,
    token: (process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.KV_REST_API_TOKEN) as string,
  });
}

const CONTENT_KEY = "invitation:content";
const REGISTRATIONS_KEY = "invitation:registrations";

// ---------------------------------------------------------------------------
// Local file helpers
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.jsonl");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLocalContent(): InvitationContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
      return { ...defaultInvitationContent, ...JSON.parse(raw) };
    }
  } catch {
    // fall through to default
  }
  return { ...defaultInvitationContent };
}

function writeLocalContent(content: InvitationContent) {
  ensureDataDir();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

function readLocalRegistrations(): Registration[] {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      return fs
        .readFileSync(REGISTRATIONS_FILE, "utf-8")
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as Registration);
    }
  } catch {
    // fall through
  }
  return [];
}

function appendLocalRegistration(registration: Registration) {
  ensureDataDir();
  fs.appendFileSync(
    REGISTRATIONS_FILE,
    JSON.stringify(registration) + "\n",
    "utf-8",
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getInvitationContent(): Promise<InvitationContent> {
  if (getStorageMode() === "upstash") {
    try {
      const redis = await getRedis();
      const stored = await redis.get<InvitationContent>(CONTENT_KEY);
      if (stored) {
        return { ...defaultInvitationContent, ...stored };
      }
    } catch (err) {
      console.error("Failed to read from Upstash, falling back to local", err);
    }
  }
  return readLocalContent();
}

export async function saveInvitationContent(
  content: InvitationContent,
): Promise<void> {
  if (getStorageMode() === "upstash") {
    try {
      const redis = await getRedis();
      await redis.set(CONTENT_KEY, content);
      return;
    } catch (err) {
      console.error("Failed to write to Upstash, falling back to local", err);
    }
  }
  writeLocalContent(content);
}

export async function saveRegistration(
  registration: Registration,
): Promise<void> {
  if (getStorageMode() === "upstash") {
    try {
      const redis = await getRedis();
      await redis.lpush(REGISTRATIONS_KEY, JSON.stringify(registration));
      return;
    } catch (err) {
      console.error("Failed to write to Upstash, falling back to local", err);
    }
  }
  appendLocalRegistration(registration);
}

export async function getRegistrations(): Promise<Registration[]> {
  if (getStorageMode() === "upstash") {
    try {
      const redis = await getRedis();
      const items = await redis.lrange<string>(REGISTRATIONS_KEY, 0, -1);
      return items.map((item) =>
        typeof item === "string" ? JSON.parse(item) : item,
      ) as Registration[];
    } catch (err) {
      console.error("Failed to read from Upstash, falling back to local", err);
    }
  }
  return readLocalRegistrations();
}
