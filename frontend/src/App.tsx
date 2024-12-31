
import './App.css'
import useSockets from '../hooks/useSockets'
function App() {

  const socket = useSockets()
  return (
    <>
    <h1>Hello World</h1>
    <div>
      <button onClick={() => socket.sendMessage('command')}>Command</button>
      <button onClick={() => socket.sendMessage('takeoff')}>Takeoff</button>
      <button onClick={() => socket.sendMessage('land')}>Land</button>
    </div>
    </>
  )
}

export default App
