import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useMessagesWebsockets } from "../hooks/use-messages-websockets";
import { getRoomMessages } from "../http/get-room-messages";
import { Message } from "./message";

export function Messages() {
    const { roomId } = useParams()
    if (!roomId) { throw new Error('Room ID is required ') }

    const { data } = useSuspenseQuery({
        queryFn: () => getRoomMessages({ roomId }),
        queryKey: ['messages', roomId]
    })

    useMessagesWebsockets({ roomId })
    return (
        <ol className='list-decimal list-outside px-3 space-y-8'>
            {data?.messages.sort((a, b) => b.amountOfReactions - a.amountOfReactions).map((message) => (
                <Message
                    key={message.id}
                    id={message.id}
                    text={message.text}
                    amountOfReactions={message.amountOfReactions}
                    answered={message.answered}
                />
            ))}
        </ol>
    )
}