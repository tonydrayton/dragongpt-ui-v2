'use client';

import ChatInterface from "@/components/ChatInterface";
import { ModeToggle } from "@/components/ModeToggle";
import Nav from "@/components/Nav";
import RecentConversations from "@/components/RecentConversations";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, Trash2Icon, TrashIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function Home() {
	const [conversations, setConversations] = useState<Conversation[]>([]);

	useEffect(() => {
		const fetchConversations = () => {
			return JSON.parse(window.localStorage.getItem('conversations') || '[]') as Conversation[];
		};

		if (typeof window !== "undefined") {
			setConversations(fetchConversations());
		}
	}, []);

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
