import React from "react";
import "../styles/thankyou.css";
import { Button, ButtonDropdown } from "reactstrap";
import thankyouImage from "../assets/images/thankyou.png";
import { useNavigate } from "react-router-dom";
function Thankyou(props) {
  const navigate = useNavigate();
  const handleTrackOrder = () => {
    navigate("/order");
  };

  const handleContinueShopping = () => {
    navigate("/home");
  };

  return (
    <div className='thankyou-container'>
      <div className='thankyou'>
        <img src={thankyouImage} alt='Thank You' width='200' height='500' />
        <h1>Thank you, Enjoy Shopping!</h1>
        <button className='track-order-button' onClick={handleTrackOrder}>
          Track Order
        </button>
        <button
          className='continue-shopping-button'
          onClick={handleContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Thankyou;
