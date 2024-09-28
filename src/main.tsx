import React from 'react'
import ReactDOM from 'react-dom/client'
import {router} from './App'
import { RouterProvider } from 'react-router-dom' 
import './index.css'

import DelyProvider from './context/DelyContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DelyProvider>
      <RouterProvider router={router} />
    </DelyProvider>
    
  </React.StrictMode>,
)
