import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from '../pages/SIgnup'
import Login from "../pages/Login"
import Dashboard from '../pages/Dashboard'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, auth } from '../config/firebase'
import CreatePitch from '../componets/CreatePitch'

function Router() {
  const [isuser, setisuser] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setisuser(true)
        console.log(user.uid)
      } else {
        setisuser(false)
        console.log('user nahi hai')
      }
    });
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={isuser ? <Dashboard /> : <Signup />} />
        <Route path='/login' element={isuser ? <Dashboard /> : <Login />} />
        <Route path='/dashboard' element={isuser ? <Dashboard /> : <Signup />} />
        <Route path='/create-pitch' element={isuser ? <CreatePitch/> : <Signup />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
