import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { Box, FormGroup } from "@mui/material";
import CommonProduct from "../components/UI/CommonProduct";
import { db } from "../firebase.config";
import { Timestamp, doc, updateDoc, where } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import MuiTable from "../components/MuiTable";
const Order = () => {
  const [myOrders, setMyOrder] = useState([]);
  const whereConditionCheckout = where(
    "orderedDate",
    ">",
    new Date("2023-12-1")
  );

  const { data: checkoutProducts } = useGetData(
    "checkout",
    whereConditionCheckout
  );
  useEffect(() => {
    setMyOrder(
      checkoutProducts.map((el) => {
        const orderedDate = Timestamp.fromDate(
          new Date(el.orderedDate?.seconds * 1000)
        ).toDate();
        const formattedDate = orderedDate.toLocaleString(); // Adjust the date formatting as per your requirements
        return {
          ...el,
          products: JSON.parse(el.products),
          orderedDate: formattedDate,
        };
      })
    );
  }, [checkoutProducts]);

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    products.forEach((product) => {
      const { quantity, price } = product;
      totalPrice += quantity * price;
    });
    return totalPrice.toFixed(2);
  };
  const sendEmail = (status, item) => {
    return new Promise((resolve, reject) => {
      // Your email service configuration
      const serviceId = "service_9eid4bz";
      const templateId = "template_19k4ddr";
      const userId = "ye0WTciM_JJM6lcbZ";

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
        reply_to: "msm.eangadi@gmail.com",
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
      const serviceId = "service_9eid4bz";
      const templateId = "template_19k4ddr";
      const userId = "ye0WTciM_JJM6lcbZ";

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
        reply_to: "msm.eangadi@gmail.com",
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

  const sortedOrders = myOrders.slice().sort((a, b) => {
    const dateA = new Date(a.orderedDate);
    const dateB = new Date(b.orderedDate);
    return dateB - dateA;
  });

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phNo",
      header: "Mobile",
    },
    {
      accessorKey: "pickupLocation",
      header: "Pick up location",
    },
    {
      accessorKey: "orderedDate",
      header: "Order Date",
      enableSorting: true,
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "postalCode",
      header: "Postal Code",
    },
  ];
  const actions = ({ row, table }) => (
    <Box sx={{ display: "flow", gap: "1rem" }}>
      <FormGroup className="form__group w-50">
        <select
          className="p-2"
          value={row.status}
          onChange={(e) =>
            updateOrderStatus(row.original.id, e.target.value, row.original)
          }
          required
        >
          <option>Select Status</option>

          <option value="Hold">Hold</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </FormGroup>
      <CommonProduct product={row.original.products} />
    </Box>
  );
  const data = [...sortedOrders];

  return (
    <>
      <Helmet title="Cart"></Helmet>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {myOrders?.length === 0 ? (
                <h2 className="fs-4 text-center">No item!</h2>
              ) : (
                <>
                  <MuiTable columns={columns} data={data} actions={actions} />
                </>
              )}{" "}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Order;
