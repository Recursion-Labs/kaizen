import { createStorage, StorageEnum } from "../base/index.js";
import type { BaseStorageType } from "../types.js";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // Store as ISO string
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string; // Store as ISO string
  updatedAt: string; // Store as ISO string
}

const storage = createStorage<ConversationStateType>(
  "kaizen-conversations",
  [],
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  }
);

export type ConversationStateType = Conversation[];
export type { Message, Conversation };

export const conversationStorage: BaseStorageType<ConversationStateType> =
  storage;
