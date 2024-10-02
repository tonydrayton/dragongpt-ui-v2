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
		{ id: 1, title: 'Conversation 1 dwiaubdawiudbawudiawdwadjhwadhajwd ahjwd b', content: 'This is the first conversation.' },
		{ id: 2, title: 'Conversation 2', content: 'This is the second conversation.' },
		{ id: 3, title: 'Conversation 3', content: 'This is the third conversation.' },
	];
};

export default async function Home() {
	const conversations = await fetchConversations();
	const activeConversation = conversations[0]; // default
	return (
		<div className="m-4 flex">
			<Nav conversations={conversations} activeConversation={activeConversation} />
			<div className="p-4 xl:px-24 lg:px-12 md:px-14 sm:px-3 w-full">
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
					<ChatInterface />
				</div>
			</div>
		</div>
	);
}
