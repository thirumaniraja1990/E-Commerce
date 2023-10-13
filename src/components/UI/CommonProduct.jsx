import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";

function CommonProduct(props) {
  const { product } = props;
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  // Calculate total amount
  const totalAmount = product?.reduce((total, item) => {
    const price = parseFloat(item.price);
    const quantity = parseInt(item.quantity);
    return total + price * quantity;
  }, 0);

  return (
    <div>
      <i className="ri-eye-fill" onClick={toggle}></i>
      <Modal size="lg" scrollable centered isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Products</ModalHeader>
        <ModalBody>
          <Table hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price/unit</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {product?.map((item, i) => (
                <tr key={item.id}>
                  <th scope="row">{i + 1}</th>
                  <td>
                    <img
                      src={item.imgUrl}
                      alt="Product"
                      style={{ width: "25px" }}
                    />
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4"></td>
                <td>
                  <strong>Total Amount:</strong>
                </td>
                <td>
                  <strong>${totalAmount}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default CommonProduct;
