"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewChatButton({
	state
}: {
	state?: "open" | "closed"
}) {
	const router = useRouter();

	const startNewConversation = () => {
		router.push(`/`);
	};

	return (
		<>
			{!state || state == 'open' ? (
				<Button className="w-fit px-10 shadow-spread rounded-xl" variant={"default"} onClick={startNewConversation}>
					<Plus className="mr-2 scale-75" />New Chat
				</Button>
			) : (
				<Button className="w-fit shadow-spread rounded-xl" variant={"default"} onClick={startNewConversation}>
					<Plus className="scale-75" />
				</Button>
			)}
		</>
	)
}
