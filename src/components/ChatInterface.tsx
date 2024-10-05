"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { v4 } from "uuid";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useConversationStore } from "@/stores/useConversationStore";
import { samples } from "@/lib/utils";

export default function ChatInterface({

}: {
}) {
	const { conversations, activeConversation, isStreaming, setConversations, setActiveConversation, addMessageToConversation, setIsStreaming, addMessage, updateLastMessage } = useConversationStore();
	const [messages, setMessages] = useState<Message[] | null>(null);
	const messageRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	// auto focus on message input
	useEffect(() => {
		messageRef.current?.focus();
	}, []);

	// reset messages when navigating to home
	useEffect(() => {
		if (pathname === '/' && messages && messages.length > 0) {
			setMessages([]);
		}
	}, [pathname]);

	useEffect(() => {
		setMessages(activeConversation?.messages || []);
	}, [activeConversation]);

	const handleSendMessage = async (message: string) => {
		const newMessage = { text: message, isUser: true, timestamp: Date.now() };
		let convo = activeConversation;
		const pastConversations = [...conversations];

		if (!convo) {
			const uuid = v4();
			convo = { id: uuid, title: `Conversation ${pastConversations.length + 1}`, messages: [] };
			convo.messages.push({ text: message, isUser: true, timestamp: Date.now() });
			setActiveConversation(convo);
			console.log({newMessage})
			setConversations([...pastConversations, convo]);
			window.localStorage.setItem('conversations', JSON.stringify([...pastConversations, convo]));
			window.history.pushState(null, '', `/chat/${uuid}`);
		} else {
			console.log('\n\n\n\n\nexists\n\n\n')
			convo.messages.push(newMessage);
			// convo.messages = [...convo.messages, { text: message, isUser: true, timestamp: Date.now() }];
			const updatedConversations = pastConversations.map(c =>
				c.id === convo!.id ? convo : c
			);
			setConversations(updatedConversations.filter((c): c is Conversation => c !== undefined));
			console.log({convoMsgs: convo.messages})
			console.log({ before: messages })
			setMessages(convo.messages);
			console.log({ after: messages })
			window.localStorage.setItem('conversations', JSON.stringify(updatedConversations));
		}

		// setMessages(convo.messages);
		addMessageToConversation(convo.id, newMessage);
		console.log({messages})


		setIsStreaming(true);
		setMessages(prev => [...(prev || []), { text: '', isUser: false, timestamp: Date.now() }]);
		addMessage({ text: '', isUser: false, timestamp: Date.now() })
		console.log({messages})


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
					updateLastMessage(chunks);
				};

				updateMessages(accumulatedChunks);
			}

			convo.messages.push({ text: accumulatedChunks, isUser: false, timestamp: Date.now() });
			setMessages(convo.messages);
			addMessageToConversation(convo.id, { text: accumulatedChunks, isUser: false, timestamp: Date.now() });

			const conversationExists = pastConversations.some(c => c.id === convo.id);
			const updatedConversations = conversationExists
				? pastConversations.map(c => (c.id === convo.id ? convo : c))  // Update existing
				: [...pastConversations, convo]; // Append new conversation if it doesn't exist
			setConversations(updatedConversations);
			window.localStorage.setItem('conversations', JSON.stringify(conversations));
		} catch (error: any) {
			console.error('Error fetching bot response:', error.message);
			const errorText = `I'm sorry, I couldn't process your request at this moment.\nPlease contact the developers with this error message: ${error.message} for question "${message}" `;

			convo.messages.push({ text: errorText, isUser: false, timestamp: Date.now() });
			setMessages(convo.messages);
			console.log({messages})
			console.log(errorText)
			addMessageToConversation(convo.id, { text: errorText, isUser: false, timestamp: Date.now() });

			const conversationExists = pastConversations.some(c => c.id === convo.id);
			const updatedConversations = conversationExists
				? pastConversations.map(c => (c.id === convo.id ? convo : c))  // Update existing
				: [...pastConversations, convo]; // Append new conversation if it doesn't exist
			setConversations(updatedConversations);
			window.localStorage.setItem('conversations', JSON.stringify(updatedConversations));
		} finally {
			setIsStreaming(false);
			console.log({messages})
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-10rem)] w-full items-center">
			{messages && messages.length > 0 && (
				<div className="xl:px-32 flex-grow overflow-auto w-full">
					<ChatMessages messages={messages} isStreaming={isStreaming} />
				</div>
			)}
			{messages && messages.length === 0 && (
				<div className="flex flex-col items-center justify-center h-full w-full">
					<h1 className="text-3xl font-bold mb-10">Ask DragonGPT</h1>
					<div className="flex flex-row items-start gap-10">
						<div className="flex flex-col items-center">
							<h2 className="hidden lg:block text-lg font-bold mb-4">Ask Questions</h2>
							<div className="flex flex-col gap-4">
								{samples.questions.map((message, index) => (
									// Put the message in the input field when clicked
									<Button key={index} variant="ghost" onClick={() => handleSendMessage(message)} className="max-w-80 h-fit text-wrap text-base font-light rounded-lg bg-gray-100 dark:bg-gray-100/40 hover:bg-gray-200 dark:hover:bg-gray-300/40 text-left px-2">
										{message}
									</Button>
								))}
							</div>
						</div>
						<div className="hidden lg:flex flex-col items-center">
							<h2 className="text-lg font-bold mb-4">What can DragonGPT do?</h2>
							<div className="flex flex-col gap-4">
								{samples.capabilities.map((str, index) => (
									<span className="max-w-80 h-fit text-wrap py-2 px-2 bg-gray-100 dark:bg-gray-100/40 rounded-lg" key={index}>{str}</span>
								))}
							</div>
						</div>
						<div className="hidden lg:flex flex-col items-center">
							<h2 className="text-lg font-bold mb-4">Limitations</h2>
							<div className="flex flex-col gap-4">
								{samples.limitations.map((str, index) => (
									<span className="max-w-80 h-fit text-wrap py-2 px-2 bg-gray-100 dark:bg-gray-100/40 rounded-lg" key={index}>{str}</span>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
			{!messages && (
				<div className="flex flex-grow justify-center">
					<Spinner className="" />
				</div>
			)}
			<ChatInput onSendMessage={handleSendMessage} messageRef={messageRef} />
		</div>
	);
}
