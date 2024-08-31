import { PropTypes } from 'prop-types'

const Project = ({ title, description, link, image_path }) => {
  return (
    <div className='card card-compact bg-base-100 w-80 shadow-xl m-1 mb-10'>
      <figure className='block border-[14px] rounded-[23px] border-base-100'>
        <img src={image_path} alt='Circuit Knitting on FiQCI' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{title}</h2>
        <p>{description}</p>
        <div className='card-actions justify-end'>
          <a href={link}>
            <button className='btn btn-primary'>Read More</button>
          </a>
        </div>
      </div>
    </div>
  )
}

Project.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  image_path: PropTypes.string.isRequired
}

export default Project
