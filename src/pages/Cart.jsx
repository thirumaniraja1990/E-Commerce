import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col, InputGroup, Button, Input } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import {
  addDocument,
  getDocuments,
  updateDocument,
} from "../custom-hooks/crud";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const cartItems2 = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { data: cart, loading: isLoad } = useGetData("cart");
  const { data: products, loading } = useGetData("products");
  function updateProductsWithQuantity(products, cartItems) {
    return products
      .map((product) => {
        const cartItem = cartItems.find(
          (item) => item.productID === product.id
        );

        if (cartItem) {
          return {
            ...product,
            quantity: cartItem.quantity, // Add the quantity property
          };
        }

        return null;
      })
      .filter((product) => product !== null);
  }
  useEffect(() => {
    console.log("cart", cart);
    if (JSON.parse(localStorage.getItem("user"))?.uid) {
      const cartItems1 = cart.filter(
        (e) => e.userId === JSON.parse(localStorage.getItem("user"))?.uid
      );

      const updatedProducts = updateProductsWithQuantity(products, cartItems1);
      console.log(updatedProducts);
      setCartItems([...updatedProducts]);
    } else {
      setCartItems([
        ...cartItems2.map((e) => {
          return {
            ...e,
            quantity: e.quantity,
          };
        }),
      ]);
    }
  }, [cart, cartItems2]);

  const handleCheckout = () => {
    localStorage.setItem("products", JSON.stringify(cartItems));
    navigate("/checkout", true);
  };

  return (
    <>
      <Helmet title="Cart"></Helmet>
      {/* <CommonSection title="Shopping Cart" /> */}
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems?.length === 0 ? (
                <h2 className="fs-4 text-center">No item added to the cart!</h2>
              ) : (
                <div className="msmCart">
                  {cartItems?.map((item, index) => (
                    <Tr
                      item={item}
                      index={index}
                      setCartItems={setCartItems}
                      cartItems={cartItems}
                      cartItems2={cartItems2}
                    />
                  ))}
                </div>
              )}
            </Col>
            <Col lg="3">
              <div>
                <h6 className="d-flex align-items-center justify-content-between">
                  Subtotal
                  <span className="fs-4 fw-bold">
                    $
                    {cartItems
                      .reduce(
                        (total, product) =>
                          total + product.quantity * product.price,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </h6>
              </div>
              <p className="fs-6 mt-2">
                taxes and shipping will calculate in checkout
              </p>
              <div>
                <button className="buy__btn w-100 " onClick={handleCheckout}>
                  Checkout
                </button>
                <button className="buy__btn w-100 mt-4">
                  <Link to="/shop">Continue Shopping</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

const Tr = ({ item, index, cartItems, setCartItems, cartItems2 }) => {
  const dispatch = useDispatch();
  const isAuthenticated = !!JSON.parse(localStorage.getItem("user"))?.uid;
  const deleteProduct = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const cartQuery = query(
        collection(db, "cart"),
        where("productID", "==", item.id),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(cartQuery);

      querySnapshot.forEach(async (queryDoc) => {
        const docRef = doc(db, "cart", queryDoc.id);
        await deleteDoc(docRef);
      });

      dispatch(cartActions.deleteItem(item.productID));
      toast.error("Product removed from the Cart");
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };
  const handleQuantityChange = (newQuantity, item) => {
    if (newQuantity >= 1) {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("hi");
      if (user?.uid) {
        updateCartInFirebase(user.uid, item.id, newQuantity);
      } else {
        dispatch(
          cartActions.addQuantity({ id: item.id, quantity: newQuantity })
        );
      }
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
const backgroundImageURL = item.imgUrl;
  return (
    <>
      <div
        className="msmCartSection"
        style={{padding: "0px", margin: "16px 0px", border: "1px solid rgb(229, 229, 229)", borderRadius: "12px"}}>
        <div className="msmCartSectionInner" style={{padding: "8px"}}>
          <div className="msmCartProductDetails">
            <div className="msmCartProductImagesec">
            <a
              href="/"
              style={{textDecoration: "none"}}
              alt=""
            >
              <div
                className="msmCartProductImage"
                title={item.productName}
               
              >
                <img src={backgroundImageURL} alt={item.productName}/>
                </div>

            </a></div>
              <div className="msmCartProductNameSec">
                <a
                  href="/"
                  style={{textDecoration: "none"}}
                >
                  <p className="msmCartProductName">
                    {item.productName}
                  </p>
                </a>
                <div className="msmCartProductPriceSec">
                  <p className="msmCartProductPrice">
                    <span>${item.price}</span>
                  </p>
                </div>
              </div>
           
                
          </div>
          <div className="msmCartButtonDetailSec">
            <div className="msmCartButtonSec" style={{paddingTop: "4px"}}>
              
              <div className="msmCartButton">
              <InputGroup>
            <Button
              color="danger"
              onClick={() =>
                handleQuantityChange(
                  isAuthenticated
                    ? cartItems.find((e) => e.id === item.id)?.quantity - 1
                    : cartItems2.find((e) => e.id === item.id)?.quantity - 1,
                  item
                )
              }
            >
              -
            </Button>
            <Input
              type="number"
              bsSize="sm"
              onChange={(e) => {
                if (/^[0-9]+$/.test(e.target.value) || e.target.value === "") {
                  handleQuantityChange(parseInt(e.target.value), item);
                }
              }}
              value={item.quantity}
              placeholder="Quantity"
            />
            <Button
              color="success"
              onClick={() =>
                handleQuantityChange(
                  isAuthenticated
                    ? cartItems.find((e) => e.id === item.id)?.quantity + 1
                    : cartItems2.find((e) => e.id === item.id)?.quantity + 1,
                  item
                )
              }
            >
              +
            </Button>
          </InputGroup>
              </div>
              <div className="msmCartCloseSec">
                <p className="msmCartCloseIcon">
                <motion.i
            whileHover={{ scale: 1.2 }}
            onClick={deleteProduct}
            className="ri-close-line"
          ></motion.i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );
};
export default Cart;
