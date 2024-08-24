import { useState, useRef, useEffect } from 'react';
import './styles/App.css';
import Hero from './components/Hero';
import CommentForm from './components/CommentForm';
import Footer from './components/Footer';
import Comments from './components/Comments';
import Projects from './components/Projects';

function App() {
  const drawerRef = useRef();
  const closeLoginRef = useRef();

  const [comments, setComments] = useState([])
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [loggedIn, setLoggedIn] = useState(false)

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const handleAdminSidebarClick = () => {
    handleMenuClick()
    document.getElementById('my_modal_5').showModal()
  }

  const handleChange = (e) => {
    setLoginData({
        ...loginData,
        [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    handleCloseClick()
    try {
      const response = await fetch('http://localhost:8000/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'username': loginData.username,
          'password': loginData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setLoggedIn(true)
      alert('Login successful!');
      // Redirect to the admin dashboard or update the state
    } catch (err) {
      alert('Login unsuccessful!');
    }
  };

  const getComments = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/get-comments')
    const data = await response.json()
    setComments(data)
  }

  useEffect(() => {
    getComments()
  }, []); // Empty array means this effect runs only once

  const handleMenuClick = () => {
    if(typeof drawerRef.current === 'undefined') return;
    drawerRef.current.click();
  };

  const handleCloseClick = () => {
    if(typeof closeLoginRef.current === 'undefined') return;
    closeLoginRef.current.click();
  }; 

  return (
    <div className="drawer">
      <input ref={drawerRef} id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-300">
        <div className="navbar flex justify-between mx-auto bg-base-300 max-w-2xl">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
            <div className="hidden lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#comment">Comment</a></li>
              </ul>
            </div>

            <div className="hidden lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <li><a onClick={()=>document.getElementById('my_modal_5').showModal()} href="#about">Admin</a></li>
              </ul>
            </div>
        </div>

        <div className="bg-base-200 w-screen">
          <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              {!loggedIn ? (<div>
                <h3 className="font-bold text-lg">Login as Admin</h3>
              <form className='py-5 w-full'>
              <div className="w-full h-fit">
                <div className="h-full">
                  <label htmlFor="comment" className="">
                    Username
                  </label>
                  <div className="mt-2 w-full h-1/2">
                    <input
                      onChange={handleChange}
                      value={loginData.username}
                      placeholder='Username'
                      name="username"
                      className="p-3 block w-full h-full bg-base-100 rounded-md border-0 py-1.5 shadow-sm placeholder:text-gray ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-white-100 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <br></br>
              <div className="mt-0">
                <div className="">
                  <label htmlFor="name" className="">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleChange}
                      value={loginData.password}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      placeholder='**********'
                      className="p-3 block w-full h-full bg-base-100 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            <div className="mt-6 flex items-center justify-left gap-x-6">
              <button
                onClick={handleLogin}
                type="submit"
                className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
              </div>) : (<div>
                <h3 className="font-bold text-lg">Already logged in</h3>
              </div>)}
              
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button ref={closeLoginRef} className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
          <Hero />
          <Projects />
          <CommentForm getComments={getComments} />
          <Comments comments={comments} loggedIn={loggedIn} getComments={getComments}/>
          <Footer />
        </div>

      </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className='menu flex flex-col justify-between bg-base-200 min-h-full w-80 p-4'>
            <ul className="">
              <li><a onClick={handleMenuClick} href="#about">About</a></li>
              <li><a onClick={handleMenuClick} href="#projects">Projects</a></li>
              <li><a onClick={handleMenuClick} href="#comment">Comment</a></li>
            </ul>
            <ul className="">
              <li><a onClick={handleAdminSidebarClick}>Admin</a></li>
            </ul>
          </div>
          
        </div>
    </div>
    
  );
}

export default App;
