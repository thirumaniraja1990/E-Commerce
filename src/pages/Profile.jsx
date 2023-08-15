import React, { useEffect, useState } from "react";
import { Container, Row, Col, Input } from 'reactstrap';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import useGetData from '../custom-hooks/useGetData';
import './../styles/profile.css';

const Profile = () => {
  const { data: userData, loading } = useGetData("users");
  const [myProfile, setMyProfile] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (userData) {
      const loggedInUserId = JSON.parse(localStorage.getItem("user")).uid;
      const userProfile = userData.find(user => user.uid === loggedInUserId);
      setMyProfile(userProfile);
    }
  }, [userData]);

  const handleDeleteAccount = async () => {
    try {
      await deleteDoc(doc(db, 'users', myProfile.uid));
      toast.success('Account deleted successfully');
    } catch (error) {
      console.log('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };
  const handleUpdatePassword = async () => {
    try {
      // Update the password in the user document
     // await updateDoc(doc(db, 'users', myProfile.uid), { password: newPassword });

      // Show success message
      toast.success('Password updated successfully');
    } catch (error) {
      console.log('Error updating password:', error);
      // Show error message
      toast.error('Failed to update password');
    }
  };

  return (
    <>
      <Helmet title={"Shop"}></Helmet>
      <CommonSection title="Profile" />
      <div className="profile-container">
        {loading ? (
          <h5>Loading...</h5>
        ) : (
          <Container>
            <Row>
              <Col lg='6'>
                <img src={myProfile?.photoURL} alt="Profile" className="profile-image" />
              </Col>
              <Col lg='6' className='profile-details'>

                <div>  <h3 className="profile-name mt-3">User Name : {myProfile?.displayName}</h3></div>
                <div><h3 className="profile-email mt-3">User Email : {myProfile?.email}</h3></div>
                <h5 className="mt-5">New Password : </h5>
                <Input type="password" className="profile-input mt-3 " placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button className='btn btn-primary profile-update-btn mt-5 p-2 m-3' onClick={handleUpdatePassword}>
                  Update Password
                </button>
                <button className='btn btn-danger profile-delete-btn mt-5 p-2 m-3' onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default Profile;
