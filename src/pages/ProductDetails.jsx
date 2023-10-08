import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import Productslist from "../components/UI/Productslist";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import { collection, addDoc } from "firebase/firestore";

const ProductDetails = () => {
  const [tab, setTab] = useState("desc");
  const [rating, setRating] = useState(null);
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: products } = useGetData("products");

  const [product, setProduct] = useState({});
  const docRef = doc(db, "products", id);

  useEffect(() => {
    const getProduct = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
        console.log(docSnap);
      } else {
      }
    };
    getProduct();
  }, []);

  const {
    imgUrl,
    productName,
    price,
    //avgRating,
    //reviews,
    description,
    shortDesc,
    category,
  } = product;

  const relatedProducts = products.filter(
    (item) => item?.category === category
  );

  const isAuthenticated = !!JSON.parse(localStorage.getItem("user"))?.uid;
  const addToCart = async () => {
    console.log(product);
    if (isAuthenticated) {
      try {
        const docRef = await collection(db, "cart");

        await addDoc(docRef, {
          userId: JSON.parse(localStorage.getItem("user")).uid,
          productID: id,
          quantity: 1,
        });

        toast.success("Product added to the Cart");
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch(
        cartActions.addItem({
          id: id,
          imgUrl: product.imgUrl,
          productName: product.productName,
          price: product.price,
        })
      );
      toast.success("Product added successfully");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  return (
    <>
      <Helmet title={productName}></Helmet>
      {/* <CommonSection title={productName} /> */}
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <img style={{ width: "60%" }} src={imgUrl} alt="" />
            </Col>
            <Col lg="6">
              <div className="product__details">
                <h2>{productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-4">
                  <div>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-half-fill"></i>
                    </span>
                  </div>
                  <p></p>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">${price}</span>
                  <span>Category : {category?.toUpperCase()}</span>
                </div>
                <p className="mt-3">{shortDesc}</p>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  className="buy__btn"
                  onClick={addToCart}
                >
                  Add to Cart
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/*    <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-item-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                   Reviews({reviews.length}) 
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{description}</p>
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                     <ul>
                      {reviews.map((item, index) => (
                        <li key={index} className="mb-4">
                          <span>{item.rating}( rating)</span>
                          <p>{item.text}</p>
                        </li>
                      ))}
                    </ul> 
                    <div className="review__form">
                      <h4>Leave your experience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Enter Name"
                            ref={reviewUser}
                            required
                          />
                        </div>
                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(1)}
                          >
                            1 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(2)}
                          >
                            2 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(3)}
                          >
                            3 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(4)}
                          >
                            4 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(5)}
                          >
                            5 <i className="ri-star-s-fill"></i>
                          </motion.span>
                        </div>
                        <div className="form__group">
                          <textarea
                            ref={reviewMsg}
                            rows={4}
                            type="text"
                            placeholder="Review Message"
                            required
                          />
                        </div>
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          className="buy__btn"
                        >
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            <Col lg="12" className="mt-5">
              <h2 className="related__title">you might also like</h2>
            </Col>
            <Productslist data={relatedProducts} />
          </Row>
        </Container>
      </section> */}
    </>
  );
};

export default ProductDetails;
