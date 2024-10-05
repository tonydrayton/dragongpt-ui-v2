'use client';

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { useConversationStore } from "@/stores/useConversationStore";

export default function RecentConversations({
	small
}: {
	small?: boolean,
}) {
	const { conversations, activeConversation, setActiveConversation } = useConversationStore();
	const router = useRouter();

	const handleSetActiveConversation = (convo: Conversation) => {
		setActiveConversation(convo);
		router.push(`/chat/${convo.id}`);
	};

	return (
		<div className={`${small ? 'items-center' : 'items-start'} flex flex-col items-start min-h-96 max-h-96 overflow-auto`}>
			{conversations.map(convo => (
				<Button
					key={convo.id}
					className={`${!small ? 'min-w-32' : ''} flex flex-shrink-0 items-center text-left ${convo.id === activeConversation?.id ? 'dark:bg-gray-200/20 bg-gray-200/60' : ''} hover:bg-gray-300/40 my-2`}
					onClick={() => handleSetActiveConversation(convo)}
					variant={"ghost"}
				>
					<MessageSquareText className={`${!small && 'mr-2'} w-4`} />
					{!small && (
						<span className="lg:max-w-44 md:max-w-32 max-w-52 truncate">{convo.title}</span>
					)}
				</Button>
			))}
		</div>
	);
};
