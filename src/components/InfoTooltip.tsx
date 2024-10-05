import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

export default function InfoTooltip() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Info />
				</TooltipTrigger>
				<TooltipContent className="max-w-80">DragonGPT answers any of your Drexel questions in seconds by providing immediate, personalized responses to help you make informed decisions and avoid common mistakes</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
