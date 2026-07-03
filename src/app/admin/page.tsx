import type { Metadata } from "next";
import { AdminEditor } from "@/components/AdminEditor";

export const metadata: Metadata = {
  title: "後台",
};

export default function AdminPage() {
  return <AdminEditor />;
}
