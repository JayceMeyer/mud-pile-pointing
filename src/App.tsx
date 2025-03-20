import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [updates, setUpdates] = useState([
    { id: 1, time: '09:00 AM', content: 'The mud pile has been officially established!' },
    { id: 2, time: '10:30 AM', content: 'First pointer arrived! Very enthusiastic pointing.' },
    { id: 3, time: '11:45 AM', content: 'The mud is maintaining excellent pointability.' },
    { id: 4, time: '01:15 PM', content: 'Lunch break. Mud remains unpointed temporarily.' },
    { id: 5, time: '02:00 PM', content: 'Pointing has resumed with increased vigor!' }
  ])
  
  const [newUpdate, setNewUpdate] = useState('')
  const [mudMoisture, setMudMoisture] = useState(75)
  const [pointCount, setPointCount] = useState(42)
  const [isRaining, setIsRaining] = useState(false)
  
  // Simulate random mud moisture changes
  useEffect(() => {
    const interval = setInterval(() => {
      setMudMoisture(prev => {
        const change = Math.floor(Math.random() * 7) - 3
        const newMoisture = Math.max(0, Math.min(100, prev + change))
        return newMoisture
      })
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])
  
  const addUpdate = () => {
    if (newUpdate.trim() === '') return
    
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`
    
    const newUpdateObj = {
      id: updates.length + 1,
      time: timeString,
      content: newUpdate
    }
    
    setUpdates([...updates, newUpdateObj])
    setNewUpdate('')
  }
  
  const incrementPointers = () => {
    setPointCount(prev => prev + 1)
  }
  
  const toggleRain = () => {
    setIsRaining(prev => !prev)
    if (!isRaining) {
      setMudMoisture(prev => Math.min(100, prev + 15))
    }
  }

  return (
    <div className={`app-container ${isRaining ? 'raining' : ''}`}>
      <h1 className="title">🌧️ Mud Pile Pointing Event 🌧️</h1>
      <div className="mud-status">
        <div className="status-item">
          <h2>Pointer Count</h2>
          <div className="status-value">{pointCount}</div>
          <button onClick={incrementPointers}>Someone New Pointed!</button>
        </div>
        
        <div className="status-item">
          <h2>Mud Moisture</h2>
          <div className="moisture-meter">
            <div 
              className="moisture-level" 
              style={{ width: `${mudMoisture}%` }}
            ></div>
          </div>
          <div className="status-value">{mudMoisture}%</div>
        </div>
        
        <div className="status-item">
          <h2>Weather Status</h2>
          <div className="status-value">{isRaining ? '🌧️ Raining' : '☀️ Clear'}</div>
          <button onClick={toggleRain}>
            {isRaining ? 'Stop Rain' : 'Make it Rain'}
          </button>
        </div>
      </div>
      
      <div className="updates-section">
        <h2>Event Updates</h2>
        <div className="updates-list">
          {updates.map(update => (
            <div key={update.id} className="update-item">
              <div className="update-time">{update.time}</div>
              <div className="update-content">{update.content}</div>
            </div>
          ))}
        </div>
        
        <div className="new-update">
          <input
            type="text"
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Enter a new mud pile update..."
          />
          <button onClick={addUpdate}>Post Update</button>
        </div>
      </div>
      
      <footer>
        <p> {new Date().getFullYear()} Mud Pile Pointing Society | All Rights Reserved</p>
        <p><small>Remember: Point, don't poke!</small></p>
      </footer>
    </div>
  )
}

export default App
