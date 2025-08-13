import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageSize, setImageSize] = useState('512x512')
  const [recentPrompts, setRecentPrompts] = useState([])
  const [generatedImages, setGeneratedImages] = useState([])

  // Load recent prompts and images from local storage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('recentPrompts')
    const savedImages = localStorage.getItem('generatedImages')
    if (savedPrompts) {
      setRecentPrompts(JSON.parse(savedPrompts))
    }
    if (savedImages) {
      setGeneratedImages(JSON.parse(savedImages))
    }
  }, [])

  // Save recent prompts and images to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('recentPrompts', JSON.stringify(recentPrompts))
  }, [recentPrompts])

  useEffect(() => {
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages))
  }, [generatedImages])

  const generateImage = () => {
    if (!prompt.trim()) return

    setLoading(true)
    
    // Parse the selected size
    const [width, height] = imageSize.split('x')
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt)
    
    // Create the URL with the prompt and size parameters
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}`
    
    // Set the image URL
    setImageUrl(url)
    
    // Add to recent prompts (keeping only the last 5)
    setRecentPrompts(prevPrompts => {
      const newPrompts = [prompt, ...prevPrompts.filter(p => p !== prompt)].slice(0, 5)
      return newPrompts
    })

    // Add to generated images (keeping only the last 8)
    setTimeout(() => {
      setGeneratedImages(prevImages => {
        const newImages = [{ url, prompt, timestamp: Date.now() }, ...prevImages].slice(0, 8)
        return newImages
      })
      setLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateImage()
    }
  }

  const downloadImage = () => {
    if (!imageUrl) return
    
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `ai-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const regenerateImage = () => {
    if (prompt) {
      generateImage()
    }
  }

  const surpriseMe = () => {
    const surprisePrompts = [
      'A magical forest with glowing mushrooms and fairies',
      'A futuristic city with flying cars and neon lights',
      'A cute cat wearing a wizard hat casting spells',
      'An underwater kingdom with mermaids and sea creatures',
      'A steampunk airship flying through clouds at sunset',
      'A cozy cabin in snowy mountains with northern lights',
      'A dragon sleeping on a pile of gold and treasures',
      'A peaceful Japanese garden with cherry blossoms',
      'A space station orbiting a colorful nebula',
      'A robot playing chess with an alien'
    ]
    
    const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)]
    setPrompt(randomPrompt)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 animate-gradient opacity-30 -z-10"></div>
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="particles-container"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">DreamMaker AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-primary-300 transition-colors duration-200">Home</a>
              <a href="#gallery" className="text-white hover:text-primary-300 transition-colors duration-200">Gallery</a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors duration-200">About</a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors duration-200">Contact</a>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 pb-2 animate-pulse-slow">
              Turn Your Ideas into Images
            </h1>
            <p className="mt-4 text-xl text-white text-opacity-90">
              Enter a prompt and watch AI bring your imagination to life
            </p>
          </div>

          <div className="mt-8 glass rounded-xl p-6 shadow-neon border border-white/20 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a prompt (e.g., 'cute cat wearing a hat')"
                  className="w-full px-4 py-3 bg-dark-800/50 text-white placeholder-white/70 border border-white/30 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 bg-dark-800/50 text-white border border-white/30 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="512x512">512×512</option>
                  <option value="768x768">768×768</option>
                  <option value="1024x1024">1024×1024</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generateImage}
                disabled={loading || !prompt.trim()}
                className="flex-grow px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-medium rounded-lg shadow-lg hover:shadow-neon hover:from-primary-500 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
              <button
                onClick={surpriseMe}
                className="flex-grow sm:flex-grow-0 px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white font-medium rounded-lg shadow-lg hover:shadow-neon hover:from-secondary-500 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
              >
                Surprise Me
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-12 flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-400"></div>
            </div>
          )}

          {imageUrl && !loading && (
            <div className="mt-12 glass rounded-xl p-6 shadow-neon border border-white/20 transition-all duration-500 animate-fade-in">
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                <img 
                  src={imageUrl} 
                  alt="Generated AI image" 
                  className="w-full h-full object-cover rounded-lg shadow-lg fade-in transform transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={downloadImage}
                  className="px-6 py-2 bg-gradient-to-r from-accent-600 to-accent-800 text-white font-medium rounded-lg shadow-lg hover:shadow-neon hover:from-accent-500 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={regenerateImage}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-medium rounded-lg shadow-lg hover:shadow-neon hover:from-primary-500 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          {/* Gallery Section */}
          {generatedImages.length > 0 && (
            <div id="gallery" className="mt-16 animate-fade-in">
              <h2 className="text-3xl font-bold text-white text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300">Your Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {generatedImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="glass rounded-lg overflow-hidden shadow-lg border border-white/20 transition-all duration-300 hover:shadow-neon transform hover:scale-105"
                  >
                    <div className="aspect-w-1 aspect-h-1">
                      <img 
                        src={image.url} 
                        alt={`Generated image: ${image.prompt}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-white text-sm truncate">{image.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Prompts */}
          {recentPrompts.length > 0 && (
            <div className="mt-12 glass rounded-xl p-6 shadow-lg border border-white/20 animate-fade-in">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Prompts</h2>
              <div className="flex flex-wrap gap-2">
                {recentPrompts.map((recentPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(recentPrompt)}
                    className="px-3 py-1 bg-dark-800/50 text-white text-sm rounded-full hover:bg-primary-800/50 hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    {recentPrompt.length > 30 ? recentPrompt.substring(0, 30) + '...' : recentPrompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-primary-900 via-secondary-900 to-primary-900 py-8 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">DreamMaker AI</span>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-white hover:text-primary-300 transition-colors duration-200">Home</a>
              <a href="#gallery" className="text-white hover:text-primary-300 transition-colors duration-200">Gallery</a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors duration-200">About</a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors duration-200">Contact</a>
            </div>
            <div>
              <p>&copy; {new Date().getFullYear()} DreamMaker AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
