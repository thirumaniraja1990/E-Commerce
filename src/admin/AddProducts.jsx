import React, { useEffect, useState } from "react";
import { Form, FormGroup, Container, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import useGetData from "../custom-hooks/useGetData";
import Select from "react-select";

const AddProducts = () => {
  const [enterTitle, setEnterTitle] = useState("");
  const [enterShortDesc, setEnterShortDesc] = useState("");
  const [enterDescription, setEnterDescription] = useState("");
  const [enterCategory, setEnterCategory] = useState([]);
  const [enterPrice, setEnterPrice] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);
  const { data: category, loading: isLoad } = useGetData("category");
  const { data: productsData } = useGetData("products");
  const [isEdit, setIsEdit] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  useEffect(() => {
    // Access query parameters

    // Do something with the query parameter value
    if (id != null) {
      setIsEdit(true);
      setEnterTitle(productsData.find((e) => e.id == id)?.productName);
      setEnterShortDesc(productsData.find((e) => e.id == id)?.shortDesc);
      setEnterDescription(productsData.find((e) => e.id == id)?.description);
      setEnterCategory(
        productsData
          .find((e) => e.id == id)
          ?.category.split(",")
          .map((e) => {
            return {
              label: e.trim(),
              value: e.trim(),
            };
          })
      );
      setEnterPrice(productsData.find((e) => e.id == id)?.price);
      setEnterProductImg(productsData.find((e) => e.id == id)?.imgUrl);
    }
  }, [productsData]);
  useEffect(() => {
    console.log("enterCategory", enterCategory);
  }, [enterCategory]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/dashboard/all-products");
  };
  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEdit) {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        productName: enterTitle,
        shortDesc: enterShortDesc,
        description: enterDescription,
        category: enterCategory.map((e) => e.value).join(", "),
        price: enterPrice,
        imgUrl: enterProductImg,
        status: 1,
      });
      setLoading(false);
      toast.success("Product successfully updated!");
      navigate("/dashboard/all-products");
      return;
    }

    try {
      const docRef = await collection(db, "products");
      const storageRef = ref(
        storage,
        `productImages/${Date.now() + enterProductImg.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, enterProductImg);

      uploadTask.on(
        () => {
          toast.error("Image not uploaded!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(docRef, {
              productName: enterTitle,
              shortDesc: enterShortDesc,
              description: enterDescription,
              category: enterCategory.map((e) => e.value).join(", "),
              price: enterPrice,
              imgUrl: downloadURL,
              status: 1,
            });
          });
        }
      );
      setLoading(false);
      toast.success("Product successfully added!");
      navigate("/dashboard/all-products");
    } catch (err) {
      setLoading(false);
      toast.error("Product not added!");
    }
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
                <h4 className="mb-5">{isEdit ? "Edit" : "Add"} Products</h4>
                <Form onSubmit={addProduct}>
                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <span>Product title</span>
                      <input
                        type="text"
                        placeholder="Enter Product Title"
                        value={enterTitle}
                        onChange={(e) => setEnterTitle(e.target.value)}
                        required
                      />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <span>Short Description</span>
                      <input
                        type="text"
                        placeholder="Enter Short Description"
                        value={enterShortDesc}
                        onChange={(e) => setEnterShortDesc(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </div>
                  <FormGroup className="form__group">
                    <span>Description</span>
                    <input
                      type="text"
                      placeholder="Description..."
                      value={enterDescription}
                      onChange={(e) => setEnterDescription(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <span>Price</span>
                      <input
                        type="number"
                        placeholder="$100"
                        value={enterPrice}
                        onChange={(e) => setEnterPrice(e.target.value)}
                        required
                      />
                    </FormGroup>
                    <Select
                      value={enterCategory}
                      isMulti
                      name="colors"
                      options={category.map((e) => {
                        return {
                          label: e.categoryName,
                          value: e.categoryName,
                        };
                      })}
                      onChange={(e) => {
                        setEnterCategory(e);
                      }}
                      className="basic-multi-select mt-4 form__group w-50"
                      classNamePrefix="select"
                    />
                  </div>
                  <div>
                    <FormGroup className="form__group">
                      <span>Product Image</span>
                      <input
                        type="file"
                        onChange={(e) => setEnterProductImg(e.target.files[0])}
                      />
                    </FormGroup>
                  </div>
                  <button className="buy__btn" type="submit">
                    {isEdit ? "Update" : "Add"} Product
                  </button>
                  {isEdit && (
                    <button
                      className="btn btn-danger ms-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AddProducts;
