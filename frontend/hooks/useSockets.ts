import React from 'react'

const useSockets = () => {
    const [socket, useSocket] = React.useState(null)

    const connectHandler = async () => {
        try {

            const newSocket = new WebSocket('ws://localhost:3000')
            
            newSocket.addEventListener("open", (event) => {
                newSocket.send("Hello Server!");
            });
            
            // Listen for messages
            newSocket.addEventListener("message", (event) => {
                console.log("Message from server ", event.data);
            });
        } catch (e) {
            console.log(e)
        }

    }

    React.useEffect(() => {
        connectHandler()
    }, [])
}

export default useSockets