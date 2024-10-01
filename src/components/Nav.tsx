import { Plus, Trash2Icon, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import RecentConversations from "./RecentConversations";

export default function Nav({
	conversations,
	activeConversation,
}: {
	conversations: Conversation[],
	activeConversation: Conversation,
}) {
	return (
		<nav className="hidden bg-almostWhite dark:bg-background-70  dark:border-solid border-2 lg:flex lg:min-w-fit md:flex lg:w-72 md:w-60 transition-all ease-in-out duration-200 h-[calc(100vh-4rem)] shadow-spread dark:shadow-sm rounded-2xl backdrop-blur border-border/40 items-center">
			<div className="p-6 h-full justify-between box-border w-[-webkit-fill-available]">
				<div className="flex justify-center items-center mb-4">
					<ModeToggle />
					<Button variant="ghost" className="ml-auto hover:bg-gray-300/40">
						<X />
					</Button>
				</div>
				<Button className="w-full px-10 shadow-spread rounded-xl" variant={"default"}>
					<Plus className="mr-2 scale-75" />New Chat
				</Button>

				<Separator className="my-6" />
				<div>
					<h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">Recent</h2>
					<RecentConversations
						conversations={conversations}
						activeConversation={activeConversation}
					/>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col">
					<Button variant={"ghost"} className="hover:bg-gray-300/40 py-4">
						<Trash2Icon className="mr-2" />Clear all chats
					</Button>
				</div>
			</div>
		</nav>
	)
}
