import { PropTypes } from 'prop-types'

const Sidebar = ({ drawerRef }) => {
  const handleMenuClick = () => {
    if (typeof drawerRef.current === 'undefined') return
    drawerRef.current.click()
  }

  const handleAdminSidebarClick = () => {
    handleMenuClick()
    document.getElementById('my_modal_5').showModal()
  }

  return (
    <div className='drawer-side'>
      <label htmlFor='my-drawer-3' aria-label='close sidebar' className='drawer-overlay'></label>
      <div className='menu flex flex-col justify-between bg-base-200 min-h-full w-80 p-4'>
        <ul>
          <li>
            <a onClick={handleMenuClick} href='#about'>
              About
            </a>
          </li>
          <li>
            <a onClick={handleMenuClick} href='#projects'>
              Projects
            </a>
          </li>
          <li>
            <a onClick={handleMenuClick} href='#comment'>
              Comment
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <a onClick={handleAdminSidebarClick}>Admin</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  drawerRef: PropTypes.shape({
    current: PropTypes.shape({
      click: PropTypes.func.isRequired
    })
  }).isRequired
}

export default Sidebar
