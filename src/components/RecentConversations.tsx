'use client';

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { MessageSquareText } from "lucide-react";

const RecentConversations = ({
	conversations,
	activeConversation,
}: {
	conversations: Conversation[],
	activeConversation: Conversation,
}) => {
	const router = useRouter();

	const setActiveConversation = (convo: Conversation) => {
		router.push(`/chat/${convo.id}`);
	};
	return (
		<div className="flex flex-col items-start min-h-96">
			{conversations.map(convo => (
				<Button
					key={convo.id}
					className={`min-w-32 flex flex-shrink-0 items-center text-left ${convo.id === activeConversation.id ? 'bg-gray-200/60' : ''} hover:bg-gray-300/40 my-2`}
					onClick={() => setActiveConversation(convo)}
					variant={"ghost"}
				>
					<MessageSquareText className="mr-2 w-4"/>
					<span className="lg:max-w-44 md:max-w-32 truncate">{convo.title}</span>
				</Button>
			))}
		</div>
	);
};

export default RecentConversations;
