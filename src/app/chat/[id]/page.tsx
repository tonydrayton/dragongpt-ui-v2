import { notFound } from "next/navigation";
import RecentConversations from "@/components/RecentConversations";
import Nav from "@/components/Nav";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const fetchConversations = async () => {
	return [
		{ id: 1, title: "Conversation 1", messages: [
			{
				text: 'Hi?',
				isUser: true
			},
			{
				text: 'Hello!',
				isUser: false
			},
			{
				text: 'How are you?',
				isUser: true
			},
			{
				text: 'I am doing well, thank you!',
				isUser: false
			},
			{
				text: 'That is good to hear!',
				isUser: true
			},
			{
				text: 'Yes, it is!',
				isUser: false
			},
			{
				text: 'Goodbye!',
				isUser: true
			},
			{
				text: 'Goodbye!',
				isUser: false
			}
		] }
	];
};

// This function is called for every page load (SSR)
export async function generateMetadata({ params }: { params: { id: string }}) {
	const conversations = await fetchConversations();
	const activeConversation = conversations.find(
		(convo) => convo.id === parseInt(params.id)
	);

	if (!activeConversation) {
		return { title: "Conversation Not Found" };
	}

	return {
		title: activeConversation.title,
		description: `Viewing ${activeConversation.title}`,
	};
}

export default async function ChatPage({ params }: { params: { id: string }}) {
	const conversations = await fetchConversations();
	const activeConversation = conversations.find((convo) => convo.id === parseInt(params.id));

	if (!activeConversation) {
		notFound();
	}

	return (
		<div className="m-4 flex">
			<Nav conversations={conversations} activeConversation={activeConversation} />
			<div className="p-4 xl:px-24 lg:px-18 md:px-14 sm:px-3 w-full">
				<div className="flex flex-col">
					<div className="flex flex-row pb-4 md:relative md:left-[-50px] md:top-[20px] justify-center md:justify-normal">
						<h1 className="text-4xl px-4 font-bold">DragonGPT</h1>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info />
								</TooltipTrigger>
								<TooltipContent>TODO: Add tooltip text</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<ChatInterface previousMessages={activeConversation.messages} />
				</div>
			</div>
		</div>
	);
}
