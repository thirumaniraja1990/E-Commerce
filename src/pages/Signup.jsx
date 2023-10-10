import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.config";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.config";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const storageRef = ref(storage, `images/${Date.now() + username}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(user, {
              displayName: username,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName: username,
              email,
              photoURL: downloadURL,
              isAdmin: false,
            });
          });
        }
      );

      setLoading(false);
      toast.success("Account created");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <Helmet title="Signup"></Helmet>
      <CommonSection />
      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loding.....</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Signup </h3>
                <Form className="auth__form" onSubmit={signUp}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="email"
                      value={email}
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      value={password}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </FormGroup>
                  <button className="buy__btn auth__btn">
                    Create an Account
                  </button>
                  <p>
                    Already have an account ? <Link to="/login"> Login</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Signup;
