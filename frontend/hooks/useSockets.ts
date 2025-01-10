import React from 'react';

type TelloLog = {
  command: string;
  index: number;
  response: number;
};

type Messages = {
  tello: TelloLog[];
};

const useSockets = () => {
  const [socket, setSocket] = React.useState<null | WebSocket>(null);
  const [messages, setMessages] = React.useState<Messages | null>(null);
  console.log(messages);
  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(
        JSON.stringify({
          com: [message, 0.564],
          time: new Date().getTime() / 1000
        })
      );
    }
  };

  React.useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3000');

    const handleMessage = (event: MessageEvent) => {
      setMessages(JSON.parse(event.data));
    };

    const handleError = (error: Event) => {
      console.error('WebSocket error: ', error);
    };

    newSocket.addEventListener('message', handleMessage);
    newSocket.addEventListener('error', handleError);

    setSocket(newSocket);

    return () => {
      newSocket.removeEventListener('message', handleMessage);
      newSocket.removeEventListener('error', handleError);
      newSocket.close();
    };
  }, []);

  return {
    socket,
    messages,
    sendMessage
  };
};

export default useSockets;
