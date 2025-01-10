import styles from './App.module.css';
import useSockets from '../hooks/useSockets';
import Button from '../components/Button';

function App() {
  const socket = useSockets();
  return (
    <div className={styles.wrapper}>
      <h1>Mind Control Drone</h1>
      <div className={styles.content}>
        <div className={styles.logs}>
          Drone Logs
          {socket.messages && Array.isArray(socket.messages.tello) ? (
            socket.messages.tello.map((log) => (
              <p key={log.index}>
                {log.command} {log.response}
              </p>
            ))
          ) : (
            <p>Pending</p>
          )}
        </div>
        <div className={styles.buttons}>
          <Button onClick={() => socket.sendMessage('command')} label="Command" />
          <Button onClick={() => socket.sendMessage('takeoff')} label="Takeoff" />
          <Button onClick={() => socket.sendMessage('disappear')} label="Land" />
        </div>
      </div>
    </div>
  );
}

export default App;
