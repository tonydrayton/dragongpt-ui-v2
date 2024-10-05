"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { v4 } from "uuid";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

const samples = {
	questions: [
		'What are the top engineering programs at Drexel?',
		'What are the on campus housing options at Drexel?',
		'What resources are available for freshman academic support at Drexel?',
	],
	capabilities: [
		'Reference general sources or explain where you might find further reading.',
		'Answer questions on a wide range of topics, from academics to general knowledge.',
		'Assist with research, offering insight across various fields.',
	],
	limitations: [
		'May occasionally get incorrect information.',
		'May occasionally produce harmful instructions or biased content.',
		'Limited knowledge, Drexel community based.'
	]
};

export default function ChatInterface({
	activeConversation
}: {
	activeConversation?: Conversation
}) {
	const [activeConvo, setActiveConvo] = useState(activeConversation);
	const [messages, setMessages] = useState<{ text: string, isUser: boolean }[] | null>(null);
	const [isStreaming, setIsStreaming] = useState(false);
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
		setActiveConvo(activeConversation);
	}, [activeConversation]);

	const handleSendMessage = async (message: string) => {
		console.log({activeConvo})
		let convo = activeConvo;
		const pastConversations = JSON.parse(window.localStorage.getItem('conversations') || '[]') as Conversation[];

		if (!convo) {
			const uuid = v4();
			convo = { id: uuid, title: `Conversation ${pastConversations.length + 1}`, messages: [] };
			convo.messages.push({ text: message, isUser: true });
			console.log('storing...')
			setActiveConvo(convo);
			window.localStorage.setItem('conversations', JSON.stringify([...pastConversations, convo]));
			window.history.pushState(null, '', `/chat/${uuid}`);
		} else {
			convo.messages = [...convo.messages, { text: message, isUser: true }];
			const updatedConversations = pastConversations.map(c =>
				c.id === convo!.id ? convo : c
			);
			window.localStorage.setItem('conversations', JSON.stringify(updatedConversations));
		}
		console.log(window.localStorage.getItem('conversations'))

		console.log({convo})

		setMessages(prev => [...prev!, { text: message, isUser: true }]);
		setMessages(prev => [...prev!, { text: '', isUser: false }]);

		try {
			console.log(window.localStorage.getItem('conversations'))

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
						const newMessages = [...prev!];
						const lastMessage = newMessages[newMessages.length - 1];
						lastMessage.text = chunks;
						return newMessages;
					});
				};

				updateMessages(accumulatedChunks);
			}

			convo.messages.push({ text: accumulatedChunks, isUser: false });
			const updatedConversations = pastConversations.length > 0 ? pastConversations.map(c => c.id === convo.id ? convo : c) : [convo];
			window.localStorage.setItem('conversations', JSON.stringify(updatedConversations));
		} catch (error: any) {
			console.log(window.localStorage.getItem('conversations'))

			console.error('Error fetching bot response:', error.message);
			const errorText = `I'm sorry, I couldn't process your request at this moment.\nPlease contact the developers with this error message: ${error.message} for question "${message}" `;

			convo.messages.push({ text: errorText, isUser: false });
			const updatedConversations = pastConversations.length > 0 ? pastConversations.map(c => c.id === convo.id ? convo : c) : [convo];
			console.log({updatedConversations})
			console.log(window.localStorage.getItem('conversations'))

			window.localStorage.setItem('conversations', JSON.stringify(updatedConversations));

			setMessages(prev => {
				const newMessages = [...prev!];
				newMessages[newMessages.length - 1].text = errorText;
				return newMessages;
			});

		} finally {
			setIsStreaming(false);
			console.log(window.localStorage.getItem('conversations'))

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
