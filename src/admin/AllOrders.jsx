import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import Switch from "@mui/material/Switch";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Button,
  Input,
  FormGroup,
} from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";
import Address from "../components/UI/CommonAddress";
import { Divider } from "@mui/material";
import logo from "../assets/images/Logo-Latest.jpeg";
import { db } from "../firebase.config";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import CommonProduct from "../components/UI/CommonProduct";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const AllOrder = () => {
  const [myOrders, setMyOrder] = useState([]);
  const navigate = useNavigate();
  const { data: checkoutProducts, loading } = useGetData("checkout");
  // const label = { inputProps: { 'aria-label': 'Switch demo' } };
  useEffect(() => {
    setMyOrder([
      ...checkoutProducts.map((el) => {
        const orderedDate = Timestamp.fromDate(
          new Date(el.orderedDate?.seconds * 1000)
        ).toDate();
        const formattedDate = orderedDate.toLocaleString();
        return {
          ...el,
          products: JSON.parse(el.products),
          orderedDate: formattedDate,
        };
      }),
    ]);
  }, [checkoutProducts]);
  const handlePrint = (item) => {
    const products = item.products;

    const totalPages = Math.ceil(products.length / 20);

    let html = `
    <html>
      <head>
        <title>Orders</title>
      </head>
      <body style="width: 793px; height:283mm; border: 1px solid black; margin-top:20px; font-family: 'Roboto', sans-serif;">
        <div style="display: flex; width: 100%; padding-bottom:20px;">
          <div style="width:50%; padding-left:30px; padding-top:15px;">
            <div style="font-size:40px; color: #004aab;"><b>ORDERS </b></div> 
            <div style="font-size:14px; padding-top:5px;">
              2/486A South street,Sivan Nagar, Vinagar Colony, Naranapuram, Sivakasi Tamilnadu - 626130, India
            </div>
            <div style="font-size:14px; padding-top:5px;">Mobile -  82480 93484 </div>
            <div style="font-size:14px; padding-top:5px;">Email - msm.eangadi@gmail.com </div>
          </div>
          <div style="width:50%; align-self: center; text-align:right; padding-right:30px;">
            <img src=${logo} style="width:100px;">
          </div>
        </div>
        <div style="display: flex; width: 100%;">
          <div style="width:100%; padding:0 0px;">
            <div style="border-top: 2px solid #eaeaea;"></div>
          </div> 
        </div>
        <div style="display: flex; width:100%; font-size:14px;">
          <div style=" width:33.3%; padding:20px 40px 20px 40px;">
            <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Date: </b></div> 
            <div style="font-size:14px;">${new Date().toLocaleDateString()}</div> 
          </div>
        </div>`;

    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * 20;
      const end = start + 20;
      const pageProducts = products.slice(start, end);

      // Include the table head on the first page only
      if (page === 1) {
        html += `
        <div style="padding:0 0px;">
          <table style="border-collapse: collapse; width:100%; padding:40px 50px 10px 50px;" class="clr">
            <tr style="font-size:13px; background-color: #004aab; color:#fff;">
              <th style="width:60px; padding: 15px 15px; text-align: center;">S.NO</th>
              <th style="width:60px; padding: 15px 15px; text-align: center;">Product Name</th>
              <th style="width:100px; padding: 15px 15px; text-align: center;">Product Qty</th>
              <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost Per Unit</th>
              <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost</th>
            </tr> 
            ${pageProducts
              .map((e, i) => {
                return `
                  <tr style="font-size:14px; background:#fff; border-bottom:1px solid #ababab; color: #9d9d9d; padding:5px;">
                    <td style="width:60px;  padding:5px; text-align: center;">${
                      i + start + 1
                    }</td>
                    <td style="width:60px; padding:5px; text-align: center;">${
                      e.productName
                    }</td>
                    <td style="width:100px; padding:5px; text-align: center;">${
                      e.quantity
                    }</td>
                    <td style="width:60px; padding:5px; text-align: center;"> $ ${
                      e.price
                    }</td>
                    <td style="width:60px; padding:5px; text-align: center;"> $ ${
                      e.price * e.quantity
                    }</td>
                  </tr>
                `;
              })
              .join("")}
          </table>
        </div>`;
      } else {
        // Exclude the table head on other pages
        html += `
        <div style="padding:0 0px;">
          <table style="border-collapse: collapse; width:100%; padding:40px 50px 10px 50px;" class="clr">
            ${pageProducts
              .map((e, i) => {
                return `
                  <tr style="font-size:14px; background:#fff; border-bottom:1px solid #ababab; color: #9d9d9d; padding:5px;">
                    <td style="width:60px;  padding:5px; text-align: center;">${
                      i + start + 1
                    }</td>
                    <td style="width:60px; padding:5px; text-align: center;">${
                      e.productName
                    }</td>
                    <td style="width:100px; padding:5px; text-align: center;">${
                      e.quantity
                    }</td>
                    <td style="width:60px; padding:5px; text-align: center;"> $ ${
                      e.price
                    }</td>
                    <td style="width:60px; padding:5px; text-align: center;"> $ ${
                      e.price * e.quantity
                    }</td>
                  </tr>
                `;
              })
              .join("")}
          </table>
        </div>`;
      }

      if (page !== totalPages) {
        html += `
        <div style="page-break-after: always;"></div>`;
      }
    }

    // Calculate subtotal for all pages
    const subtotal = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    // Calculate packing charges for all pages (3% of subtotal)
    const packingCharges = subtotal * 0.03;

    // Calculate overall total for all pages
    const overallTotal = subtotal + packingCharges;

    html += `
      <div style="padding:0 0px;">
        <table style="border-collapse: collapse; width:100%; padding:40px 50px 10px 50px;" class="clr">
          <tr style="font-size:14px; background:#fff; color: #004aab;">
            <td style="width:100px; padding:5px 15px; text-align: right;" colspan="4">Subtotal:</td>
            <td style="width:10px; padding:5px 25px; text-align: right;" colspan="4">$ ${subtotal.toFixed(
              2
            )}</td>
          </tr>
          <tr style="font-size:14px; background:#fff; color: #004aab;">
            <td style="width:100px; padding:5px 15px; text-align: right;" colspan="4">Packing Charges (3%):</td>
            <td style="width:10px; padding:5px 25px; text-align: right;" colspan="4">$ ${packingCharges.toFixed(
              2
            )}</td>
          </tr>
          <tr style="font-size:14px; background:#fff; color: #004aab;">
            <td style="width:100px; padding:5px 15px; text-align: right;" colspan="4">Overall Total:</td>
            <td style="width:10px; padding:5px 25px; text-align: right;" colspan="4">$ ${overallTotal.toFixed(
              2
            )}</td>
          </tr>
        </table>
      </div>
    </body>
  </html>`;

    var printWindow = window.open("", "", "height=500,width=1000");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };
  const handleCheckout = () => {
    localStorage.setItem("products", JSON.stringify(myOrders));
    navigate("/checkout", true);
  };
  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    products.forEach((product) => {
      const { quantity, price } = product;
      totalPrice += quantity * price;
    });
    return totalPrice;
  };
  const sendEmail = (status, item) => {
    return new Promise((resolve, reject) => {
      // Your email service configuration
      const serviceId = "service_jtcn1v8";
      const templateId = "template_c1aydzs";
      const userId = "1U-pNmW5LeO3UJgUA";

      // Construct the email body with dynamic data
      let emailBody = `<html>
      <head>
        <style>
          /* Define your custom styles here */
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333333;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #ff5722;
            margin-top: 0;
          }
          p {
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #dddddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .total-price {
            font-weight: bold;
            background-color: #000000;
            color: #ffffff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Order Update</h1>
          <p>Hello ${item.name},</p>
          <p>We have some exciting news for you!</p>
          <p>We'll be in touch with you soon.</p>
          <p>To track the status of your order, please click <a class="track-order-link" href="https://master--neon-torrone-2e1f93.netlify.app/">here</a>.</p>
          <h2>Billing Address:</h2>
          <p>
            <b>Address:</b> ${item.address}<br>
            <b>City:</b> ${item.city}<br>
            <b>Country:</b> ${item.country}<br>
            <b>Postal Code:</b> ${item.postalCode}<br>
          </p>
          <h2>Order Review:</h2>
          <table>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
            ${item.products
              .map(
                (product) => `
              <tr>
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>$${product.price}</td>
                <td>$${product.quantity * product.price}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <p class="total-price">Total Price: $${calculateTotalPrice(
            item.products
          )}</p>
          <p>Order Status: ${status}</p>
          <p>Best wishes,<br>MSM team</p>
        </div>
      </body>
      </html>
      `;

      const templateParams = {
        to: item.email,
        to_name: item.name,
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
  const sendEmailOrderCompleted = (status, item) => {
    return new Promise((resolve, reject) => {
      // Your email service configuration
      const serviceId = "service_jtcn1v8";
      const templateId = "template_c1aydzs";
      const userId = "1U-pNmW5LeO3UJgUA";

      // Construct the email body with dynamic data
      const emailBody = `<html>
      <head>
        <style>
          /* Define your custom styles here */
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333333;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #ff5722;
            margin-top: 0;
          }
          p {
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th,
          td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #dddddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .total-price {
            font-weight: bold;
            background-color: #000000;
            color: #ffffff;
          }
          .track-order-link {
            text-decoration: none;
            color: #004aab;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Order Completed</h1>
          <p>Hello ${item.name},</p>
          <p>Thank you for your order with MSM Angadi.</p>
          <p>We are pleased to inform you that your order has been completed successfully.</p>
          <p>To track the status of your order, please click <a class="track-order-link" href="https://master--neon-torrone-2e1f93.netlify.app/">here</a>.</p>
          <h2>Billing Address:</h2>
          <p>
            <b>Address:</b> ${item.address}<br>
            <b>City:</b> ${item.city}<br>
            <b>Country:</b> ${item.country}<br>
            <b>Postal Code:</b> ${item.postalCode}<br>
          </p>
          <h2>Order Details:</h2>
          <table>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
            ${item.products
              .map(
                (product) => `
              <tr>
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>$${product.price}</td>
                <td>$${product.quantity * product.price}</td>
              </tr>
            `
              )
              .join("")}
          </table>
          <p class="total-price">Total Price: $${calculateTotalPrice(
            item.products
          )}</p>
          <p>Order Status: ${status}</p>
          <p>Best wishes,<br>MSM team</p>
          
        </div>
      </body>
    </html>`;

      const templateParams = {
        to: item.email,
        to_name: item.name,
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

  const updateOrderStatus = async (id, status, item) => {
    try {
      const docRef = doc(db, "checkout", id);
      await updateDoc(docRef, { status: status });
      if (status === "Shipped") {
        sendEmail(status, item).then(() => {
          toast.success("Status changed and Email sent!");
        });
      } else if (status === "Completed") {
        sendEmailOrderCompleted(status, item).then(() => {
          toast.success("Status changed and Email sent!");
        });
      }
    } catch (error) {
      console.log("Error updating document:", error);
    }
  };

  /* const updateProductStatus = async (id, status) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, { productstatus: status });
    } catch (error) {
      console.log('Error updating product:', error);
    }
  }
 */

  const ordersPerPage = 5;

  // State to keep track of the current page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(myOrders.length / ordersPerPage);

  // Get the orders for the current page
  const currentOrders = myOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );
  const sortedOrders = currentOrders.slice().sort((a, b) => {
    const dateA = new Date(a.orderedDate);
    const dateB = new Date(b.orderedDate);
    return dateB - dateA;
  });
  // Function to handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <Helmet title='Cart'></Helmet>
      {/* <CommonSection title="All Orders" /> */}
      <section>
        <Container>
          <Row>
            <h4 className='mb-5'>All Orders</h4>
            <Col lg='12'>
              {myOrders?.length === 0 ? (
                <h2 className='fs-4 text-center'>No item added to the cart!</h2>
              ) : (
                <table className='table bordered'>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Address</th>
                      <th>View Products</th>
                      <th>Total Amount</th>
                      <th>Ordered Date</th>
                      <th>Actions</th>
                      <th>Status</th>
                      {/* <th>Product Status</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders?.map((item, index) => {
                      const productCount = item.products?.length + 1;
                      const totalAmount =
                        item?.products?.reduce(
                          (total, product) =>
                            total + product.quantity * product.price,
                          0
                        ) || 0;

                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>

                            <td>
                              <Address
                                details={{
                                  name: item.name,
                                  phNo: item.phNo,
                                  email: item.email,
                                  address: item.address,
                                  city: item.city,
                                  pickuplocation: item.pickupLocation,
                                  otherAddress: item.otherAddress,
                                }}
                              />
                            </td>
                            <td>
                              <CommonProduct product={item.products} />
                            </td>
                            <td>${totalAmount.toFixed(2)}</td>
                            <td>
                              {item.orderedDate === "Invalid Date"
                                ? "-"
                                : item.orderedDate}
                            </td>
                            <td>
                              {/* <PrintIcon/> */}
                              <div onClick={() => handlePrint(item)}>
                                <i class='ri-printer-fill'></i>
                              </div>
                            </td>
                            <td>
                              <FormGroup className='form__group w-50'>
                                <select
                                  className='p-2'
                                  value={item.status}
                                  onChange={(e) =>
                                    updateOrderStatus(
                                      item.id,
                                      e.target.value,
                                      item
                                    )
                                  }
                                  required>
                                  <option>Select Status</option>

                                  <option value='Hold'>Hold</option>
                                  <option value='Shipped'>Shipped</option>
                                  <option value='Completed'>Completed</option>
                                  <option value='Rejected'>Rejected</option>
                                </select>
                              </FormGroup>
                            </td>
                            {/* <td><FormGroup className="form__group w-50">
                                    <Switch {...label} defaultChecked 
                                    onChange={(e) => updateProductStatus(item.id,e.target.value)}/>
                                    </FormGroup></td> */}
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
              <div className='pagination'>
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}>
                  Prev
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "active" : ""}>
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

const Tr = ({ item, index, myOrders, setMyOrder }) => {
  const dispatch = useDispatch();

  return (
    <>
      <tr>
        <td>
          <img src={item.imgUrl} alt='' />
        </td>
        <td>{item.productName}</td>
        <td>${item.price}</td>
        <td>{item.quantity}</td>
        <td></td>
      </tr>
    </>
  );
};
export default AllOrder;
