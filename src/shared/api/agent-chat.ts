"use client";

import { useQuery } from "@tanstack/react-query";

import {
  agentChatScreens,
  type AgentChatId,
  type AgentChatScreenData,
} from "@/shared/data/agent-chat";

import {
  loadAgentChatScreenData,
  sendAgentChatMessage as postAgentChatMessage,
} from "./backend-entity-loaders";
import { tryLoadScreenData } from "./backend-screen-data";
import { mockDelay } from "./client";
import { queryKeys } from "./query-keys";

export type AgentChatResponse = AgentChatScreenData & {
  chatId?: string;
};

export async function fetchAgentChat(agentId: string): Promise<AgentChatResponse> {
  await mockDelay();

  return tryLoadScreenData(
    () => loadAgentChatScreenData(agentId),
    () => {
      const chat = agentChatScreens[agentId as AgentChatId];

      if (!chat) {
        throw new Error(`Agent chat not found: ${agentId}`);
      }

      return chat;
    },
  );
}

export async function sendAgentChatMessage(chatId: string, content: string) {
  return postAgentChatMessage(chatId, content);
}

export function useAgentChatQuery(agentId: string) {
  return useQuery({
    queryKey: queryKeys.agentChat(agentId),
    queryFn: () => fetchAgentChat(agentId),
  });
}
