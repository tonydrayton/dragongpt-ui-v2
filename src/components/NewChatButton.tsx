"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function NewChatButton() {
	const router = useRouter();

	const startNewConversation = () => {
		router.push(`/`);
	};

	return (
		<Button className="w-fit px-10 shadow-spread rounded-xl" variant={"default"} onClick={startNewConversation}>
			<Plus className="mr-2 scale-75" />New Chat
		</Button>
	)
}
