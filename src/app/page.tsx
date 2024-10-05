'use client';
import { useConversationStore } from "@/stores/useConversationStore";
import ChatInterface from "@/components/ChatInterface";
import Nav from "@/components/Nav";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import InfoTooltip from "@/components/InfoTooltip";


export default function Home() {
	const { conversations, setConversations, activeConversation, setActiveConversation } = useConversationStore();
	const pathname = usePathname();

	useEffect(() => {
		const fetchConversations = () => {
			return JSON.parse(window.localStorage.getItem('conversations') || '[]') as Conversation[];
		};

		if (typeof window !== "undefined") {
			setConversations(fetchConversations());
		}
	}, []);

	useEffect(() => {
		const updatedConversations = JSON.parse(window.localStorage.getItem('conversations') || '[]');
		setConversations(updatedConversations);
		const conversationId = window.location.pathname.split('/').pop();
		const activeConversation = updatedConversations.find(
			(convo: Conversation) => convo.id === conversationId
		);
		setActiveConversation(activeConversation);
	}, [pathname]);

	return (
		<div className="m-4 flex">
			<Nav />
			<div className="p-4 xl:px-24 lg:px-18 md:px-14 sm:px-3 w-full">
				<div className="flex flex-col gap-8">
					<div className="flex flex-row pb-4 md:relative md:left-[-50px] md:top-[20px] justify-center md:justify-normal">
						<h1 className="text-4xl px-4 font-bold">DragonGPT</h1>
						<InfoTooltip />
					</div>
					<ChatInterface />
				</div>
			</div>
		</div>
	);
}
