import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import {
  mergeInvitationContent,
  type InvitationContent,
  type Registration,
} from "./invitation-content";

const invitationKey = "bni:invitation-content";
const registrationsKey = "bni:registrations";

const dataDir = path.join(process.cwd(), "data");
const invitationPath = path.join(dataDir, "invitation.json");
const registrationsPath = path.join(dataDir, "registrations.jsonl");

let redisClient: Redis | null | undefined;

export function hasPersistentStorageConfig() {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
      (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
  );
}

function getRedis() {
  if (!hasPersistentStorageConfig()) {
    return null;
  }

  if (redisClient === undefined) {
    redisClient = Redis.fromEnv();
  }

  return redisClient;
}

export function getStorageMode(): "upstash" | "local" {
  return getRedis() ? "upstash" : "local";
}

async function readLocalJson<T>(filePath: string): Promise<T | null> {
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as T;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

export async function getInvitationContent(): Promise<InvitationContent> {
  const redis = getRedis();

  if (redis) {
    const content = await redis.get<Partial<InvitationContent>>(invitationKey);
    return mergeInvitationContent(content);
  }

  const content = await readLocalJson<Partial<InvitationContent>>(invitationPath);
  return mergeInvitationContent(content);
}

export async function saveInvitationContent(content: InvitationContent) {
  const redis = getRedis();

  if (redis) {
    await redis.set(invitationKey, content);
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(invitationPath, `${JSON.stringify(content, null, 2)}\n`);
}

export async function saveRegistration(registration: Registration) {
  const redis = getRedis();

  if (redis) {
    await redis.lpush(registrationsKey, registration);
    await redis.ltrim(registrationsKey, 0, 499);
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  await fs.appendFile(registrationsPath, `${JSON.stringify(registration)}\n`);
}

export async function listRegistrations(limit = 50): Promise<Registration[]> {
  const redis = getRedis();

  if (redis) {
    return redis.lrange<Registration>(registrationsKey, 0, limit - 1);
  }

  try {
    const file = await fs.readFile(registrationsPath, "utf8");
    return file
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Registration)
      .reverse()
      .slice(0, limit);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}
