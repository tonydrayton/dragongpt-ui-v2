'use client';

import { Ellipsis, Menu, Plus, SquareArrowOutUpRight, Trash2Icon, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button, buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import RecentConversations from "./RecentConversations";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from "./ui/sheet";
import NewChatButton from "./NewChatButton";
import { useState } from "react";
import Link from "next/link";
import ClearAllChatsButton from "./ClearAllChatsButton";

export default function Nav({
	conversations,
	activeConversation,
}: {
	conversations: Conversation[],
	activeConversation?: Conversation,
}) {
	const [open, setOpen] = useState(true);

	const handleClearAllChats = () => {
		window.localStorage.removeItem('conversations');
		window.location.reload();
	}

	return (
		<nav className={`fixed md:relative md:bg-almostWhite dark:bg-background-70 m-4 md:border-2 dark:border-solid transition-all ease-in-out duration-300 h-fit md:h-[calc(100vh-4rem)] md:shadow-spread dark:shadow-sm rounded-2xl backdrop-blur border-border/40 items-center ${open ? 'lg:w-72 md:w-96 md:overflow-hidden' : 'w-32'
			}`}>
			{open ? (
				<div className="hidden md:block p-6 h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200" id="navbar">
					<div className="flex justify-center items-center mb-4 transition-all ease-in-out duration-200">
						<Button variant="ghost" className="ml-auto hover:bg-gray-300/40" onClick={() => setOpen(false)}>
							<X />
						</Button>
					</div>
					<NewChatButton />

					<Separator className="my-6" />
					<div>
						<h2 className="scroll-m-20 pb-2 text-2xl font-bold tracking-wide first:mt-0">Recent</h2>
						<RecentConversations
							conversations={conversations}
							activeConversation={activeConversation}

						/>
					</div>
					<Separator className="my-6" />
					<div className="flex flex-col items-start gap-2">
						<ClearAllChatsButton />
						<Button variant={"ghost"} className="hover:bg-gray-300/40 py-4" asChild>
							<Link href="/faq" className={buttonVariants({ variant: "ghost" })}>
								<SquareArrowOutUpRight className="h-[1.2rem] w-[1.2rem] mr-2" />Updates & FAQ
							</Link>
						</Button>
						<ModeToggle />

					</div>
				</div>
			) : (
				<div className="hidden md:block p-6 h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200" id="navbar">
					<div className="flex flex-col justify-center items-center transition-all ease-in-out duration-200 gap-4">
						<Button variant="ghost" className="hover:bg-gray-300/40" onClick={() => setOpen(true)}>
							<Menu />
						</Button>
						<NewChatButton state={'closed'} />
						<Separator />
					</div>

					<div className="min-h-96">
						{/* <h2 className="scroll-m-20 pb-2 text-2xl font-bold tracking-wide first:mt-0">Recent</h2> */}
					<RecentConversations
						conversations={conversations}
						activeConversation={activeConversation}
						small
					/>
					</div>
					<Separator className="my-6" />
					<div className="flex flex-col items-start gap-2">
						<ClearAllChatsButton iconOnly />
						<Button variant={"ghost"} className="hover:bg-gray-300/40 py-4">
							<SquareArrowOutUpRight className="h-[1.2rem] w-[1.2rem] mr-2" />
						</Button>
						<ModeToggle iconOnly />

					</div>
				</div>
			)}
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger className="fixed mt-1" asChild>
						<Button variant="ghost">
							<Ellipsis />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[webkit-fill-available] sm:w-[540px]">
						<div className="p-6 h-full justify-between box-border w-[-webkit-fill-available] transition-all ease-in-out duration-200" id="navbar">
							<div className="flex gap-2 justify-center items-center mb-4 transition-all ease-in-out duration-200">
								<NewChatButton />
							</div>

							<Separator className="my-6" />
							<div>
								<h2 className="scroll-m-20 pb-2 text-2xl font-semibold first:mt-0">Recent</h2>
								<RecentConversations
									conversations={conversations}
									activeConversation={activeConversation}
								/>
							</div>
							<Separator className="my-6" />
							<div className="flex flex-col items-start gap-4">
								<ClearAllChatsButton />
								<Button variant={"ghost"} className="hover:bg-gray-300/40 py-4">
									<SquareArrowOutUpRight className="mr-2" />Updates & FAQ
								</Button>
								<ModeToggle />

							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}
