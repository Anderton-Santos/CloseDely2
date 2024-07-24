import { createBrowserRouter } from "react-router-dom" 

import {Home} from './pages/home'
import {Login} from './pages/login'
import {Input} from './pages/input'
import { Whatsapp } from "./pages/whatsapp"
import { App } from "./pages/app"
import { Register } from "./pages/register"
import { Todos} from './pages/todos'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },

  {
    path: '/home',
    element: <Home/>
  },

  {
    path: '/input',
    element: <Input/>
  },
  {
    path: '/wpp',
    element: <Whatsapp/>
  },
  {
    path: '/app',
    element: <App/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/todos',
    element: <Todos/>
  }
])

export {router}