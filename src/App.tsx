import { useState, useEffect, useRef } from 'react'
import './App.css'

// Define the update type with TypeScript
interface Update {
  id: number;
  time: string;
  content: string;
  imageUrl?: string;
}

function App() {
  // Audio references
  const splatterSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const [updates, setUpdates] = useState<Update[]>([
    { 
      id: 1, 
      time: '09:00 AM', 
      content: 'The mud pile has been officially established!',
      imageUrl: 'https://images.unsplash.com/photo-1583265627959-fb7042f5133b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG11ZHxlbnwwfHwwfHx8MA%3D%3D'
    },
    { 
      id: 2, 
      time: '10:30 AM', 
      content: 'First pointer arrived! Very enthusiastic pointing.',
      imageUrl: 'https://images.unsplash.com/photo-1601059281162-c3079a6799bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ibnRpbmd8ZW58MHx8MHx8fDA%3D'
    },
    { 
      id: 3, 
      time: '11:45 AM', 
      content: 'The mud is maintaining excellent pointability.' 
    },
    { 
      id: 4, 
      time: '01:15 PM', 
      content: 'Lunch break. Mud remains unpointed temporarily.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHVuY2h8ZW58MHx8MHx8fDA%3D'
    },
    { 
      id: 5, 
      time: '02:00 PM', 
      content: 'Pointing has resumed with increased vigor!',
      imageUrl: 'https://images.unsplash.com/photo-1508175800969-525c72a047dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ibnRpbmd8ZW58MHx8MHx8fDA%3D'
    }
  ])
  
  const [newUpdate, setNewUpdate] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [mudMoisture, setMudMoisture] = useState(75)
  const [pointCount, setPointCount] = useState(42)
  const [isRaining, setIsRaining] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [showSplatter, setShowSplatter] = useState(false)
  const [buttonSplatter, setButtonSplatter] = useState(false)
  const [mudJiggle, setMudJiggle] = useState(false)
  
  // Modal and carousel state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [carouselImages, setCarouselImages] = useState<string[]>([])
  
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
  
  // Initialize audio elements
  useEffect(() => {
    splatterSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
    splatterSoundRef.current.volume = 0.4;
    
    return () => {
      if (splatterSoundRef.current) {
        splatterSoundRef.current.pause();
      }
    };
  }, []);
  
  const addUpdate = () => {
    if (newUpdate.trim() === '') return
    
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`
    
    const newUpdateObj: Update = {
      id: updates.length + 1,
      time: timeString,
      content: newUpdate,
    }
    
    if (newImageUrl.trim() !== '') {
      newUpdateObj.imageUrl = newImageUrl
    }
    
    setUpdates([...updates, newUpdateObj])
    setNewUpdate('')
    setNewImageUrl('')
    setShowImageInput(false)
  }
  
  const incrementPointers = () => {
    setPointCount(prev => prev + 1)
    // Trigger mud splatter animation
    setShowSplatter(true)
    setButtonSplatter(true)
    setMudJiggle(true)
    
    // Play splatter sound
    if (splatterSoundRef.current) {
      splatterSoundRef.current.currentTime = 0;
      splatterSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    // Reset animations after they complete
    setTimeout(() => {
      setShowSplatter(false)
    }, 1000)
    setTimeout(() => {
      setButtonSplatter(false)
    }, 500)
    setTimeout(() => {
      setMudJiggle(false)
    }, 600)
  }
  
  const toggleRain = () => {
    setIsRaining(prev => !prev)
    if (!isRaining) {
      setMudMoisture(prev => Math.min(100, prev + 15))
    }
  }

  const toggleImageInput = () => {
    setShowImageInput(prev => !prev)
  }
  
  // Open modal with image carousel
  const openImageModal = (imageIndex: number) => {
    // Get all images from updates
    const allImages = updates
      .filter(update => update.imageUrl)
      .map(update => update.imageUrl as string)
    
    setCarouselImages(allImages)
    setCurrentImageIndex(imageIndex)
    setIsModalOpen(true)
  }
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
  }
  
  // Navigate carousel
  const navigateCarousel = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? carouselImages.length - 1 : prev - 1
      )
    } else {
      setCurrentImageIndex(prev => 
        prev === carouselImages.length - 1 ? 0 : prev + 1
      )
    }
  }
  
  // Handle keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      
      if (e.key === 'Escape') {
        closeModal()
      } else if (e.key === 'ArrowLeft') {
        navigateCarousel('prev')
      } else if (e.key === 'ArrowRight') {
        navigateCarousel('next')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, carouselImages.length])

  return (
    <div className={`app-container ${isRaining ? 'raining' : ''}`}>
      <h1 className="title">🌧️ Mud Pile Pointing Event 🌧️</h1>
      
      {/* Mud splatter animation */}
      {showSplatter && <div className="mud-splatter"></div>}
      
      {/* Mud pile */}
      <div className={`mud-pile ${mudJiggle ? 'jiggle' : ''}`}>
        <div className="mud-pile-top"></div>
        <div className="mud-pile-middle"></div>
        <div className="mud-pile-bottom"></div>
        {mudJiggle && <div className="mud-splash"></div>}
      </div>
      
      <div className="mud-status">
        <div className="status-item">
          <h2>Pointer Count</h2>
          <div className="status-value">{pointCount}</div>
          <button 
            onClick={incrementPointers}
            className={buttonSplatter ? 'splatter-button' : ''}
          >
            Someone New Pointed!
          </button>
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
          {updates.map((update) => {
            // Calculate the image index in the carousel
            const imageIndex = updates
              .filter(u => u.imageUrl)
              .findIndex(u => u.id === update.id)
            
            return (
              <div key={update.id} className="update-item">
                <div className="update-content-wrapper">
                  <div className="update-time">{update.time}</div>
                  <div className="update-content">{update.content}</div>
                </div>
                
                {update.imageUrl && (
                  <div 
                    className="update-thumbnail"
                    onClick={() => openImageModal(imageIndex)}
                  >
                    <img 
                      src={update.imageUrl} 
                      alt={`Update ${update.id}`} 
                      className="thumbnail-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/100x100?text=Error';
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="new-update">
          <div className="new-update-inputs">
            <input
              type="text"
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Enter a new mud pile update..."
              className="update-text-input"
            />
            <button 
              onClick={toggleImageInput} 
              className="toggle-image-btn"
              title={showImageInput ? "Hide image input" : "Add an image"}
            >
              {showImageInput ? "🖼️ ✕" : "🖼️ +"}
            </button>
          </div>
          
          {showImageInput && (
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL (optional)..."
              className="image-url-input"
            />
          )}
          
          <button onClick={addUpdate} className="post-update-btn">Post Update</button>
        </div>
      </div>
      
      {/* Image Modal with Carousel */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="carousel">
              <button 
                className="carousel-nav prev" 
                onClick={() => navigateCarousel('prev')}
                disabled={carouselImages.length <= 1}
              >
                &#10094;
              </button>
              
              <div className="carousel-image-container">
                <img 
                  src={carouselImages[currentImageIndex]} 
                  alt={`Carousel image ${currentImageIndex + 1}`}
                  className="carousel-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                  }}
                />
              </div>
              
              <button 
                className="carousel-nav next" 
                onClick={() => navigateCarousel('next')}
                disabled={carouselImages.length <= 1}
              >
                &#10095;
              </button>
            </div>
            
            {carouselImages.length > 1 && (
              <div className="carousel-counter">
                {currentImageIndex + 1} / {carouselImages.length}
              </div>
            )}
          </div>
        </div>
      )}
      
      <footer>
        <p> {new Date().getFullYear()} Mud Pile Pointing Society | All Rights Reserved</p>
        <p><small>Remember: Point, don't poke!</small></p>
      </footer>
    </div>
  )
}

export default App
