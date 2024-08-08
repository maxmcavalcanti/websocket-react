interface GetRoomMessagesRequest {
    roomId: string
}
export interface GetRoomMessagesResponse {
    messages: Array<{
        id: string
        text: string
        amountOfReactions: number
        answered: boolean
    }>
}
export async function getRoomMessages({ roomId }: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages`)

    const data: Array<{
        id: string
        room_id: string
        message: string
        reaction_count: number
        answered: boolean
    }> | null = await response.json()

    if (data === null) {
        return { messages: [] }
    }

    return {
        messages: data.map(message => ({
            id: message.id,
            text: message.message,
            amountOfReactions: message.reaction_count,
            answered: message.answered
        }))
    }
}