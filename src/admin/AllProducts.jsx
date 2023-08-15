import React, { useState } from "react";
import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { db } from "../firebase.config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import Pagination from "react-pagination-js";
// import "react-pagination-js/dist/styles.css";
import Switch from "@mui/material/Switch";
import { InputGroup, Button } from "reactstrap";

function AllProducts() {
  const { data: productsData, loading } = useGetData("products");
  const navigate = useNavigate();
  const label = { inputProps: { "aria-label": "Switch demo" } };
  /* const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; */

  /* const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productsData.slice(indexOfFirstItem, indexOfLastItem);
 */
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

  const updateProductStatus = async (id, status) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, { productstatus: status });
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };

  /* const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 */

  return (
    <section>
      <Container>
        <Row>
          <h4 className="mb-5">All Products</h4>
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
        {/*  <Pagination
    currentPage={currentPage}
    totalSize={productsData.length}
    sizePerPage={itemsPerPage}
    onPageChange={handlePageChange}
  /> */}
      </Container>
    </section>
  );
}

export default AllProducts;
