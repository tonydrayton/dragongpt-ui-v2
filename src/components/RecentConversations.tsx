'use client';

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { EllipsisVertical, Link, MessageSquareText, SquarePen, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

const RecentConversations = ({
	conversations,
	activeConversation,
	small
}: {
	conversations: Conversation[],
	activeConversation?: Conversation,
	small?: boolean,
}) => {
	const router = useRouter();

	const setActiveConversation = (convo: Conversation) => {
		router.push(`/chat/${convo.id}`);
	};
	return (
		<div className={`${small ? 'items-center' : 'items-start'} flex flex-col items-start max-h-96`}>
			{conversations.map((convo, index) => (
				<div className='grid grid-cols-[1fr_auto] items-center justify-start' key={index}>
					<ContextMenu>
						<ContextMenuTrigger>
							<Button
								key={convo.id}
								className={`${!small ? 'min-w-32 px-1' : ''} flex flex-shrink-0 items-center text-left ${convo.id === activeConversation?.id ? 'dark:bg-gray-200/20 bg-gray-200/60' : ''} hover:bg-gray-300/40 my-2`}
								onClick={() => setActiveConversation(convo)}
								variant={"ghost"}
							>
								<MessageSquareText className={`${!small && 'mr-2'} w-4`} />
								{!small && (
									<span className="lg:max-w-44 md:max-w-32 max-w-52 w-28 truncate">{convo.title}</span>
								)}
							</Button>
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>
								<SquarePen className="mr-3" /> Rename
							</ContextMenuItem>
							<ContextMenuItem>
								<Link className="mr-3" /> Copy URL
							</ContextMenuItem>
							<ContextMenuItem className="text-red-500">
								<Trash2 className="mr-3" /> Delete
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>

					{!small && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="p-0 px-2 flex items-center">
									<EllipsisVertical className="opacity-70" />
									<span className="sr-only">Conversation options</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>
									<SquarePen className="mr-3" /> Rename
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link className="mr-3" /> Copy URL
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500">
									<Trash2 className="mr-3" /> Delete

								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			))}
		</div>
	);
};

export default RecentConversations;
