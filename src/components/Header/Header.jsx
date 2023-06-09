import React, { useRef, useEffect } from "react";
import "./header.css";
import { Container, Row } from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Logo-Latest.jpeg";
import userIcon from "../../assets/images/user-icon.png";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useAuth from "../../custom-hooks/useAuth";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";

const nav__links = [
  {
    path: "home",
    display: "Home",
  },
  {
    path: "shop",
    display: "Shop",
  },
  {
    path: "cart",
    display: "Cart",
  },
  {
    path: "order",
    display: "Order",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const profileActionRef = useRef(null);
  const isAdmin = JSON.parse(localStorage.getItem('user'))?.isAdmin
  // const stickyHeaderFunc = () => {
  //   window.addEventListener("scroll", () => {
  //     if (
  //       (document.body.scrollTop > 80 ||
  //       document.documentElement.scrollTop > 80)
  //     ) {
  //         headerRef.current.className += " sticky__header";
  //     } else {
  //         // headerRef.current.className = headerRef?.current?.className.replace(" sticky__header", "");
  //     }
  //   });
  // };

  const logout = () => {
    signOut(auth).then(()=>{
      localStorage.clear()
      toast.success("Logged out")
      navigate('/home')
    }).catch(err=>{
toast.error(err.message)
    })
  }

  // useEffect(() => {
  //   stickyHeaderFunc();
  //   return () => window.removeEventListener("scroll", stickyHeaderFunc);
  // });

  const menuToggle = () => {
    if (menuRef.current.className == 'active__menu') {
      menuRef.current.className = profileActionRef?.current?.className.replace(" active__menu", "");
    } else {
      menuRef.current.className += " active__menu";
    }
  }

  const navigateToCart = () => {
    navigate("/cart");
  };

  const toggleProfileActions = () => {
    if (profileActionRef.current.className.includes('show__profileActions')) {
      profileActionRef.current.className = profileActionRef?.current?.className.replace(" show__profileActions", "");
    } else {
      profileActionRef.current.className += " show__profileActions";
    }
  }
  
  return (
    <header className="header sticky__header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div>
                <h1>MSM Angadi </h1>
              </div>
            </div>

            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
                {/* <li className="nav__item">
                  <NavLink to="home">Home</NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="home">Shop</NavLink>
                </li>
                <li className="nav__item">
                  <NavLink to="home">Cart</NavLink>
                </li> */}
              </ul>
            </div>

            <div className="nav__icons">
             

              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-bag-line"></i>
                {/* <span className="badge">{totalQuantity}</span> */}
              </span>

              <div className="profile">
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  onClick={toggleProfileActions}
                />
                <div
                  className="profile__actions"
                  ref={profileActionRef}
                >
                  {currentUser ? (
                    <>
                    <div style={{display: 'grid'}}>
                    {isAdmin &&  <span><Link to="/dashboard">Dashboard</Link></span>}
                    <span><Link to="/profile">Profile</Link></span>
                    <span onClick={logout}>Logout</span>
                    </div>
                    
                    </>
                  ) : (
                    <div className=" d-flex align-items-center justify-content-center flex-column">
                      <Link to="/signup">Signup</Link>
                      <Link to="/login">Login</Link>
                      {isAdmin &&    <Link to="/dashboard">Dashboard</Link>}
                    </div>
                  )}
                </div>
              </div>

              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>{" "}
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
