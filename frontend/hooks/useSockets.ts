import React from "react";

const useSockets = () => {
    const [socket, setSocket] = React.useState<null | WebSocket>(null);
    const [messages, setMessages] = React.useState<string[]>([])

    const sendMessage = (message: string) => {
        if (socket) {
            socket.send(JSON.stringify({
                "com":[message,0.564],
                "time": new Date().getTime()
            }))
        }
    }
    
    React.useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:3000");

        // Handle messages
        const handleMessage = (event: MessageEvent) => {
            setMessages((prev) => [...prev, event.data])
            console.log("Message from server: ", event.data);
        };

        // Handle errors
        const handleError = (error: Event) => {
            console.error("WebSocket error: ", error);
        };

        // Attach listeners
        newSocket.addEventListener('message', handleMessage)
        newSocket.addEventListener("error", handleError);

        // Update socket state
        setSocket(newSocket);

        // Cleanup
        return () => {
            newSocket.removeEventListener("message", handleMessage);
            newSocket.removeEventListener("error", handleError);
            newSocket.close();
        };
    }, []);

    return {
        socket, messages, sendMessage
    }; 
};

export default useSockets;
