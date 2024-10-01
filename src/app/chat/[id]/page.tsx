import { notFound } from "next/navigation"; // To handle invalid IDs
import RecentConversations from "@/components/RecentConversations";

// Mock function to fetch conversations (replace with your API/data fetch)
const fetchConversations = async () => {
	return [
		{ id: 1, title: "Conversation 1", content: "This is the first conversation." },
		{ id: 2, title: "Conversation 2", content: "This is the second conversation." },
		{ id: 3, title: "Conversation 3", content: "This is the third conversation." },
	];
};

// This function is called for every page load (SSR)
export async function generateMetadata({ params }: { params: { id: string }}) {
	const conversations = await fetchConversations();
	const activeConversation = conversations.find(
		(convo) => convo.id === parseInt(params.id)
	);

	if (!activeConversation) {
		return { title: "Conversation Not Found" };
	}

	return {
		title: activeConversation.title,
		description: `Viewing ${activeConversation.title}`,
	};
}

export default async function ChatPage({ params }: { params: { id: string }}) {
	const conversations = await fetchConversations();
	const activeConversation = conversations.find((convo) => convo.id === parseInt(params.id));

	if (!activeConversation) {
		notFound();
	}

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<nav className="hidden lg:flex lg:w-1/4 bg-almostWhite shadow-spread m-4 h-[calc(100vh-2rem)] p-4 overflow-y-auto">
				<RecentConversations conversations={conversations} activeConversation={activeConversation} />
			</nav>

			{/* Chat Area */}
			<div className="flex-1 p-6 bg-white m-4 shadow-lg rounded-lg overflow-y-auto">
				<h2 className="text-2xl font-bold mb-4">{activeConversation.title}</h2>
				<p>{activeConversation.content}</p>
			</div>
		</div>
	);
}
