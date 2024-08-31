import { useState, useRef } from 'react'
import './styles/App.css'
import MainContent from './components/MainContent'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AdminLoginModal from './components/AdminLogin'

function App() {
  const drawerRef = useRef()
  const [loggedIn, setLoggedIn] = useState(false)
  const [notification, setNotification] = useState({
    type: '', //info, success, warning, error
    message: ''
  })

  return (
    <div className='drawer'>
      <input ref={drawerRef} id='my-drawer-3' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col bg-base-300'>
        <Navbar />
        <MainContent loggedIn={loggedIn} setNotification={setNotification} notification={notification} />
        <AdminLoginModal loggedIn={loggedIn} setLoggedIn={setLoggedIn} setNotification={setNotification} />
      </div>
      <Sidebar drawerRef={drawerRef} />
    </div>
  )
}

export default App
