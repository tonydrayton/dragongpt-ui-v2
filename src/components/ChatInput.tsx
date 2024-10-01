import { useRef, useState } from "react";
import { Input } from "./ui/input"
import { Button } from "./ui/button";
import { Mic } from "lucide-react";

export default function ChatInput({
	onSendMessage,
	inputRef
}: {
	onSendMessage: (message: string) => void,
	inputRef: React.RefObject<HTMLInputElement>
}) {
	const [inputValue, setInputValue] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const dataArrayRef = useRef<Uint8Array | null>(null);
	const animationIdRef = useRef<number | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const handleSend = () => {
		if (inputValue.trim()) {
			setIsSending(true);
			onSendMessage(inputValue);
			setInputValue('');
			setTimeout(() => setIsSending(false), 500);
		}
	}

	const handleMicClick = () => {
		const recognition = new (window as any).webkitSpeechRecognition();
		recognition.lang = 'en-US';
		recognition.interimResults = false;

		recognition.onstart = () => {
			setIsRecording(true);
		}
		recognition.onresult = (event: any) => {
			const results = event.results as SpeechRecognitionResultList;
			const transcript = results[0][0].transcript;
			setInputValue(transcript);
		}
		recognition.onerror = () => {
			setIsRecording(false);
		}
		recognition.onend = () => {
			setIsRecording(false);
			handleSend();
		}

		recognition.start();
	}

	const startVisualizer = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const audioContext = new (window.AudioContext || AudioContext)();
			audioContextRef.current = audioContext;

			const source = audioContext.createMediaStreamSource(stream);
			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 2048;
			analyserRef.current = analyser;

			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			dataArrayRef.current = dataArray;

			source.connect(analyser);
			visualize();
		} catch (err) {
			console.error("Error accessing microphone:", err);
		}
	};

	const stopVisualizer = () => {
		if (audioContextRef.current) {
			audioContextRef.current.close();
		}
		cancelAnimationFrame(animationIdRef.current!);
		const canvas = canvasRef.current;
		if (canvas) {
			const canvasCtx = canvas.getContext("2d");
			if (canvasCtx) {
				canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
	};

	const visualize = () => {
		const canvas = canvasRef.current;
		if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

		const canvasCtx = canvas.getContext("2d");
		const analyser = analyserRef.current;
		const dataArray = dataArrayRef.current;

		const WIDTH = canvas.width;
		const HEIGHT = canvas.height;

		const draw = () => {
			animationIdRef.current = requestAnimationFrame(draw);

			analyser.getByteTimeDomainData(dataArray);

			if (!canvasCtx) return;
			canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "rgb(0, 255, 0)";

			canvasCtx.beginPath();

			let sliceWidth = (WIDTH * 1.0) / dataArray.length;
			let x = 0;

			for (let i = 0; i < dataArray.length; i++) {
				let v = dataArray[i] / 128.0;
				let y = (v * HEIGHT) / 2;

				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();
		};

		draw();
	};

	return (
		<div className="flex flex-row w-[-webkit-fill-available] max-w-xl border-solid border-2 rounded-full shadow-spread dark:shadow-none focus-within:ring-1 focus-within:ring-black">
			<Input
				type="text"
				placeholder="Message DragonGPT"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSend();
					}
				}}
				ref={inputRef}
				autoComplete="off"
				className="border-none focus-visible:ring-0"
			/>
			<Button
				onClick={handleMicClick}
				className="rounded-full"
			>
				<Mic />
			</Button>
		</div>
	)
}
