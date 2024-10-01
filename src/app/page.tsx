import ChatInterface from "@/components/ChatInterface";
import { ModeToggle } from "@/components/ModeToggle";
import Nav from "@/components/Nav";
import RecentConversations from "@/components/RecentConversations";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info, Plus, Trash2Icon, TrashIcon } from 'lucide-react';
import { X } from 'lucide-react';

const fetchConversations = async (): Promise<Conversation[]> => { // mock API call
	return [
		{ id: 1, title: 'Conversation 1 dwiaubdawiudbawudiawb', content: 'This is the first conversation.' },
		{ id: 2, title: 'Conversation 2', content: 'This is the second conversation.' },
		{ id: 3, title: 'Conversation 3', content: 'This is the third conversation.' },
	];
};

export default async function Home() {
	const conversations = await fetchConversations();
	const activeConversation = conversations[0]; // default
	return (
		<div className="p-4 m-4 flex">
			<Nav conversations={conversations} activeConversation={activeConversation} />
			<div className="py-4 xl:px-24 lg:px-12 md:px-14 sm:px-3 w-full">
				<div className="flex flex-col items-center">
					<div className="flex flex-row items-center pb-4">
						<h1 className="text-4xl px-4 font-bold">DragonGPT</h1>
						<Info />
					</div>
					<ChatInterface />
				</div>
			</div>
		</div>
	);
}
