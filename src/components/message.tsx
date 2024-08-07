import { ArrowUp } from "lucide-react";
import { useState } from "react";



interface MessageProps {
    text: string
    amountOfReactions: number
    answered?: boolean
}

export function Message({ amountOfReactions, text, answered = false }: MessageProps) {
    const [hasReacted, setHasReacted] = useState(false)

    function handleReactToMessage() {
        setHasReacted(true)
    }

    return (
        <li data-answered={answered} className='ml-4 leading-relaxed text-zinc-100  data-[answered=true]:opacity-50'>
            {text}
            {hasReacted
                ?
                <button type='button' disabled={answered} className='mt-3 flex items-center gap-2 text-orange-400 hover:text-orange-500'>
                    <ArrowUp className='size-4' />
                    Curtir pergunta ({amountOfReactions})
                </button>
                :
                <button onClick={handleReactToMessage} disabled={answered} type='button' className='mt-3 flex items-center gap-2 text-zinc-400 hover:text-zinc-500'>
                    <ArrowUp className='size-4' />
                    Curtir pergunta ({amountOfReactions})
                </button>
            }
        </li>
    )
}