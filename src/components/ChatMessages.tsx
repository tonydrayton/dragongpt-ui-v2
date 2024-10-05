import Image from "next/image";
import { useEffect, useRef } from "react";
import MarioAvatar from "../public/mario.png";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useConversationStore } from "@/stores/useConversationStore";

const renderer = new marked.Renderer();
marked.setOptions({
	gfm: true,
	breaks: true,
	renderer: renderer
});

export default function ChatMessages({
	messages,
	isStreaming
}: {
	messages: Message[],
	isStreaming: boolean
}) {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}

	useEffect(() => {
		scrollToBottom();
		const chatMessages = document.getElementById('chat-messages');
		if (!chatMessages) return;
		const links = chatMessages.getElementsByTagName('a');
		for (let link of Array.from(links)) {
			link.setAttribute('target', '_blank');
		}
	}, [messages]);

	return (
		<div className="overflow-y-auto h-full w-full mt-auto justify-start flex flex-col margin-top: auto" id="chat-messages"> {/* Add id for links effect */}
			{messages.map((message, index) => (
				<div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} p-2`}>
					<div className={`flex rounded-lg p-2 ${message.isUser ? 'bg-gray-300/40' : ''}`}>
						{!message.isUser && (
							<Image
								src={MarioAvatar}
								alt="Mario Avatar"
								className="w-10 h-10 aspect-square rounded-full mr-4 object-cover flex-shrink-0 align-top"
							/>
						)}
						{message.isUser ? (
							<span>{message.text}</span>
						) : (
							<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(message.text) as string) }} />
						)}
						{/* Only show the loading animation if the message is being streamed */}
						{isStreaming && index === messages.length - 1 && (
							<span className="animate-pulse">...</span>
						)}
					</div>
				</div >
			))}
			<div ref={messagesEndRef} />
		</div>
	);
}
