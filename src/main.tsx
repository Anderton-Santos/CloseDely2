import React from 'react'
import ReactDOM from 'react-dom/client'
import {router} from './App'
import { RouterProvider } from 'react-router-dom' 
import './index.css'

import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'

import DelyProvider from './context/DelyContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DelyProvider>
      <ToastContainer autoClose={1500}/>
      <RouterProvider router={router} />
    </DelyProvider>
    
  </React.StrictMode>,
)
