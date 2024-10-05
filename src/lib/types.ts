type Conversation = {
	id: string;
	title: string;
	messages: Message[];
	// This will probably include more fields in the future like the creator (user)
}

type Message = {
	text: string;
	isUser: boolean;
}
