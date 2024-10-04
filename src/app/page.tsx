import ChatInterface from "@/components/ChatInterface";
import { ModeToggle } from "@/components/ModeToggle";
import Nav from "@/components/Nav";
import RecentConversations from "@/components/RecentConversations";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, Trash2Icon, TrashIcon } from 'lucide-react';
import { X } from 'lucide-react';

const fetchConversations = async (): Promise<Conversation[]> => { // mock API call
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

export default async function Home() {
	const conversations = await fetchConversations();
	return (
		<div className="m-4 flex">
			<Nav conversations={conversations}/>
			<div className="p-4 xl:px-24 lg:px-18 md:px-14 sm:px-3 w-full">
				<div className="flex flex-col gap-8">
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
					<ChatInterface />
				</div>
			</div>
		</div>
	);
}
