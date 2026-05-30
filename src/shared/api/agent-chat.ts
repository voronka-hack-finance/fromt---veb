"use client";

import { useQuery } from "@tanstack/react-query";

import {
  agentChatScreens,
  type AgentChatId,
  type AgentChatScreenData,
} from "@/shared/data/agent-chat";

import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type AgentChatResponse = AgentChatScreenData;

export async function fetchAgentChat(agentId: string): Promise<AgentChatResponse> {
  await mockDelay();

  const chat = agentChatScreens[agentId as AgentChatId];

  if (!chat) {
    throw new Error(`Agent chat not found: ${agentId}`);
  }

  return chat;
}

export function useAgentChatQuery(agentId: string) {
  return useQuery({
    queryKey: queryKeys.agentChat(agentId),
    queryFn: () => fetchAgentChat(agentId),
  });
}
