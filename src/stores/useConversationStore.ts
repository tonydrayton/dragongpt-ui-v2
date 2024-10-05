import { create } from 'zustand';

export const useConversationStore = create<ConversationState>((set, get) => ({
	conversations: [],
	activeConversation: undefined,
	isStreaming: false,
	messages: null, // start of null to indicate loading state

	setConversations: (conversations) => set({ conversations }),

	setActiveConversation: (conversation) => {
		set({ activeConversation: conversation });
		const updatedConversations = get().conversations.map((c) =>
			c.id === conversation?.id ? conversation : c
		);
		set({ conversations: updatedConversations });
	},

	addMessageToConversation: (conversationId, message) => {
		const updatedConversations = get().conversations.map((conversation) =>
			conversation.id === conversationId
				? { ...conversation, messages: [...conversation.messages, message] }
				: conversation
		);
		set({ conversations: updatedConversations });
	},

	setIsStreaming: (streaming) => set({ isStreaming: streaming }),

	setMessages: (messages) => set({ messages }),

	addMessage: (message) => set((state) => {
		console.log({messages: state.messages})
		console.log({messagesUpdated: state.messages ? [...state.messages, message] : [message]})
		return {
			messages: state.messages ? [...state.messages, message] : [message]
		}
	}),

	updateLastMessage: (text) => set((state) => {
		if (!state.messages) return state;
		const newMessages = [...state.messages];
		const lastMessage = newMessages[newMessages.length - 1];
		if (lastMessage) {
			lastMessage.text = text;
		}
		return { messages: newMessages };
	}),
}));
