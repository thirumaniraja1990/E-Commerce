import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import {
  addDocument,
  getDocuments,
  updateDocument,
} from "../../custom-hooks/crud";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const isAuthenticated = !!JSON.parse(localStorage.getItem("user"))?.uid;
  const addToCart = async () => {
    if (isAuthenticated) {
      try {
        const docRef = await collection(db, "cart");

        await addDoc(docRef, {
          userId: JSON.parse(localStorage.getItem("user")).uid,
          productID: item.id,
          quantity: 1,
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
  // const getCartItems = async () => {
  //   const response = await getDocuments("cart");
  //   setCart(response);
  // };
  // useEffect(() => {
  //   getCartItems();
  // }, []);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { cartItems: reduxCartItems } = useSelector((state) => state.cart);
  const navigateToCart = () => {
    navigate("/cart");
  };
  useEffect(() => {
    if (isAuthenticated) {
      console.log("cart", cart);
      const cartProducts = cart.filter(
        (e) => e.userId === JSON.parse(localStorage.getItem("user"))?.uid
      );
      setCartItems([...cartProducts]);
    } else {
      setCartItems([...reduxCartItems]);
    }
    console.log("reduxCartItems", reduxCartItems);
  }, [cart, reduxCartItems]);
  const handleQuantityChange = (newQuantity, item) => {
    if (newQuantity >= 1) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.uid) {
        updateCartInFirebase(user.uid, item.id, newQuantity);
      } else {
        dispatch(
          cartActions.addQuantity({ id: item.id, quantity: newQuantity })
        );
      }
    } else {
      handleDelete(item.id);
    }
  };
  const updateCartInFirebase = async (userId, itemId, newQuantity) => {
    const cartItems = await getDocuments("cart");
    const cartItem = cartItems.find(
      (item) => item.userId === userId && item.productID === itemId
    );
    if (cartItem) {
      const updatedCartData = { ...cartItem, quantity: newQuantity };
      const updated = await updateDocument(
        "cart",
        cartItem.id,
        updatedCartData
      );
      return updated; // Return a boolean indicating success or failure
    } else {
      const newCartItem = {
        userId: userId,
        productID: itemId,
        quantity: 1,
      };
      const inserted = await addDocument("cart", newCartItem);
      return inserted;
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
        where("productID", "==", id),
        where("userId", "==", JSON.parse(localStorage.getItem("user"))?.uid)
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
    <Col className='mb-2'>
      <div
        className={`product__item product-card ${
          (
            isAuthenticated
              ? cartItems.some((e) => e.productID === item.id)
              : cartItems.some((e) => e.id === item.id)
          )
            ? "withBackdrop"
            : ""
        }`}>
        <div className='product__img'>
          <Link to={`/shop/${item.id}`}>
            {" "}
            <motion.img
              whileHover={{ scale: 0.9 }}
              src={item.imgUrl}
              alt=''
              width={"100%"}
              height={"220px"}
            />
          </Link>
        </div>
        <div className='p-2 product__info'>
          <h3 className='product__name'>
            {" "}
            <Link to={`/shop/${item.id}`}>
              {item.productName.length > 13
                ? `${item.productName.substring(0, 13)}...`
                : item.productName}
              {/* {item.productName} */}
            </Link>
          </h3>
          <span>{item.category}</span>
        </div>
        <div className='product__card-bottom d-flex align-items-center justify-content-between'>
          <span className='price'>{item.price}</span>
          {(
            isAuthenticated
              ? !cartItems.some((e) => e.productID === item.id)
              : !cartItems.some((e) => e.id === item.id)
          ) ? (
            <motion.span
              className='plus'
              whileHover={{ scale: 1.2 }}
              onClick={() => addToCart()}>
              <i className='ri-add-line'></i>
            </motion.span>
          ) : (
            <>
              {/* <motion.span
                whileHover={{ scale: 1.2 }}
                className='shop-icon'
                onClick={navigateToCart}>
                <MdOutlineShoppingCartCheckout />
              </motion.span> */}
              {/* <motion.span
                whileHover={{ scale: 1.2 }}
                className='delete-icon'
                onClick={() => handleDelete(item.id)}>
                <AiOutlineClose />
              </motion.span> */}
              <div className='quantity-control text-center'>
                <div
                  // color='danger'
                  className='quantity-button'
                  onClick={() =>
                    handleQuantityChange(
                      isAuthenticated
                        ? cartItems.find((e) => e.productID === item.id)
                            ?.quantity - 1
                        : cartItems.find((e) => e.id === item.id)?.quantity - 1,
                      item
                    )
                  }>
                  <i class='ri-subtract-line'></i>
                </div>
                <InputGroup className='quantity-input'>
                  <Input
                    type='text'
                    disabled
                    value={
                      isAuthenticated
                        ? cartItems.find((e) => e.productID == item.id)
                            ?.quantity
                        : cartItems.find((e) => e.id === item.id)?.quantity
                    }
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value))
                    }
                    onBlur={(e) => handleBlur(e, item)}
                  />
                </InputGroup>
                <div
                  // color='success'
                  className='quantity-button'
                  onClick={() =>
                    handleQuantityChange(
                      isAuthenticated
                        ? cartItems.find((e) => e.productID === item.id)
                            ?.quantity + 1
                        : cartItems.find((e) => e.id === item.id)?.quantity + 1,
                      item
                    )
                  }>
                  <i class='ri-add-line'></i>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
