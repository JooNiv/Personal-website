import Comment from './Comment'
import { PropTypes } from 'prop-types'

const Comments = ({ comments, loggedIn, getComments, setNotification }) => {
  return (
    <div className='container mx-auto px-4 max-w-2xl flex justify-left flex-wrap pt-6 pb-10'>
      <div className='carousel carousel-center rounded-box'>
        {comments.length != 0 ? (
          comments.map((commentProps, index) => (
            <Comment
              key={index}
              {...commentProps}
              index={index}
              loggedIn={loggedIn}
              getComments={getComments}
              setNotification={setNotification}
            />
          ))
        ) : (
          <div className='hidden'></div>
        )}
      </div>
    </div>
  )
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      comment: PropTypes.string,
      username: PropTypes.string,
      id: PropTypes.number
    })
  ).isRequired,
  loggedIn: PropTypes.bool.isRequired,
  getComments: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired
}

export default Comments
