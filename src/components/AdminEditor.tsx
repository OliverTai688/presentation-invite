"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  LockKeyhole,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  defaultInvitationContent,
  type InvitationContent,
  type Registration,
} from "@/lib/invitation-content";
import type { SystemStatus } from "@/lib/system-status";
import styles from "./AdminEditor.module.css";

type Status = "checking" | "locked" | "ready";

type AdminResponse = {
  content: InvitationContent;
  storageMode: "upstash" | "local";
};

const textFields: Array<{
  key: keyof InvitationContent;
  label: string;
  multiline?: boolean;
}> = [
  { key: "eventTitle", label: "活動標題" },
  { key: "chapterName", label: "分會名稱" },
  { key: "eventDate", label: "日期" },
  { key: "eventTime", label: "時間" },
  { key: "speakerName", label: "講者姓名" },
  { key: "speakerCompany", label: "公司名稱" },
  { key: "speakerRoles", label: "講者身份" },
  { key: "topic", label: "主題短名" },
  { key: "description", label: "活動描述", multiline: true },
  { key: "locationName", label: "地點名稱" },
  { key: "locationAddress", label: "地址" },
  { key: "fee", label: "費用" },
  { key: "referralAudience", label: "引薦對象" },
  { key: "posterImagePath", label: "海報路徑" },
  { key: "linkedinUrl", label: "LinkedIn URL" },
  { key: "meetNuvaUrl", label: "Meet Nuva URL" },
  { key: "couponTitle", label: "兌換券標題" },
  { key: "couponDescription", label: "兌換券說明", multiline: true },
  { key: "organizerEmail", label: "主辦方收件 Email" },
];

export function AdminEditor() {
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<InvitationContent>(
    defaultInvitationContent,
  );
  const [notes, setNotes] = useState(defaultInvitationContent.notes.join("\n"));
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [storageMode, setStorageMode] = useState<"upstash" | "local">("local");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const storageLabel = useMemo(
    () => (storageMode === "upstash" ? "Upstash / Vercel KV" : "Local JSON"),
    [storageMode],
  );

  useEffect(() => {
    async function checkSession() {
      const response = await fetch("/api/admin/session");
      const result = await response.json();

      if (result.authenticated) {
        await loadAdminData();
        setStatus("ready");
      } else {
        setStatus("locked");
      }
    }

    checkSession().catch(() => {
      setStatus("locked");
    });
  }, []);

  async function loadAdminData() {
    const [contentResponse, registrationsResponse, systemResponse] =
      await Promise.all([
        fetch("/api/admin/invitation"),
        fetch("/api/admin/registrations"),
        fetch("/api/admin/system"),
      ]);

    if (contentResponse.ok) {
      const result = (await contentResponse.json()) as AdminResponse;
      setContent(result.content);
      setNotes(result.content.notes.join("\n"));
      setStorageMode(result.storageMode);
    }

    if (registrationsResponse.ok) {
      const result = await registrationsResponse.json();
      setRegistrations(result.registrations || []);
    }

    if (systemResponse.ok) {
      const result = (await systemResponse.json()) as SystemStatus;
      setSystemStatus(result);
    }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const result = await response.json();
      setMessage(result.error || "登入失敗。");
      return;
    }

    await loadAdminData();
    setStatus("ready");
    setPassword("");
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setStatus("locked");
  }

  function updateField(key: keyof InvitationContent) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setContent((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...content,
      notes,
    };

    const response = await fetch("/api/admin/invitation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error || "儲存失敗。");
      return;
    }

    setContent(result.content);
    setNotes(result.content.notes.join("\n"));
    setStorageMode(result.storageMode);
    await refreshSystemStatus();
    setMessage("邀請函已更新。");
  }

  async function refreshSystemStatus() {
    const response = await fetch("/api/admin/system");

    if (response.ok) {
      const result = (await response.json()) as SystemStatus;
      setSystemStatus(result);
    }
  }

  if (status === "checking") {
    return (
      <main className={styles.centerShell}>
        <div className={styles.loginPanel}>
          <RefreshCw className={styles.spin} size={22} aria-hidden="true" />
          <p>讀取中</p>
        </div>
      </main>
    );
  }

  if (status === "locked") {
    return (
      <main className={styles.centerShell}>
        <form className={styles.loginPanel} onSubmit={login}>
          <LockKeyhole size={26} aria-hidden="true" />
          <div>
            <h1>Admin</h1>
            <p>BNI 邀請函編輯後台</p>
          </div>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button type="submit">登入</button>
          {message ? <p className={styles.error}>{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className={styles.adminShell}>
      <header className={styles.header}>
        <div>
          <p>BNI Invitation Admin</p>
          <h1>邀請函內容編輯</h1>
        </div>
        <div className={styles.headerActions}>
          <span>
            <ShieldCheck size={16} aria-hidden="true" />
            {storageLabel}
          </span>
          <button onClick={loadAdminData} type="button">
            <RefreshCw size={16} aria-hidden="true" />
            重新整理
          </button>
          <button onClick={logout} type="button">
            <LogOut size={16} aria-hidden="true" />
            登出
          </button>
        </div>
      </header>

      <section className={styles.grid}>
        <form className={styles.editor} onSubmit={save}>
          {textFields.map((field) => (
            <label key={field.key}>
              <span>{field.label}</span>
              {field.multiline ? (
                <textarea
                  value={String(content[field.key])}
                  onChange={updateField(field.key)}
                  rows={4}
                />
              ) : (
                <input
                  value={String(content[field.key])}
                  onChange={updateField(field.key)}
                />
              )}
            </label>
          ))}
          <label>
            <span>注意事項</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
            />
          </label>
          <button className={styles.saveButton} disabled={saving} type="submit">
            <Save size={17} aria-hidden="true" />
            {saving ? "儲存中" : "儲存邀請函"}
          </button>
          {message ? <p className={styles.message}>{message}</p> : null}
        </form>

        <aside className={styles.preview}>
          <section>
            <p>Preview</p>
            <h2>{content.eventTitle}</h2>
            <span>
              {content.eventDate} / {content.eventTime}
            </span>
            <Image
              src={content.posterImagePath}
              alt={`${content.eventTitle} 活動海報預覽`}
              width={1076}
              height={1522}
              sizes="360px"
            />
          </section>

          {systemStatus ? (
            <section>
              <p>Deployment</p>
              <h2>
                必要 {systemStatus.readyRequiredCount}/
                {systemStatus.totalRequiredCount}
              </h2>
              <span>
                建議 {systemStatus.readyRecommendedCount}/
                {systemStatus.totalRecommendedCount}
              </span>
              <div className={styles.checkList}>
                {systemStatus.checks.map((check) => {
                  const Icon = check.ok ? CheckCircle2 : AlertTriangle;

                  return (
                    <article
                      className={
                        check.ok ? styles.checkReady : styles.checkPending
                      }
                      key={check.key}
                    >
                      <Icon size={17} aria-hidden="true" />
                      <div>
                        <strong>
                          {check.label}
                          {check.required ? "" : "（建議）"}
                        </strong>
                        <span>{check.detail}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section>
            <p>Registrations</p>
            <h2>{registrations.length} 筆近期報名</h2>
            <div className={styles.registrationList}>
              {registrations.length === 0 ? (
                <span>尚無資料</span>
              ) : (
                registrations.map((registration) => (
                  <article key={registration.id}>
                    <strong>{registration.name}</strong>
                    <span>{registration.lineId}</span>
                    <span>{registration.email}</span>
                    <code>{registration.couponCode}</code>
                  </article>
                ))
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
