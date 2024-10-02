"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import DOMPurify from 'dompurify';
import { randomUUID } from "crypto";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 } from "uuid";

export default function ChatInterface({
	previousMessages
}: {
	previousMessages?: { text: string, isUser: boolean }[]
}) {
	const [messages, setMessages] = useState<{ text: string, isUser: boolean }[]>(previousMessages || []);
	const [isStreaming, setIsStreaming] = useState(false);
	const messageRef = useRef<HTMLDivElement>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		messageRef.current?.focus();
	}, []);

	const handleSendMessage = async (message: string) => {
		if (messages.length === 0) {
			const uuid = v4();
			// TODO: Use api to create chat
				// const params = new URLSearchParams(searchParams.toString())
				// params.set('sort', 'chat')
				window.history.pushState(null, '', `/chat/${uuid}`)
		}

		setMessages(prev => [...prev, { text: message, isUser: true }]);
		setMessages(prev => [...prev, { text: '', isUser: false }]);

		try {
			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/query', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ query: message }),
			});

			if (!response.ok) {
				throw new Error('Failed to send message, status: ' + response.status);
			}

			const reader = response.body?.getReader();
			if (!reader) throw new Error('Failed to get response body reader');

			let accumulatedChunks = '';
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = new TextDecoder().decode(value);
				accumulatedChunks += chunk;

				const updateMessages = (chunks: string) => {
					setMessages(prev => {
						const newMessages = [...prev];
						const lastMessage = newMessages[newMessages.length - 1];
						lastMessage.text = chunks;
						return newMessages;
					});
				};

				updateMessages(accumulatedChunks);
			}
		} catch (error: any) {
			console.error('Error fetching bot response:', error.message);

			setMessages(prev => {
				const newMessages = [...prev];
				newMessages[newMessages.length - 1].text = `I'm sorry, I couldn't process your request at this moment.\nPlease contact the developers with this error message: ${error.message} for question "${message}" `;
				return newMessages;
			});
		} finally {
			setIsStreaming(false);
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-10rem)] w-full items-center">
			<div className="xl:px-32 flex-grow overflow-auto w-full">
				<ChatMessages messages={messages} isStreaming={isStreaming} />
			</div>
			<ChatInput onSendMessage={handleSendMessage} messageRef={messageRef} />
		</div>
	);
}
