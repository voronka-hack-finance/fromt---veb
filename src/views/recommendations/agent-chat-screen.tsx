import { AgentChatScreenView } from "@/widgets/recommendations/agent-chat-screen";

export function AgentChatScreen({ agentId }: { agentId: string }) {
  return <AgentChatScreenView agentId={agentId} />;
}
