import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Container,
  Row,
  Col,
  Button,
  Input,
  Label,
  Table,
} from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";
import { getDocuments, updateDocument } from "../utils/crud";
function AddCategory(props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data: category, loading: isLoad } = useGetData("category");

  const [payload, setPayload] = useState({
    category: "",
  });
  const addCategory = async (e) => {
    e.preventDefault();
    if (payload.category === "") {
      return;
    }
    setLoading(true);

    try {
      const docRef = await collection(db, "category");
      await addDoc(docRef, {
        categoryName: payload.category,
      });
      setLoading(false);
      toast.success("Category successfully added!");
      setPayload({
        category: "",
      });
    } catch (err) {
      setLoading(false);
      toast.error("Product not added!");
    }
  };
  const [isEdit, setIsEdit] = useState(false);
  const [cat, setCat] = useState("");

  const editproduct = (data) => {
    setIsEdit(true);
    setCat(data.categoryName);
    setPayload({
      category: data.categoryName,
      id: data.id,
    });
  };
  const updateCategory = async (e) => {
    e.preventDefault();
    if (payload.category === "") {
      return;
    }
    const collectionName = "category";
    setLoading(true);
    const postData = {
      categoryName: payload.category,
    };
    const success = await updateDocument(collectionName, payload.id, postData);
    if (success) {
      setLoading(false);
      setPayload({
        category: "",
        id: "",
      });
      setIsEdit(false);
      await updateCategoryInProducts(cat, postData.categoryName);
    }
  };
  const updateCategoryInProducts = async (oldCategoryName, newCategoryName) => {
    try {
      setLoading(true);
      const products = await getDocuments("products");

      // Filter products with the old category name
      const productsToUpdate = products.filter(
        (product) => product.category === oldCategoryName
      );
      const updatePromises = productsToUpdate.map(async (product) => {
        const updatedProduct = { ...product, category: newCategoryName };
        return await updateDocument("products", product.id, updatedProduct);
      });
      // Execute all update promises
      await Promise.all(updatePromises);
      setLoading(false);
      return true; // Successfully updated products
    } catch (error) {
      console.error("Error updating products:", error);
      return false; // Failed to update products
    }
  };
  const handleCancel = () => {
    setIsEdit(false);
    setPayload({
      category: "",
      id: "",
    });
  };
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            {loading ? (
              <h4 className="py-5">Loading.......</h4>
            ) : (
              <>
                <h4 className="mb-5">Add Category</h4>
                <Form onSubmit={isEdit ? updateCategory : addCategory}>
                  <Container>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label for="category">Category</Label>
                          <Input
                            id="category"
                            name="category"
                            value={payload.category}
                            onChange={(e) =>
                              setPayload({
                                ...payload,
                                category: e.target.value,
                              })
                            }
                            placeholder="Category"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        {isEdit ? (
                          <>
                            <Button
                              color="primary"
                              style={{ marginTop: "30px" }}
                              type="submit"
                            >
                              Update Category
                            </Button>
                            <Button
                              color="primary"
                              style={{ marginTop: "30px", marginLeft: "10px" }}
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            color="primary"
                            style={{ marginTop: "30px" }}
                            type="submit"
                          >
                            Add Category
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </Form>
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Table hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {category.map((item, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{item.categoryName}</td>
                  <td>
                    <button
                      onClick={() => {
                        // navigate(`/dashboard/add-product?id=${item.id}`);
                        editproduct(item);
                      }}
                      className="btn "
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        // deleteProduct(item.id);
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    </section>
  );
}

export default AddCategory;
