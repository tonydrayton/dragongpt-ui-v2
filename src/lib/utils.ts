import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const samples = {
	questions: [
		'What are the top engineering programs at Drexel?',
		'What are the on campus housing options at Drexel?',
		'What resources are available for freshman academic support at Drexel?',
	],
	capabilities: [
		'Reference general sources or explain where you might find further reading.',
		'Answer questions on a wide range of topics, from academics to general knowledge.',
		'Assist with research, offering insight across various fields.',
	],
	limitations: [
		'May occasionally get incorrect information.',
		'May occasionally produce harmful instructions or biased content.',
		'Limited knowledge, Drexel community based.'
	]
};
