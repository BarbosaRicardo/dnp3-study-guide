import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Intro from './pages/Intro'
import Layers from './pages/Layers'
import DataLink from './pages/DataLink'
import AppLayer from './pages/AppLayer'
import Objects from './pages/Objects'
import FunctionCodes from './pages/FunctionCodes'
import Unsolicited from './pages/Unsolicited'
import Security from './pages/Security'
import Troubleshoot from './pages/Troubleshoot'
import Lab from './pages/Lab'

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/intro"        element={<Intro />} />
          <Route path="/layers"       element={<Layers />} />
          <Route path="/datalink"     element={<DataLink />} />
          <Route path="/appLayer"     element={<AppLayer />} />
          <Route path="/objects"      element={<Objects />} />
          <Route path="/fc"           element={<FunctionCodes />} />
          <Route path="/unsol"        element={<Unsolicited />} />
          <Route path="/security"     element={<Security />} />
          <Route path="/troubleshoot" element={<Troubleshoot />} />
          <Route path="/lab"          element={<Lab />} />
        </Routes>
      </main>
    </div>
  )
}
