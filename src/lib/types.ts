type Conversation = {
	id: string;
	title: string;
	messages: Message[];
	// This will probably include more fields in the future like the creator (user)
}

type Message = {
	text: string;
	isUser: boolean;
	timestamp: number;
}

interface ConversationState {
	conversations: Conversation[];
	activeConversation?: Conversation;
	isStreaming: boolean;
	messages: Message[] | null;
	setConversations: (conversations: Conversation[]) => void;
	setActiveConversation: (conversation: Conversation) => void;
	addMessageToConversation: (conversationId: string, message: Message) => void;
	setIsStreaming: (streaming: boolean) => void;
	setMessages: (messages: Message[]) => void;
	addMessage: (message: Message) => void;
	updateLastMessage: (text: string) => void;
  }

