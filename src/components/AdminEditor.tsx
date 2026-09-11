"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import {
  Save,
  LogOut,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Settings,
} from "lucide-react";
import type { InvitationContent, Registration } from "@/lib/invitation-content";
import { defaultInvitationContent } from "@/lib/invitation-content";
import styles from "./AdminEditor.module.css";

// ---------------------------------------------------------------------------
// Auth gate
// ---------------------------------------------------------------------------

function LoginPanel({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        headers: { "x-admin-password": pwd },
      });
      if (res.ok) {
        onLogin(pwd);
      } else {
        setError("密碼錯誤");
      }
    } catch {
      setError("網路錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.centerShell}>
      <form className={styles.loginPanel} onSubmit={handleSubmit}>
        <div>
          <h1>後台管理</h1>
          <p>請輸入管理員密碼以繼續</p>
        </div>
        <input
          type="password"
          placeholder="管理員密碼"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          autoFocus
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "驗證中…" : "登入"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// System check list
// ---------------------------------------------------------------------------

type SystemCheck = {
  key: string;
  label: string;
  ok: boolean;
  required: boolean;
  detail: string;
};

function CheckList({ checks }: { checks: SystemCheck[] }) {
  return (
    <div className={styles.checkList}>
      {checks.map((check) => (
        <div
          key={check.key}
          className={check.ok ? styles.checkReady : styles.checkPending}
        >
          {check.ok ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <div>
            <strong>
              {check.label}
              {check.required && !check.ok && " *"}
            </strong>
            <span>{check.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Registration list
// ---------------------------------------------------------------------------

function RegistrationList({ registrations }: { registrations: Registration[] }) {
  if (registrations.length === 0) {
    return <p style={{ color: "#9c9490", fontSize: "0.9rem" }}>尚無報名記錄。</p>;
  }

  return (
    <div className={styles.registrationList}>
      {[...registrations].reverse().map((reg) => (
        <article key={reg.id}>
          <strong>{reg.name}</strong>
          <span>{reg.email}・LINE: {reg.lineId}</span>
          {reg.referrerName && <span>推薦人：{reg.referrerName}</span>}
          <code>{reg.couponCode}</code>
          <span style={{ fontSize: "0.8rem", color: "#9c9490" }}>
            {new Date(reg.createdAt).toLocaleString("zh-TW")}
          </span>
        </article>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main admin editor
// ---------------------------------------------------------------------------

type AdminData = {
  content: InvitationContent;
  registrations: Registration[];
  system: {
    checks: SystemCheck[];
    storageMode: string;
  };
};

export function AdminEditor() {
  const [password, setPassword] = useState<string | null>(null);
  const [data, setData] = useState<AdminData | null>(null);
  const [form, setForm] = useState<InvitationContent>(defaultInvitationContent);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"editor" | "registrations" | "system">("editor");

  async function fetchData(pwd: string) {
    setLoading(true);
    try {
      const [contentRes, regsRes, statusRes] = await Promise.all([
        fetch("/api/admin/content", { headers: { "x-admin-password": pwd } }),
        fetch("/api/admin/registrations", { headers: { "x-admin-password": pwd } }),
        fetch("/api/admin/status", { headers: { "x-admin-password": pwd } }),
      ]);

      if (!contentRes.ok) {
        setPassword(null);
        return;
      }

      const content = await contentRes.json();
      const regsData = regsRes.ok ? await regsRes.json() : { registrations: [] };
      const statusData = statusRes.ok
        ? await statusRes.json()
        : { checks: [], storageMode: "local" };

      setForm(content);
      setData({ content, registrations: regsData.registrations ?? [], system: statusData });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(pwd: string) {
    setPassword(pwd);
    fetchData(pwd);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!password || saving) return;
    setSaving(true);
    setSaveMsg("");
    setSaveError("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaveMsg("已儲存！");
        setTimeout(() => setSaveMsg(""), 3000);
      } else {
        const json = await res.json().catch(() => ({}));
        setSaveError(json.error ?? "儲存失敗");
      }
    } catch {
      setSaveError("網路錯誤");
    } finally {
      setSaving(false);
    }
  }

  // notes / highlights are stored as arrays but edited as one item per line.
  function isListField(key: keyof InvitationContent) {
    return key === "notes" || key === "highlights";
  }

  function field(
    key: keyof InvitationContent,
    label: string,
    type: "input" | "textarea" = "input",
  ) {
    return (
      <label key={key}>
        <span>{label}</span>
        {type === "textarea" ? (
          <textarea
            rows={4}
            value={
              isListField(key)
                ? (form[key] as string[]).join("\n")
                : String(form[key] ?? "")
            }
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [key]: isListField(key)
                  ? e.target.value
                      .split("\n")
                      .map((l) => l.trim())
                      .filter(Boolean)
                  : e.target.value,
              }))
            }
          />
        ) : (
          <input
            type="text"
            value={String(form[key] ?? "")}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [key]: e.target.value }))
            }
          />
        )}
      </label>
    );
  }

  if (!password) {
    return <LoginPanel onLogin={handleLogin} />;
  }

  if (loading || !data) {
    return (
      <div className={styles.centerShell}>
        <p>載入中…</p>
      </div>
    );
  }

  return (
    <div className={styles.adminShell}>
      <div className={styles.header}>
        <div>
          <h1>後台管理</h1>
          <p>
            {data.system.storageMode === "upstash"
              ? "✦ Upstash Redis"
              : "· 本機檔案"}
            ・{data.registrations.length} 筆報名
          </p>
        </div>
        <div className={styles.headerActions}>
          <span>
            <Eye size={15} />
            <a href="/" target="_blank" rel="noopener noreferrer">
              預覽前台
            </a>
          </span>
          <button
            onClick={() => fetchData(password)}
            aria-label="重新整理"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? styles.spin : ""} />
            重新整理
          </button>
          <button
            onClick={() => {
              setPassword(null);
              setData(null);
            }}
          >
            <LogOut size={15} />
            登出
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto 18px",
          display: "flex",
          gap: 10,
        }}
      >
        {(
          [
            { id: "editor", label: "編輯內容", icon: <Settings size={14} /> },
            {
              id: "registrations",
              label: `報名名單（${data.registrations.length}）`,
              icon: <Users size={14} />,
            },
            { id: "system", label: "系統狀態", icon: <CheckCircle size={14} /> },
          ] as const
        ).map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              minHeight: 38,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              border: "1px solid",
              borderColor:
                tab === id ? "rgb(185 28 43 / 0.4)" : "rgb(33 28 28 / 0.12)",
              borderRadius: 999,
              background: tab === id ? "rgb(185 28 43 / 0.07)" : "#fff",
              color: tab === id ? "#9c1a27" : "#211c1c",
              fontWeight: tab === id ? 900 : 700,
              padding: "0 14px",
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "editor" && (
        <div className={styles.grid}>
          <form className={styles.editor} onSubmit={handleSave}>
            {field("eventTitle", "活動標題 *")}
            {field("chapterName", "主辦單位名稱 *")}
            {field("eventDate", "活動日期")}
            {field("eventTime", "活動時間")}
            {field("startAt", "開始時間 ISO（2026-09-17T06:30:00+08:00）")}
            {field("endAt", "結束時間 ISO（2026-09-17T08:30:00+08:00）")}
            {field("speakerName", "講者姓名 *")}
            {field("speakerCompany", "講者公司")}
            {field("speakerRoles", "講者職稱")}
            {field("topic", "演講主題 *")}
            {field("tagline", "主題標語（海報副標）")}
            {field("description", "活動簡介", "textarea")}
            {field("highlights", "品牌亮點（每行一條）", "textarea")}
            {field("speakerBio", "講者介紹", "textarea")}
            {field("locationName", "地點名稱")}
            {field("locationAddress", "地點地址")}
            {field("fee", "費用")}
            {field("referralAudience", "適合對象")}
            {field("posterImagePath", "海報圖片路徑（/poster.jpg）")}
            {field("linkedinUrl", "LinkedIn URL")}
            {field("meetNuvaUrl", "MeetNuva URL")}
            {field("couponTitle", "邀請序號標題")}
            {field("couponDescription", "邀請序號說明", "textarea")}
            {field("organizerEmail", "主辦方收件 Email")}
            {field("notes", "注意事項（每行一條）", "textarea")}

            {saveMsg && <p className={styles.message}>{saveMsg}</p>}
            {saveError && <p className={styles.error}>{saveError}</p>}

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              <Save size={15} />
              {saving ? "儲存中…" : "儲存設定"}
            </button>
          </form>

          {/* Preview */}
          <div className={styles.preview}>
            {form.posterImagePath && (
              <section>
                <h2>海報預覽</h2>
                <Image
                  src={form.posterImagePath}
                  alt="海報預覽"
                  width={780}
                  height={1102}
                  style={{ width: "100%", height: "auto" }}
                  unoptimized
                />
              </section>
            )}

            <section>
              <h2>{form.eventTitle || "（活動標題）"}</h2>
              <p>{form.chapterName}</p>
              <p>
                {form.eventDate}・{form.eventTime}
              </p>
              <p>
                {form.locationName}
                {form.locationAddress && `・${form.locationAddress}`}
              </p>
              <p>
                <strong>{form.speakerName}</strong> {form.speakerRoles}
              </p>
              <p>{form.topic}</p>
              {form.description && <p style={{ color: "#625b57" }}>{form.description}</p>}
            </section>

            <section>
              <h2>邀請序號</h2>
              <p>
                <strong>{form.couponTitle}</strong>
              </p>
              <p>{form.couponDescription}</p>
            </section>
          </div>
        </div>
      )}

      {tab === "registrations" && (
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 20, border: "1px solid rgb(33 28 28 / 0.1)" }}>
            <h2 style={{ marginBottom: 12 }}>報名名單</h2>
            <RegistrationList registrations={data.registrations} />
          </div>
        </div>
      )}

      {tab === "system" && (
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 20, border: "1px solid rgb(33 28 28 / 0.1)" }}>
            <h2 style={{ marginBottom: 12 }}>系統狀態</h2>
            <CheckList checks={data.system.checks} />
          </div>
        </div>
      )}
    </div>
  );
}
