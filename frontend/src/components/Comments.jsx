import Comment from "./Comment"

const Comments = ({comments, loggedIn, getComments}) => {
    return (
        <div className='container mx-auto px-4 max-w-2xl flex justify-left flex-wrap pt-6 pb-40'>
            <div className="carousel carousel-center rounded-box">
            {comments.length != 0 ? comments.map((commentProps, index) => (
                <Comment key={index} {...commentProps} index={index} loggedIn={loggedIn} getComments={getComments}/>
            ))
        : (<div className="hidden"></div>)}
            </div>
        </div>
    )
}

export default Comments