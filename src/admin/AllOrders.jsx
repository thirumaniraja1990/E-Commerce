import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
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
import { doc, updateDoc } from "firebase/firestore";

const AllOrder = () => {
  const [myOrders, setMyOrder] = useState([]);
  const navigate = useNavigate();
  const { data: checkoutProducts, loading } = useGetData("checkout");
  useEffect(() => {
    setMyOrder([
      ...checkoutProducts.map((el) => {
        return {
          ...el,
          products: JSON.parse(el.products),
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

    console.log(html);

    var printWindow = window.open("", "", "height=500,width=1000");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };
  const handleCheckout = () => {
    localStorage.setItem("products", JSON.stringify(myOrders));
    navigate("/checkout", true);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const docRef = doc(db, "checkout", id);
      await updateDoc(docRef, { status: status });
    } catch (error) {
      console.log('Error updating document:', error);
    }
  }

  return (
    <>
      <Helmet title="Cart"></Helmet>
      <CommonSection title="All Orders" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {myOrders?.length === 0 ? (
                <h2 className="fs-4 text-center">No item added to the cart!</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Address</th>
                      <th>Total Amount</th>
                      <th>Print</th>
                      <th>Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders?.map((item, index) => {
                      const productCount = item.products.length + 1;
                      const totalAmount =
                        item?.products?.reduce(
                          (total, product) =>
                            total + product.quantity * product.price,
                          0
                        ) || 0;

                      return (
                        <React.Fragment key={index}>
                          <tr style={{ verticalAlign: "middle" }}>
                            <td rowSpan={productCount}>{index + 1}</td>
                          </tr>
                          {item.products.map((e, productIndex) => (
                            <tr key={productIndex}>
                              <td>
                                <img src={e.imgUrl} alt="" />
                              </td>
                              <td>{e.productName}</td>
                              <td>${e.price}</td>
                              <td>{e.quantity}</td>
                              <td>${(e.price * e.quantity).toFixed(2)}</td>
                              {productIndex === 0 && (
                                <>
                                  <td
                                    style={{ verticalAlign: "middle" }}
                                    rowSpan={productCount}
                                  >
                                    <Address
                                      details={{
                                        name: item.name,
                                        phNo: item.phNo,
                                        email: item.email,
                                        address: item.address,
                                        city: item.city,
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{ verticalAlign: "middle" }}
                                    rowSpan={productCount}
                                  >
                                    ${totalAmount.toFixed(2)}
                                  </td>
                                  <td
                                    style={{ verticalAlign: "middle" }}
                                    rowSpan={productCount}
                                  >
                                    <div onClick={() => handlePrint(item)}>
                                      <i class="ri-printer-fill"></i>
                                    </div>
                                  </td>
                                  <td
                                    style={{ verticalAlign: "middle" }}
                                    rowSpan={productCount}
                                  >
                                    <FormGroup className="form__group w-50">
                                      <select
                                        className="p-2"
                                        value={item.status}
                                        onChange={(e) => updateOrderStatus(item.id,e.target.value)}
                                        required
                                      >
                                        <option disabled>
                                          Select Category
                                        </option>

                                        <option value="Hold">Hold</option>
                                        <option value="Completed">
                                          Completed
                                        </option>
                                      </select>
                                    </FormGroup>
                                  </td>
                                  <Divider />
                                </>
                              )}
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
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
          <img src={item.imgUrl} alt="" />
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
