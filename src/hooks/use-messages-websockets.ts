import { useEffect } from "react"
import { GetRoomMessagesResponse } from "../http/get-room-messages"
import { useQueryClient } from "@tanstack/react-query"

interface UseMessagesWebsocketsParams {
    roomId: string
}

type WsEvent =
    | { kind: 'message_created', value: { id: string, message: string } }
    | { kind: 'message_answered', value: { id: string } }
    | { kind: 'message_reacted' | 'message_removed_reaction', value: { id: string, reaction_count: number } }

export function useMessagesWebsockets({ roomId }: UseMessagesWebsocketsParams) {
    const queryClient = useQueryClient()

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)
        ws.onopen = () => { console.log('connected') }
        ws.onclose = () => { console.log('disconnected') }

        ws.onmessage = (event) => {
            const data: WsEvent = JSON.parse(event.data)
            switch (data.kind) {
                case 'message_created':
                    queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (oldData) => {
                        return {
                            messages: [
                                ...(oldData?.messages ?? []),
                                {
                                    id: data.value.id,
                                    text: data.value.message,
                                    amountOfReactions: 0,
                                    answered: false
                                }
                            ]
                        }
                    })
                    break
                case 'message_answered':
                    queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (oldData) => {
                        return {
                            messages: oldData?.messages.map(message => {
                                if (message.id === data.value.id) {
                                    return {
                                        ...message,
                                        answered: true
                                    }
                                }
                                return message
                            }) ?? []
                        }
                    })
                    break
                case "message_reacted":
                case 'message_removed_reaction':
                    queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (oldData) => {
                        return {
                            messages: oldData?.messages.map(message => {
                                if (message.id === data.value.id) {
                                    return {
                                        ...message,
                                        amountOfReactions: data.value.reaction_count
                                    }
                                }
                                return message
                            }) ?? []
                        }
                    })
                    break
            }
        }
        return () => { ws.close() }
    }, [queryClient, roomId])
}