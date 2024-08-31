import Hero from './Hero'
import Projects from './Projects'
import CommentForm from './CommentForm'
import Comments from './Comments'
import Footer from './Footer'
import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Warning, Error, Info, Success } from './Notifications'
import { PropTypes } from 'prop-types'

const MainContent = ({ loggedIn, setNotification, notification }) => {
  const [comments, setComments] = useState([])

  const environment = process.env.NODE_ENV
  var baseurl = ''
  if (environment == 'development') {
    baseurl = 'http://localhost:8000'
  }

  const getComments = async () => {
    const response = await fetch(`${baseurl}/api/get-comments`)
    const data = await response.json()
    setComments(data)
  }

  useEffect(() => {
    getComments()
  }, [])

  return (
    <div className='bg-base-200 w-screen'>
      {notification.type === 'warning' && <Warning message={notification.message} />}
      {notification.type === 'error' && <Error message={notification.message} />}
      {notification.type === 'success' && <Success message={notification.message} />}
      {notification.type === 'info' && <Info message={notification.message} />}
      <Hero />
      <Projects />
      <CommentForm getComments={getComments} setNotification={setNotification} />
      <Comments comments={comments} loggedIn={loggedIn} getComments={getComments} setNotification={setNotification} />
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  )
}

MainContent.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  setNotification: PropTypes.func.isRequired,
  notification: PropTypes.shape({
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired
}

export default MainContent
