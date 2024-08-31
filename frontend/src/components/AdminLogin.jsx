import { useState, useRef } from 'react'
import { PropTypes } from 'prop-types'

const AdminLoginModal = ({ loggedIn, setLoggedIn, setNotification }) => {
  const closeLoginRef = useRef()
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

  const environment = process.env.NODE_ENV
  var baseurl = ''
  if (environment == 'development') {
    baseurl = 'http://localhost:8000'
  }

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleCloseClick = () => {
    if (typeof closeLoginRef.current === 'undefined') return
    closeLoginRef.current.click()
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loginData.username != '' && loginData.password != '') {
      try {
        const response = await fetch(`${baseurl}/api/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            username: loginData.username,
            password: loginData.password
          })
        })

        if (!response.ok) {
          throw new Error('Invalid login credentials')
        }

        const data = await response.json()
        localStorage.setItem('token', data.access_token)
        setLoggedIn(true)
        setTimeout(() => {
          setNotification({ type: '', message: '' })
        }, 5000)
        setNotification({ type: 'success', message: 'Login successful!' })
        handleCloseClick()
        //alert('Login successful!');
        // Redirect to the admin dashboard or update the state
      } catch (err) {
        //console.log(err)
        setTimeout(() => {
          setNotification({ type: '', message: '' })
        }, 5000)
        setNotification({ type: 'error', message: 'Login unsuccessful!' })
        //alert('Login unsuccessful!');
      }
    } else {
      setTimeout(() => {
        setNotification({ type: '', message: '' })
      }, 5000)
      setNotification({ type: 'warning', message: 'Enter password and username.' })
    }
  }

  return (
    <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
      <div className='modal-box'>
        {!loggedIn ? (
          <div>
            <h3 className='font-bold text-lg'>Login as Admin</h3>
            <form className='py-5 w-full'>
              <div className='w-full h-fit'>
                <div className='h-full'>
                  <label htmlFor='comment'>Username</label>
                  <div className='mt-2 w-full h-1/2'>
                    <input
                      onChange={handleChange}
                      value={loginData.username}
                      placeholder='Username'
                      name='username'
                      className='p-3 block w-full h-full bg-base-100 rounded-md border-0 py-1.5 shadow-sm placeholder:text-gray ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-white-100 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className='mt-0'>
                <div>
                  <label htmlFor='name'>Password</label>
                  <div className='mt-2'>
                    <input
                      onChange={handleChange}
                      value={loginData.password}
                      id='password'
                      name='password'
                      type='password'
                      autoComplete='password'
                      placeholder='**********'
                      className='p-3 block w-full h-full bg-base-100 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
              </div>
              <div className='mt-6 flex items-center justify-left gap-x-6'>
                <button onClick={handleLogin} type='submit' className='btn btn-primary'>
                  Login
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h3 className='font-bold text-lg'>Already logged in</h3>
          </div>
        )}
        <div className='modal-action'>
          <form method='dialog'>
            <button ref={closeLoginRef} className='btn'>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

AdminLoginModal.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired
}

export default AdminLoginModal
