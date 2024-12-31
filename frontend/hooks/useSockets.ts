import React from "react";

const useSockets = () => {
    const [socket, setSocket] = React.useState<null | WebSocket>(null);
    const [messages, setMessages] = React.useState<string[]>([])
    console.log(messages)
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

    return socket; // Return the WebSocket instance
};

export default useSockets;
