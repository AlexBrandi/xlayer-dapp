import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { wagmiConfig } from './lib/config'
import { Navigation } from './components/Navigation'
import { Dashboard } from './pages/Dashboard'
import { Mint } from './pages/Mint'
import { Market } from './pages/Market'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-900">
            <Navigation />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/market" element={<Market />} />
              </Routes>
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App