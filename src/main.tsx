import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SermonPage } from './components/SermonPage.tsx'
import { AdminLogin } from './components/AdminLogin.tsx'
import { AddSermon } from './components/AddSermon.tsx'
import { EditSermon } from './components/EditSermon.tsx'
import { AdminDashboard } from './components/AdminDashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sermon/:id" element={<SermonPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/add-sermon" element={<AddSermon />} />
        <Route path="/admin/edit-sermon/:id" element={<EditSermon />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)


