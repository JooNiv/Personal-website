import { PropTypes } from 'prop-types'

const Comment = ({ comment, username, id, loggedIn, getComments, setNotification }) => {
  const environment = process.env.NODE_ENV
  var baseurl = ''
  if (environment == 'development') {
    baseurl = 'http://localhost:8000'
  }

  const handleClick = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('User not authenticated')
      return
    }

    try {
      await fetch(`${baseurl}/api/delete-comment/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setTimeout(() => {
        setNotification({ type: '', message: '' })
      }, 5000)
      setNotification({ type: 'success', message: 'Comment deleted successfully.' })

      getComments()
    } catch (error) {
      setTimeout(() => {
        setNotification({ type: '', message: '' })
      }, 5000)
      setNotification({ type: 'error', message: 'Deleting comment failed.' })
      //console.error('Error:', error);
    }
  }

  return (
    <div className='card carousel-item mr-2 bg-base-100 w-96 max-w-full shadow-xl'>
      <div className='card-body'>
        <p>&quot;{comment}&quot;</p>
        <div className='card-actions justify-start'>
          <h2 className='card-title'>-{username}</h2>
        </div>
        {loggedIn ? (
          <div className='card-actions justify-end'>
            <button onClick={handleClick} className='btn btn-primary'>
              Delete
            </button>
          </div>
        ) : (
          <div className='hidden'></div>
        )}
      </div>
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  getComments: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired
}

export default Comment
