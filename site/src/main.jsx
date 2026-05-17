import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: '#f59e0b', fontFamily: 'monospace', background: '#0a0a0a', minHeight: '100vh' }}>
          <h2 style={{ marginBottom: '1rem' }}>Runtime Error</h2>
          <pre style={{ color: '#ef4444', whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{String(this.state.error)}</pre>
          <pre style={{ color: '#6b7280', whiteSpace: 'pre-wrap', fontSize: '0.75rem', marginTop: '1rem' }}>{this.state.error?.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HashRouter>
  </React.StrictMode>,
)
