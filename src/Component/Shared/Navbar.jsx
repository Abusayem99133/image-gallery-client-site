import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const navItem = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>

      <li>
        <Link>About</Link>
      </li>
      <li>
        <Link>Blog</Link>
      </li>
    </>
  );
  return (
    <div className="">
      <div className="navbar bg-black  text-white">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content rounded-box z-[10] mt-3 w-52 p-2 shadow bg-purple-700"
            >
              {navItem}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">MRS Gallery</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItem}</ul>
        </div>
        <div className="navbar-end">
          <Link to="/signIn">
            <a className="btn bg-purple-700 text-white">Join US</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
