import React, { useState } from "react";
import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { db } from "../firebase.config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AllProducts() {
  const { data: productsData, loading } = useGetData("products");
  const navigate = useNavigate();

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted!");
  };

  const handleUpdateStatus = async (status, id) => {
    try {
      const productRef = doc(db, "products", id);
      const newStatus = status === 1 ? 0 : 1;
      await updateDoc(productRef, { status: newStatus });
      toast.success("Product status updated!");
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status.");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Product Action</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h4 className="py-5 text-center fw-bold">Loading.....</h4>
                ) : (
                  productsData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.imgUrl} alt="" />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td>
                        <FormGroup switch>
                          <Input
                            type="switch"
                            checked={item.status}
                            onClick={() => {
                              handleUpdateStatus(item.status, item.id);
                            }}
                          />
                        </FormGroup>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            navigate(`/dashboard/add-product?id=${item.id}`);
                          }}
                          className="btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteProduct(item.id);
                          }}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AllProducts;
