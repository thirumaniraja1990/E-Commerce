import React, { useRef } from 'react'
import { Container,Row,Col } from 'reactstrap'
import useAuth from '../custom-hooks/useAuth'
import '../styles/admin-nav.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.config'
import { toast } from 'react-toastify'
import { motion } from "framer-motion";
import userIcon from "../assets/images/user-icon.png";

const admin__nav = [
    {
        display : 'Dashboard',
        path : '/dashboard'
    },
    {
        display : 'Add-Products',
        path : '/dashboard/add-product'
    },
    {
        display : 'Add-Category',
        path : '/dashboard/add-category'
    },
    {
        display : 'All-Products',
        path : '/dashboard/all-products'
    },
    {
        display : 'Orders',
        path : '/dashboard/orders'
    },
    {
        display : 'Users',
        path : '/dashboard/users'
    },
]

const AdminNav = () => {

    const {currentUser} = useAuth()
    const profileActionRef = useRef(null);
    const isAdmin = JSON.parse(localStorage.getItem('user'))?.isAdmin
    const navigate = useNavigate();
    const logout = () => {
        signOut(auth).then(()=>{
          localStorage.clear()
          toast.success("Logged out")
          navigate('/home')
        }).catch(err=>{
    toast.error(err.message)
        })
      }
      const toggleProfileActions = () => {
        console.log(profileActionRef.current?.className);
        if (profileActionRef.current?.className.includes('show__profileActions')) {
          profileActionRef.current.className = profileActionRef?.current?.className.replace(" show__profileActions", "");
        } else {
          profileActionRef.current.className += " show__profileActions";
        }
      }
  return (
  <>
  <header className='admin__header'>
    <div className="admin__nav-top">
        <Container>
            <div className="admin__nav-wrapper-top">
                <div className="logo">
                    <h2>MSM Angadi</h2>
                </div>
                <div className="search__box">
                    <input type="text" placeholder='Search....' />
                    <span><i className="ri-search-line"></i></span>
                </div>
                <div className="admin__nav-top-right">
                   
                    <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  onClick={toggleProfileActions}
                />
                    <span><Link to="/home"><i class="ri-home-4-fill"></i></Link></span>
                </div>
                <div
                  className="profile__actions"
                  ref={profileActionRef}
                >
                  {currentUser ? (
                    <>
                    <div style={{display: 'grid'}}>
                    <span><Link to="/home">Home</Link></span>
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
        </Container>
    </div>
  </header>
<section className="admin__menu p-0">
    <Container>
        <Row>
            <div className="admin__navigation">
                <ul className="admin__menu-list">
                    {
                        admin__nav.map((item,index)=>(
                            <li className="admin__menu-item" key={index}>
                                <NavLink to={item.path} className={navClass => navClass.isActive ?
                                'active__admin-menu' : '' } >{item.display}</NavLink>
                            </li>
                     ))
                    }
                </ul>
            </div>
        </Row>
    </Container>
</section>


  </>
  )
}

export default AdminNav