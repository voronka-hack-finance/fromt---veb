import { notFound } from "next/navigation";

import { agentChatIds } from "@/shared/data/agent-chat";
import { AgentChatScreen } from "@/views/recommendations/agent-chat-screen";

type AgentChatPageProps = {
  params: Promise<{
    agentId: string;
  }>;
};

export function generateStaticParams() {
  return agentChatIds.map((agentId) => ({ agentId }));
}

export default async function AgentChatPage({ params }: AgentChatPageProps) {
  const { agentId } = await params;

  if (!agentChatIds.includes(agentId as (typeof agentChatIds)[number])) {
    notFound();
  }

  return <AgentChatScreen agentId={agentId} />;
}
