import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'
import { TaskHistoryProvider } from '@/context/TaskHistoryContext'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskHistoryProvider>
      <App />
    </TaskHistoryProvider>
  </StrictMode>,
)
