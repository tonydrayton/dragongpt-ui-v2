import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mic, Send } from "lucide-react";
import { Textarea } from "./ui/textarea";

export default function ChatInput({
	onSendMessage,
	messageRef,
}: {
	onSendMessage: (message: string) => void;
	messageRef: React.RefObject<HTMLDivElement>;
}) {
	const [inputValue, setInputValue] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	const handleSend = () => {
		console.log("a");
		console.log({ inputValue });
		if (inputValue.trim().length > 0) {
			console.log(inputValue);
			setIsSending(true);
			onSendMessage(inputValue);
			setInputValue("");
			if (messageRef.current) {
				messageRef.current.innerText = "";
			}
			setTimeout(() => setIsSending(false), 500);
		}
	};

	// useEffect(() => {
	// 	if (textAreaRef.current) {
	// 		const textarea = textAreaRef.current;
	// 		if (textarea.textContent && textarea.textContent.length > 1) {
	// 			textarea.style.height = 'auto'; // Reset the height
	// 			const scrollHeight = textarea.scrollHeight;

	// 			// Check if the content overflows horizontally (text wrapping)
	// 			if (textarea.scrollHeight > textarea.clientHeight || textarea.scrollWidth > textarea.clientWidth) {
	// 				textarea.style.height = `${scrollHeight}px`;
	// 			}
	// 		}
	// 	}
	// }, [inputValue]);

	const handleMicClick = () => {
		const SpeechRecognition =
			(window as any).SpeechRecognition ||
			(window as any).webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		console.log({ recognition });
		recognition.lang = "en-US";
		recognition.interimResults = false;

		recognition.onstart = () => {
			setIsRecording(true);
			console.log("recognition start");
		};
		recognition.onresult = (event: any) => {
			const results = event.results as SpeechRecognitionResultList;
			const transcript = results[0][0].transcript;
			setInputValue(transcript);
			console.log(transcript);
			handleSend();
		};
		recognition.onerror = (event: any) => {
			console.error(event);
			setIsRecording(false);
		};
		recognition.onend = () => {
			console.log("recognition end");
			setIsRecording(false);
			handleSend();
		};

		recognition.start();
	};

	return (
		<div className="items-center justify-center flex flex-row gap-2 w-[-webkit-fill-available]">
			<div className="flex flex-row w-[-webkit-fill-available] max-w-xl border-solid border rounded-xl shadow-spread dark:shadow-none focus-within:ring-1 focus-within:ring-black">
				<div
					contentEditable={true}
					translate="no"
					onInput={(e) =>
						setInputValue((e.target as HTMLElement).textContent || "")
					}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					ref={messageRef}
					className="flex items-center flex-1 p-2 h-auto min-h-10 max-h-40 overflow-y-auto whitespace-pre-wrap break-words border-none
					focus-visible:ring-0 focus-visible:outline-none"
					data-placeholder="Message DragonGPT"
					id="input-yes"
				>
					{isRecording ? inputValue : <></>}
				</div>
				<Button
					onClick={handleMicClick}
					className={`rounded-full ${isRecording ? "bg-red-500 anime-pulse" : ""
						}`}
					variant="ghost"
				>
					<Mic />
				</Button>
			</div>
			<Button
				onClick={handleSend}
				disabled={isSending}
				className={`rounded-xl px-3`}
				variant="default"
			>
				<Send className="md:hidden" />
				<span className="hidden md:block">Send</span>
			</Button>
		</div>
	);
}
