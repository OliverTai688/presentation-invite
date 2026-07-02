import type { Metadata } from "next";
import { AdminEditor } from "@/components/AdminEditor";

export const metadata: Metadata = {
  title: "Admin | BNI AI 商務力邀請函",
};

export default function AdminPage() {
  return <AdminEditor />;
}
