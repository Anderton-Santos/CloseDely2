import { createBrowserRouter } from "react-router-dom" 

import {Home} from './pages/home'
import {Login} from './pages/login'
import {Input} from './pages/input'
import { Whatsapp } from "./pages/whatsapp"
import { App } from "./pages/app"
import { Register } from "./pages/register"
import { Todos} from './pages/todos'

import { Private } from "./routes/private"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },

  {
    path: '/home',
    element: <Private><Home/></Private>
  },

  {
    path: '/input',
    element: <Private><Input/></Private>
  },
  {
    path: '/wpp',
    element: <Private><Whatsapp/></Private>
  },
  {
    path: '/app',
    element: <Private><App/></Private>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/todos',
    element: <Private><Todos/></Private>
  }
])

export {router}