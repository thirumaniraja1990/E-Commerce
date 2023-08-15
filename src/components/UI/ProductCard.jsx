import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import useGetData from "../../custom-hooks/useGetData";

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const addToCart = async () => {
    if (JSON.parse(localStorage.getItem("user"))?.uid) {
      try {
        const docRef = await collection(db, "cart");

        await addDoc(docRef, {
          userID: JSON.parse(localStorage.getItem("user")).uid,
          productID: item.id,
        });

        toast.success("Product added to the Cart");
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
  const { data: cart, loading: isLoad } = useGetData("cart");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const navigateToCart = () => {
    navigate("/cart");
  };
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))?.uid) {
      const cartItems = cart.filter(
        (e) => e.userID === JSON.parse(localStorage.getItem("user"))?.uid
      );

      setCartItems([...cartItems]);
    }
  }, [cart]);
  const handleQuantityChange = (newQuantity, item) => {
    if (newQuantity >= 1) {
      dispatch(
        cartActions.addQuantity({
          id: item.id,
          quantity: newQuantity,
        })
      );
    }
  };

  const handleBlur = (e, item) => {
    const newQuantity =
      parseInt(e.target.value) ||
      cartItems.find((e) => e.id === item.id).quantity;

    handleQuantityChange(newQuantity, item);
  };
  const handleDelete = async (id) => {
    try {
      const cartQuery = query(
        collection(db, "cart"),
        where("productID", "==", id)
      );
      const querySnapshot = await getDocs(cartQuery);

      querySnapshot.forEach(async (queryDoc) => {
        const docRef = doc(db, "cart", queryDoc.id);
        await deleteDoc(docRef);
      });

      dispatch(cartActions.deleteItem(id));
      toast.error("Product removed from the Cart");
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };
  return (
    <Col lg="3" md="4" xs="6" className="mb-2">
      <div
        className={`product__item product-card ${
          cartItems.some((e) => e.productID === item.id) ? "withBackdrop" : ""
        }`}
      >
        <div className="product__img">
          <Link to={`/shop/${item.id}`}>
            {" "}
            <motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt="" />
          </Link>
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            {" "}
            <Link to={`/shop/${item.id}`}>
              {/* {item.productName.length > 13
                ? `${item.productName.substring(0, 13)}...`
                : item.productName} */}
              {item.productName}
            </Link>
          </h3>
          <span>{item.category}</span>
        </div>
        <div className="product__card-bottom d-flex align-items-center justify-content-between">
          <span className="price">{item.price}</span>
          {!cartItems.some((e) => e.productID === item.id) ? (
            <motion.span whileHover={{ scale: 1.2 }} onClick={addToCart}>
              <i className="ri-add-line"></i>
            </motion.span>
          ) : (
            <>
              <motion.span
                whileHover={{ scale: 1.2 }}
                className="shop-icon"
                onClick={navigateToCart}
              >
                <i class="ri-shopping-bag-2-line"></i>
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.2 }}
                className="delete-icon"
                onClick={() => handleDelete(item.id)}
              >
                <i class="ri-close-circle-fill"></i>
              </motion.span>
              {/* <div className="quantity-control text-center">
                <Button
                  color="danger"
                  className="quantity-button"
                  onClick={() =>
                    handleQuantityChange(
                      cartItems.find((e) => e.id === item.id).quantity - 1
                    )
                  }
                >
                  <i class="ri-subtract-line"></i>
                </Button>
                <InputGroup className="quantity-input">
                  <Input
                    type="number"
                    value={cartItems.find((e) => e.id === item.id)?.quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value))
                    }
                    onBlur={(e) => handleBlur(e, item)}
                  />
                </InputGroup>
                <Button
                  color="success"
                  className="quantity-button"
                  onClick={() =>
                    handleQuantityChange(
                      cartItems.find((e) => e.id === item.id)?.quantity + 1
                    )
                  }
                >
                  <i class="ri-add-line"></i>
                </Button>
              </div> */}
            </>
          )}
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
