import { useState, useEffect } from 'react'
import AdminPortal from './components/AdminPortal'

function App() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      setScale(Math.min(window.innerWidth / 1440, window.innerHeight / 900))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#060708',
      overflow: 'hidden',
    }}>
      <div style={{
        width: 1440,
        height: 900,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        flexShrink: 0,
      }}>
        <AdminPortal />
      </div>
    </div>
  )
}

export default App
