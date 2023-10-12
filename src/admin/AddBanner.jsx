import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import { db, storage } from "../firebase.config";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDocument, deleteDocument, getDocuments } from "../utils/crud";

function AddBanner(props) {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    bannerImg: "",
  });
  const initialValues = {
    id: "",
    bannerImg: "",
  };
  const [enterProductImg, setEnterProductImg] = useState(null);
  const [bannerImg, setBannerImg] = useState([]);

  const handleFile = (file, img) => {
    setLoading(true);
    const storageRef = ref(storage, `productImages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track upload progress if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        setLoading(false);
        // setConf({
        //   msg: "Image uploaded error",
        //   variant: "error",
        // });
      },
      () => {
        // Upload complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setLoading(false);
          //   setConf({
          //     msg: "Image uploaded successfully",
          //     variant: "success",
          //   });
          setPayload({
            ...payload,
            [img]: downloadURL,
          });
        });
      }
    );
  };
  const onSubmit = async (e, data) => {
    submitData(e);
  };
  const getBannerImg = async () => {
    const response = await getDocuments("banner");
    setBannerImg(response);
  };
  useEffect(() => {
    getBannerImg();
  }, []);
  const submitData = async (e) => {
    e.preventDefault();
    if (payload.bannerImg === "") {
      return;
    }
    const collectionName = "banner";
    setLoading(true);
    const postData = {
      bannerImg: payload.bannerImg,
    };

    const success = await addDocument(collectionName, postData);
    if (success) {
      setLoading(false);
      getBannerImg();
      setPayload({ ...initialValues });
      //   setConf({
      //     msg: "Banner Img added successfully",
      //     variant: "success",
      //   });
    } else {
      setLoading(false);
      //   setConf({
      //     msg: "Something went wrong",
      //     variant: "error",
      //   });
    }
  };
  const deleteBanner = async (data) => {
    setLoading(true);
    const success = await deleteDocument("banner", data);
    if (success) {
      setLoading(false);
      getBannerImg();
      //   setConf({
      //     msg: "Banner deleted successfully",
      //     variant: "success",
      //   });
    } else {
      setLoading(false);
      //   setConf({
      //     msg: "Something went wrong",
      //     variant: "error",
      //   });
    }
  };
  return (
    <div>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {loading ? (
                <h4 className="py-5">Loading.......</h4>
              ) : (
                <>
                  <h4 className="mb-5">Add Banner</h4>
                  <Form onSubmit={onSubmit}>
                    <Container>
                      <Row>
                        <Col>
                          <FormGroup className="form__group">
                            <span>Banner Image</span>
                            <input
                              type="file"
                              onChange={(e) =>
                                handleFile(e.target.files[0], "bannerImg")
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <Button
                            color="primary"
                            style={{ marginTop: "30px" }}
                            type="submit"
                          >
                            Submit
                          </Button>
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
                  <th>Banner Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bannerImg.map((item, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <img
                        src={item.bannerImg}
                        alt=""
                        srcset=""
                        width={30}
                        height={30}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          deleteBanner(item.id);
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
    </div>
  );
}

export default AddBanner;
