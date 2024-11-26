import { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import axios from 'axios';

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimestamps, setClickTimestamps] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [log, setLog] = useState([]);

  const handleClick = async () => {
    if (isButtonDisabled) return;

    const now = Date.now();
    setClickTimestamps((prev) => [...prev, now]);
    
    try {
      const response = await axios.get('https://api.restful-api.dev/objects');
      if (response.status === 200) {
        setClickCount((prev) => prev + 1);
        setLog((prev) => [...prev, `${new Date(now).toLocaleTimeString()} - API Hit`]);
      }
    } catch (error) {
      setLog((prev) => [...prev, `${new Date(now).toLocaleTimeString()} - API Miss`]);
    }
  };

  useEffect(() => {
    const filteredTimestamps = clickTimestamps.filter((timestamp) => Date.now() - timestamp < 10000);
    setClickTimestamps(filteredTimestamps);

    setIsButtonDisabled(filteredTimestamps.length >= 2);
  }, [clickTimestamps]);

  return (
    <div className="App">
      <Button onClick={handleClick} disabled={isButtonDisabled}>
        {isButtonDisabled ? 'Rate Limited' : 'Call API'}
      </Button>
      <div style={{ marginTop: '20px' }}>
        <h3>Click Log:</h3>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
