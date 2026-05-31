"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

import {
  sendAgentChatMessage,
  useAgentChatQuery,
  type AgentChatResponse,
} from "@/shared/api/agent-chat";
import {
  createBotMessage,
  createUserMessage,
  resolveBotReply,
  type AgentChatMessage,
} from "@/shared/data/agent-chat";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";

import styles from "./agent-chat-screen.module.css";

function ChatMessageItem({
  message,
  onSuggestionClick,
}: {
  message: AgentChatMessage;
  onSuggestionClick: (text: string) => void;
}) {
  if (message.type === "date-separator") {
    return (
      <div className={styles.dateSeparatorWrap}>
        <span className={styles.dateSeparator}>{message.label}</span>
      </div>
    );
  }

  if (message.type === "steps") {
    return (
      <div className={styles.messageBlock}>
        <div className={styles.messageRow}>
          <div className={styles.stepsCard}>
            {message.steps.map((step) => (
              <div className={styles.stepRow} key={step.number}>
                <div className={styles.stepBadge}>
                  <p className={styles.stepNumber}>{step.number}</p>
                </div>
                <p className={styles.stepText}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <br />
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className={styles.timestamp}>{message.timestamp}</p>
      </div>
    );
  }

  if (message.type === "user") {
    return (
      <div className={`${styles.messageBlock} ${styles.messageBlockTight}`}>
        <div className={`${styles.messageRow} ${styles.messageRowUser}`}>
          <div className={`${styles.bubble} ${styles.bubbleUser}`}>
            <p className={`${styles.bubbleText} ${styles.bubbleTextUser}`}>{message.text}</p>
          </div>
        </div>
        <p className={`${styles.timestamp} ${styles.timestampUser}`}>{message.timestamp}</p>
      </div>
    );
  }

  if (message.type === "bot") {
    return (
      <div className={`${styles.messageBlock} ${styles.messageBlockTight}`}>
        <div className={styles.messageRow}>
          <div className={`${styles.bubble} ${styles.bubbleBot}`}>
            <p className={`${styles.bubbleText} ${styles.bubbleTextBot}`}>{message.text}</p>
          </div>
        </div>
        <p className={styles.timestamp}>{message.timestamp}</p>
      </div>
    );
  }

  return (
    <div className={styles.suggestions}>
      {message.options.map((option) => (
        <button
          className={styles.suggestionButton}
          key={option}
          onClick={() => onSuggestionClick(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function AgentChatContent({ chat }: { chat: AgentChatResponse }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AgentChatMessage[]>(chat.messages);
  const [isReplying, setIsReplying] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const canSend = draft.trim().length > 0 && !isReplying;
  const hasMessages = messages.length > 0;

  const scrollToBottom = useCallback(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isReplying, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isReplying) return;

      setDraft("");
      setMessages((current) => [
        ...current.filter((message) => message.type !== "suggestions"),
        createUserMessage(trimmed),
      ]);
      setIsReplying(true);

      try {
        if (chat.chatId) {
          const nextMessages = await sendAgentChatMessage(chat.chatId, trimmed);
          setMessages(nextMessages);
        } else {
          await new Promise((resolve) => window.setTimeout(resolve, 600));
          setMessages((current) => [
            ...current,
            createBotMessage(resolveBotReply(chat, trimmed)),
          ]);
        }
      } catch {
        setMessages((current) => [
          ...current,
          createBotMessage(resolveBotReply(chat, trimmed)),
        ]);
      } finally {
        setIsReplying(false);
      }
    },
    [chat, isReplying],
  );

  const handleSubmit = () => {
    sendMessage(draft);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <Link
              aria-label="Назад"
              className={styles.backButton}
              href="/recommendations"
            >
              <ArrowLeft size={20} strokeWidth={1.9} />
            </Link>
            <div className={styles.headerText}>
              <h1 className={styles.title}>{chat.title}</h1>
              <p className={styles.subtitle}>{chat.subtitle}</p>
            </div>
          </header>

          <div className={styles.messages} ref={messagesRef}>
            {hasMessages ? (
              messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  onSuggestionClick={sendMessage}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <h2 className={styles.emptyTitle}>Чат готов к диалогу</h2>
                <p className={styles.emptyText}>
                  Задайте вопрос агенту, чтобы получить рекомендации по расходам, накоплениям и
                  финансовым привычкам.
                </p>
              </div>
            )}
            {isReplying ? (
              <div className={`${styles.messageBlock} ${styles.messageBlockTight}`}>
                <div className={styles.messageRow}>
                  <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.bubbleTyping}`}>
                    <span className={styles.typingDots} aria-hidden>
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.inputBar}>
            <div className={styles.inputRow}>
              <input
                className={styles.textInput}
                disabled={isReplying}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={chat.inputPlaceholder}
                type="text"
                value={draft}
              />
              <button
                aria-label="Отправить сообщение"
                className={`${styles.sendButton} ${canSend ? styles.sendButtonActive : ""}`}
                disabled={!canSend}
                onClick={handleSubmit}
                type="button"
              >
                <Send size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function AgentChatScreenView({ agentId }: { agentId: string }) {
  const query = useAgentChatQuery(agentId);

  return (
    <QueryBoundary loadingLabel="Загрузка чата..." query={query}>
      {(data) => <AgentChatContent chat={data} key={data.agentId} />}
    </QueryBoundary>
  );
}
