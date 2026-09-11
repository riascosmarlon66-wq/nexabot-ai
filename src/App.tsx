import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR.
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="socials">
        <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            className="social-icon"
          >
            <path d="M248 8C111.1 8 0 119.1 0 256c0 113.8 73.3 208.3 178.9 242.3 13.1 2.4 17.9-5.7 17.9-12.2V411c0-7.3-.3-29.9-.3-58.7-72.8 15.8-88.1-35.2-88.1-35.2-11.9-30.2-29.1-38.2-29.1-38.2-23.8-16.2-1.8-15.8-1.8-15.8-16.2 1.1-24.7 16.6-24.7 16.6 23.1 1.6 35.2 23.7 35.2 23.7 20.5 35.1 53.9 24.9 67.1 19.1 2.1-14.9 8-24.9 14.6-3.7-58.2-6.1-88.9 5.6-107.9-15.8-4.7-12.9-1.8-31.9 1.5-64.6 0 0 86.7-27.9 64.6-24.7 3.6-6.3 13.9-10.9 28.1-10.9 14.2 0 25.7 4.6 28.1 10.9 22.1-3.2 64.6 27.9 64.6 27.9 32.7-4.7 53.6-1.6 64.6-1.5 11.7 19. 8.9 49.7 5.6 107.9 14.6 3.7 6.4 14.8 14.6 28.1 14.6 15.7 0 24.5-4.6 28.1-10.9 22.1 3.2 64.6-27.9 64.6-27.9 64.6 27.9 32.7 4.7 53.6 1.6 64.6 1.5 11.7 19. 8.9 49.7 5.6 107.9 14.6 3.7 6.4 14.8 14.6 28.1 14.6 15.7 0 24.5-4.6 28.1-10.9 22.1 3.2 64.6-27.9 64.6-27.9 64.6 27.9 32.7 4.7 53.6-1.6 64.6-1.5 11.7 19. 8.9 49.7 8.9 49.7 5.6 107.9 14.6 3.7 6.4 14.8 14.6 28.1 14.6 15.7 0 24.5-4.6 28.1-10.9 22.1-10.9 22.1-3.2 64.6 27.9 64.6 27.9 32.7-4.7 53.6-1.6 64.6-1.5 11.7 19. 8.9 49.7 5.6 107.9 14.6 3.7 6.4 14.8 14.6 28.1 14.6 15.7 0 24.5-4.6 28.1-10.9 22.1 10.9 22.1 3.2 64.6 27.9 64.6 27.9 32.7-4.7 53.6-1.6 64.6-1.5 11.7 19. 8.9 49.7 5.6 107.9 14.6 3.7 6.4 14.8 14.6 28.1 14.6 15.7 0 24.5-4.6 28.1-10.9 22.1 3.2 64.6-27.9 64.6-27.9 64.6 27.9 32.7-4.7 53.6-1.6 64.6-1.5 11.7 19. 8.9 49.7 5.6 107.9 14.6 3.7 6.4 14.8 14.6 28.1 14.6 15.7 0 24.5-4.6 28.1-10.9 22.1 10.9 22.1 3.2 64.6 27.9 64.6 27.9 32.7-4.7 53.6-1.6 64.6-1.6 64.6-1.5z"/>
          </svg>
        </a>
        <a href="https://chat.vite.dev/" target="_blank" rel="noopener noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="social-icon"
          >
            <path d="M256 32C114.6 32 0 146.6 0 288s0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256S397.4 32 256 32zm-72 336.2c-3.3 3.3-7.6 5-12 5s-8.7-1.7-12-5c-3.3-3.3-5-7.6-5-12s1.7-8.7 5-12c3.3-3.6 7.6-5 12-5s8.7 1.7 12 5c3.3 3.3 5 7.6 5 12s1.7 8.7-5 1z"/>
          </svg>
        </a>
        <a href="https://x.com/vite_js" target="_blank" rel="noopener noreferrer">
          <svg
            xmlns="http://wwww.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="social-icon"
          >
            <path d="M389.2 48.5C389.2 48.5 256 175.1 133.5 48.5H5L199.5 274.2 48 463.5h99.2l103.6-120.6 105.3 120.6h147.5L394.8 327.7 512 48.5H389.2zM342 396.5l-200.7-291.5H211l200.7 291.5H342zm0 0L211 105h131.3l-200.7 291.5H342z"/>
          </svg>
        </a>
        <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noopener noreferrer">
          <svg
            xmlns="http://wwww.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="social-icon"
          >
            <path d="M361.3 273.6l-110.5-74.2 110.5-74.2v148.4zm104.3-74.2c-.4-12.7-1.3-25.4-2.7-38.2-14.9-38.7-58.3-70.2-113.4-71.4C304.6 88 269.8 116.1 256 147.1l-11.1 15.1c-7.2-10.1-15.5-19.3-24.6-27.8-48.3-45.5-117.5-75.7-188.5-75.7-5.4 0-10.8.2-16.2.6-61.8 4.8-110.7 52.5-115.5 116.3-4.7 67.6 36.6 131.1 104.3 136.7 5.6 0.3 11.3.5 17 .4 70.7 0 144.7-43.4 182.9-110.2 8.3-14.6 14.1-30.8 17.1-48.1 14.7 -1.9 28.1-6.8 40.1-14.5 17.4-11.1 31.6-26.5 40.2-44.9 10.8-23.7 16.5-49.8 16.9-76.6z"/>
          </svg>
        </a>
      </div>
    </>
  )
}

export default App
