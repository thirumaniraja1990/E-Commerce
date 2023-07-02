import React from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { toast } from 'react-toastify';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase.config";


const ProductCard = ({item}) => {

const dispatch = useDispatch()
const addToCart = async () => {
  if (JSON.parse(localStorage.getItem('user'))?.uid) {
    try {
      const docRef = await collection(db, "cart");
        
              await addDoc(docRef, {
                userID: JSON.parse(localStorage.getItem('user')).uid,
                productID: item.id,
              
              });
           
        
        toast.success('Product added to the Cart');
        
    } catch (error) {
      console.log(error);
    }
  } else {
    dispatch(
      cartActions.addItem({
        id: item.id,
        imgUrl: item.imgUrl,
        productName: item.productName,
        price: item.price,
      })
    );
    toast.success("Product added successfully");
  }
  
  
};


  return (
    <Col lg="3" md="4" className="mb-2" >
      <div className="product__item">
        <div className="product__img">
        <Link to={`/shop/${item.id}`}>  <motion.img whileHover={{scale : 0.9}} src={item.imgUrl} alt="" /></Link>
        </div>
        <div className="p-2 product__info">
        <h3 className="product__name"> <Link to={`/shop/${item.id}`}>{item.productName} </Link></h3>
        <span>{item.category}</span>
        </div>
        <div className="product__card-bottom d-flex align-items-center justify-content-between">
          <span className="price">{item.price}</span>
          <motion.span whileHover={{scale : 1.2}} onClick={addToCart}>
            <i className="ri-add-line"></i>
          </motion.span>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
