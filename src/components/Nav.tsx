import { Ellipsis, Plus, Trash2Icon, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import RecentConversations from "./RecentConversations";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from "./ui/sheet";

export default function Nav({
	conversations,
	activeConversation,
}: {
	conversations: Conversation[],
	activeConversation: Conversation,
}) {
	return (
		<nav className="md:bg-almostWhite dark:bg-background-70 m-4 md:border-2 dark:border dark:border-solid lg:min-w-fit lg:w-72 md:w-60 transition-all ease-in-out duration-200 h-fit md:h-[calc(100vh-4rem)] md:shadow-spread dark:shadow-sm rounded-2xl backdrop-blur border-border/40 items-center">
			<div className="hidden md:block p-6 h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200" id="navbar">
				<div className="flex justify-center items-center mb-4 transition-all ease-in-out duration-200">
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
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger className="fixed mt-1" asChild>
						<Button variant="ghost">
							<Ellipsis />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[400px] sm:w-[540px]">
						<div className="p-6 h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200" id="navbar">
							<div className="flex gap-2 justify-center items-center mb-4 transition-all ease-in-out duration-200">
								<ModeToggle />
								<Button className="w-fit px-10 shadow-spread rounded-xl" variant={"default"}>
								<Plus className="mr-2 scale-75" />New Chat
							</Button>
							</div>


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
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}
