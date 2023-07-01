import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/checkout.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import firebase from "firebase/compat/app";
import emailjs from "@emailjs/browser";
import axios from "axios";

const Checkout = () => {
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    phNo: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [prod, setProd] = useState([]);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("products"))?.length) {
      setProd([...JSON.parse(localStorage.getItem("products"))]);
    }
  }, []);
  const checkout = async (e) => {
    e.preventDefault();
    try {
      const docRef = await collection(db, "checkout");

      await addDoc(docRef, {
        products: localStorage.getItem("products"),
        uid: JSON.parse(localStorage.getItem("user")).uid,
        name: payload.name,
        email: payload.email,
        phNo: payload.phNo,
        address: payload.address,
        city: payload.city,
        postalCode: payload.postalCode,
        country: payload.country,
        orderedDate: new Date(),
      });

      axios.post("http://localhost:3010/sendMail", {
        to: payload.email,
        subject: "MSM Angadi",
        text: "Thanks for your order with MSM Angadi. Kindly Wait for further update. Thank You",
      }).then(() => {
        console.log("Product placed successfully");
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        toast.success("Product placed successfully");
        localStorage.removeItem("products");
      });
      
    } catch (error) {
      toast.error("error");
    }
  };
  return (
    <>
      <Helmet title="Checkout"></Helmet>
      <CommonSection title="Checkout" />
      <Form className="billing__form" onSubmit={checkout}>
        <section>
          <Container>
            <Row>
              <Col lg="8">
                <h6 className="mb-4 fw-bold">Billing Information</h6>
                <FormGroup className="form__group">
                  <Input
                    required
                    type="text"
                    bsSize="sm"
                    value={payload.name}
                    placeholder="Enter your name"
                    onChange={(e) =>
                      setPayload({ ...payload, name: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <Input
                    required
                    type="text"
                    bsSize="sm"
                    value={payload.email}
                    placeholder="Enter your email"
                    onChange={(e) =>
                      setPayload({ ...payload, email: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <Input
                    required
                    type="number"
                    bsSize="sm"
                    value={payload.phNo}
                    placeholder="Enter your Phone Number"
                    onChange={(e) =>
                      setPayload({ ...payload, phNo: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <Input
                    required
                    type="text"
                    bsSize="sm"
                    value={payload.address}
                    placeholder="Enter your address"
                    onChange={(e) =>
                      setPayload({ ...payload, address: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <Input
                    required
                    type="text"
                    bsSize="sm"
                    value={payload.city}
                    placeholder="Enter your city"
                    onChange={(e) =>
                      setPayload({ ...payload, city: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <Input
                    required
                    type="text"
                    bsSize="sm"
                    value={payload.postalCode}
                    placeholder="Enter your Postal Code"
                    onChange={(e) =>
                      setPayload({ ...payload, postalCode: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <Input
                    required
                    type="text"
                    bsSize="sm"
                    value={payload.country}
                    placeholder="Enter your country"
                    onChange={(e) =>
                      setPayload({ ...payload, country: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <div className="checkout__cart">
                  <h6>
                    Total Quantity :{" "}
                    <span>
                      {prod.length && prod?.reduce((a, b) => b.quantity + a, 0)}{" "}
                      items
                    </span>
                  </h6>
                  <h6>
                    Subtotal :{" "}
                    <span>
                      $
                      {prod.length &&
                        prod
                          .reduce(
                            (total, product) =>
                              total + product.quantity * product.price,
                            0
                          )
                          .toFixed(2)}
                    </span>
                  </h6>
                  <h6>
                    <span>
                      Shipping : <br />
                      Free Shipping
                    </span>
                    <span>$0</span>
                  </h6>
                  <h4>
                    Total Cost :{" "}
                    <span>
                      $
                      {prod.length &&
                        prod
                          ?.reduce(
                            (total, product) =>
                              total + product.quantity * product.price,
                            0
                          )
                          .toFixed(2)}
                    </span>
                  </h4>
                  <button type="submit" className="buy__btn auth__btn w-100">
                    Place an order
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Form>
    </>
  );
};

export default Checkout;
