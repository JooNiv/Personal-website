const Navbar = () => {
  return (
    <div className='navbar flex justify-between mx-auto bg-base-300 max-w-2xl'>
      <div className='flex-none lg:hidden'>
        <label htmlFor='my-drawer-3' aria-label='open sidebar' className='btn btn-square btn-ghost'>
          <svg fill='none' viewBox='0 0 24 24' className='inline-block h-6 w-6 stroke-current'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
          </svg>
        </label>
      </div>
      <div className='hidden lg:block'>
        <ul className='menu menu-horizontal'>
          <li>
            <a href='#about'>About</a>
          </li>
          <li>
            <a href='#projects'>Projects</a>
          </li>
          <li>
            <a href='#comment'>Comment</a>
          </li>
        </ul>
      </div>
      <div className='hidden lg:block'>
        <ul className='menu menu-horizontal'>
          <li>
            <a onClick={() => document.getElementById('my_modal_5').showModal()}>Admin</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
