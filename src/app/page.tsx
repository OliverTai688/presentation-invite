import { connection } from "next/server";
import { InvitationExperience } from "@/components/InvitationExperience";
import { getInvitationContent } from "@/lib/storage";

export default async function Home() {
  await connection();
  const content = await getInvitationContent();

  return <InvitationExperience content={content} />;
}
