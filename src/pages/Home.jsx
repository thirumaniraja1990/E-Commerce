import React from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/hero-img.png";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { filterProps, motion } from "framer-motion";
import Services from "../services/Services";
import Productslist from "../components/UI/Productslist";
import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer";
import useGetData from "../custom-hooks/useGetData";
import { where } from "firebase/firestore";

const Home = () => {
  const whereCondition = where("status", "==", 1);

  const { data: products, loading } = useGetData("products", whereCondition);
  const [data, setData] = useState(products);

  useEffect(() => {
    const filteredProducts = products.filter((item) => item.category);
    setData(filteredProducts);
  }, [products]);

  return (
    <>
      <Helmet title={"Home"}></Helmet>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                {/* <p className="heo__subtitle">Trending product</p> */}
                <h2>Make your occasion so special</h2>
                <p>
                  MSM Sweets, Savouries & Food Products started to bring
                  authentic & native special items around Tamilnadu to USA
                  residents.
                  <br />
                  We started with group of friends in the year 2020.
                  <br />
                  All the products are with no preservatives.
                </p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                  <Link to="/shop"> SHOP NOW</Link>
                </motion.button>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="heo__img">
                <img src={heroImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Services />
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title"> Trending Products</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading.....</h5>
            ) : (
              <Productslist data={data} />
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
