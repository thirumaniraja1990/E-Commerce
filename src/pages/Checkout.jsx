import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/checkout.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import firebase from "firebase/compat/app";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    phNo: "",
    pickupLocation: "",
    otherAddress: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const sendEmail = (payload) => {
    return new Promise((resolve, reject) => {
      // Your email service configuration
      const serviceId = "service_jtcn1v8";
      const templateId = "template_c1aydzs";
      const userId = "1U-pNmW5LeO3UJgUA";

      // Construct the email body with dynamic data
      let emailBody = `<html>
      <head>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .total-price {
            font-weight: bold;
            background-color: #000;
            color: #ffffff;
          }
        </style>
      </head>
      <body>
        <p>Hello ${payload.name},</p>
        <p>Thanks for your order with MSM Angadi. Kindly wait for further updates.</p>
        <p>Here is the order details:</p>
        <table>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>`;

      let totalPrice = 0; // Initialize total price

      // Iterate over the products array and add rows to the table
      JSON.parse(localStorage.getItem("products")).forEach((product) => {
        const { productName, quantity, price } = product;
        const productTotal = quantity * price; // Calculate individual product total
        totalPrice += productTotal; // Add to the total price
        emailBody += `<tr>
        <td>${productName}</td>
        <td>${quantity}</td>
        <td>$${price}</td>
        <td>$${productTotal}</td>
      </tr>`;
      });

      // Add closing lines to the email body
      emailBody += `</table>
      <p class="total-price">Total Price: $${totalPrice}</p>
      <p>Best wishes,<br>MSM team</p>
    </body>
    </html>`;

      const templateParams = {
        to: payload.email,
        to_name: payload.name,
        reply_to: "msmangadi.etagers@gmail.com",
        emailBody: emailBody,
        // Other template parameters...
      };

      // Send the email
      emailjs
        .send(serviceId, templateId, templateParams, userId)
        .then((response) => {
          console.log(
            "Email successfully sent!",
            response.status,
            response.text
          );
          resolve(); // Resolve the promise when the email is sent successfully
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          reject(error); // Reject the promise if there's an error sending the email
        });
    });
  };

  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [prod, setProd] = useState([]);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("products"))?.length) {
      setProd([...JSON.parse(localStorage.getItem("products"))]);
    }
  }, []);
  const navigate = useNavigate();
  const deleteProductFromCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const cartQuery = query(
        collection(db, "cart"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(cartQuery);

      querySnapshot.forEach(async (queryDoc) => {
        const docRef = doc(db, "cart", queryDoc.id);
        await deleteDoc(docRef);
      });
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const checkout = async (e) => {
    setIsLoading(true);
    setIsPlacingOrder(true);
    e.preventDefault();
    if (!payload.phNo.trim()) {
      // Check if the phone number is empty
      setIsLoading(false);
      setIsPlacingOrder(false);
      toast.error("Phone number is required.");
      return; // Exit the function if the phone number is empty
    }
    try {
      const docRef = await collection(db, "checkout");
      // console.log(payload);
      await addDoc(docRef, {
        products: localStorage.getItem("products"),
        uid: JSON.parse(localStorage.getItem("user"))?.uid ?? "guest",
        name: payload.name,
        email: payload.email,
        phNo: payload.phNo,
        pickupLocation: payload.pickupLocation,
        otherAddress: payload.otherAddress,
        address: payload.address,
        city: payload.city,
        postalCode: payload.postalCode,
        country: payload.country,
        orderedDate: new Date(),
      });
      sendEmail(payload).then(() => {
        setIsLoading(false);

        toast.success("Product placed successfully");
        localStorage.removeItem("products");
        deleteProductFromCart();
        navigate("/thankyou");
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("error");
    }
  };
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  return (
    <>
      <Helmet title='Checkout'></Helmet>
      {/* <CommonSection title='Checkout' /> */}
      <Form className='billing__form' onSubmit={checkout}>
        <section>
          <Container>
            <Row>
              <Col lg='8'>
                <h6 className='mb-4 fw-bold'>
                  Contact Information & Pickup location
                </h6>
                <FormGroup className='form__group'>
                  <Input
                    required
                    type='text'
                    bsSize='sm'
                    value={payload.name}
                    placeholder='Enter your name'
                    onChange={(e) =>
                      setPayload({ ...payload, name: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className='form__group'>
                  <Input
                    required
                    type='text'
                    bsSize='sm'
                    value={payload.email}
                    placeholder='Enter your email'
                    onChange={(e) =>
                      setPayload({ ...payload, email: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className='form__group'>
                  <PhoneInput
                    country={"us"}
                    // enableSearch={true}
                    value={payload.phNo}
                    onlyCountries={["us", "in"]}
                    inputProps={{
                      required: true,
                      placeholder: "Enter your Phone Number",
                    }}
                    onChange={(e) => {
                      setPayload({ ...payload, phNo: e });
                    }}
                    inputStyle={{ width: "100%", height: "50px" }}
                  />
                  {isPlacingOrder && payload.phNo.trim() === "" && (
                    <p className='error-message'>Phone number is required.</p>
                  )}
                </FormGroup>
                {/* <FormGroup className='form__group'>
                  <Input
                    required
                    type='number'
                    bsSize='sm'
                    value={payload.phNo}
                    placeholder='Enter your Phone Number'
                    onChange={(e) =>
                      setPayload({ ...payload, phNo: e.target.value })
                    }
                  />
                </FormGroup> */}
                <FormGroup className='form__group'>
                  <Input
                    // className='mb-3'
                    required
                    type='select'
                    value={payload.pickupLocation}
                    placeholder='Select pickup location'
                    onChange={(e) =>
                      setPayload({ ...payload, pickupLocation: e.target.value })
                    }>
                    <option value=''>Select pickup location</option>
                    <option value='Franklin, Ohio'>Franklin, Ohio</option>
                    <option value='Dayton, Ohio'>Dayton, Ohio</option>
                    <option value='Columbus, Ohio'>Columbus, Ohio</option>
                    <option value='Others'>Others</option>
                  </Input>
                </FormGroup>

                {payload.pickupLocation === "Others" && (
                  <div>
                    <p
                      style={{
                        color: "red",
                        fontFamily: "initial",
                        fontSize: "16px",
                        paddingLeft: "20px",
                        marginBottom: "1em",
                      }}>
                      MSM team will reach you to arrange your shipping as you
                      choose the pickup location not listed in the list.
                    </p>
                    <FormGroup className='form__group'>
                      <Input
                        required
                        type='text'
                        bsSize='sm'
                        value={payload.otherAddress}
                        placeholder='Enter Other Location'
                        onChange={(e) =>
                          setPayload({
                            ...payload,
                            otherAddress: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </div>
                )}

                <FormGroup className='form__group'>
                  <Input
                    required
                    type='text'
                    bsSize='sm'
                    value={payload.address}
                    placeholder='Enter your address'
                    onChange={(e) =>
                      setPayload({ ...payload, address: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className='form__group'>
                  <Input
                    required
                    type='text'
                    bsSize='sm'
                    value={payload.city}
                    placeholder='Enter your city'
                    onChange={(e) =>
                      setPayload({ ...payload, city: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className='form__group'>
                  <Input
                    required
                    type='text'
                    bsSize='sm'
                    value={payload.postalCode}
                    placeholder='Enter your Postal Code'
                    onChange={(e) =>
                      setPayload({ ...payload, postalCode: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup className='form__group'>
                  <Input
                    required
                    type='text'
                    bsSize='sm'
                    value={payload.country}
                    placeholder='Enter your State'
                    onChange={(e) =>
                      setPayload({ ...payload, country: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col lg='4'>
                <div className='checkout__cart'>
                  <h6>
                    Total Quantity :{" "}
                    <span>
                      {prod?.length &&
                        prod?.reduce((a, b) => b.quantity + a, 0)}{" "}
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
                      {/* Free Shipping */}
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
                  <button
                    type='submit'
                    className={`buy__btn auth__btn w-100 ${
                      isLoading ? "loading" : ""
                    }`}
                    disabled={isLoading}>
                    {isLoading ? (
                      <div className='spinner'>
                        <i className=' ri-loader-4-line fa fa-spinner fa-spin'></i>{" "}
                        Placing Order...
                      </div>
                    ) : (
                      "Place an order"
                    )}
                  </button>
                </div>
                <div className='mt-3'>
                  <p
                    style={{
                      color: "red",
                      fontFamily: "initial",
                      fontSize: "16px",
                      paddingLeft: "20px",
                      // marginBottom: "1em",
                    }}>
                    Order amount will be collected at the time of delivery or
                    pickup.
                    <br />
                    <br />
                  </p>

                  <p
                    style={{
                      color: "#0a1d37",
                      fontFamily: "initial",
                      fontSize: "16px",
                      paddingLeft: "20px",
                      marginBottom: "1em",
                    }}>
                    Pre-order closing date 10/31/2023
                    <br />
                    Expected delivery or Pickup on or before 11/11/2023
                  </p>
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
