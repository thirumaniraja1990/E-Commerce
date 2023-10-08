import React from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/Banner2.png";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { filterProps, motion } from "framer-motion";
import Services from "../services/Services";
import Productslist from "../components/UI/Productslist";
import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer";
import useGetData from "../custom-hooks/useGetData";
import { where } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import banner1 from "../assets/images/Banner_1.webp";
import banner2 from "../assets/images/Banner_2.webp";
import banner3 from "../assets/images/Banner_3.jpg";
import { getDocuments } from "../utils/crud";

const Home = () => {
  const whereCondition = where("status", "==", 1);

  const { data: products, loading } = useGetData("products", whereCondition);
  const [data, setData] = useState(products);

  const { data: category, loading: isLoad } = useGetData("category");
  useEffect(() => {
    const filteredProducts = products.filter((item) => item.category);
    setData(filteredProducts);
  }, [products]);
  const [bannerImg, setBannerImg] = useState([]);

  const getBannerImg = async () => {
    const response = await getDocuments("banner");
    setBannerImg(response);
  };
  useEffect(() => {
    getBannerImg();
  }, []);
  return (
    <>
      <Helmet title={"Home"}></Helmet>
      <section className='hero__section'>
        <Container>
          <Row>
            <Col lg='12'>
              <div className='hero__content'>
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  className='mySwiper'>
                  {bannerImg.map((e) => (
                    <SwiperSlide>
                      <img src={e.bannerImg} alt='' />
                    </SwiperSlide>
                  ))}
                  {/* <SwiperSlide><img src={banner2} alt="" /></SwiperSlide> */}
                </Swiper>
              </div>
            </Col>
            {/* <Col lg="6" md="6">
              <div className="hero__content">
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
            </Col> */}
          </Row>
        </Container>
      </section>
      <Services />
      {/* <section className="trending__products">
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
      </section> */}
      <section className='pt-0'>
        <Container>
          {category.map((category, index) => {
            const productsInCategory = data.filter(
              (item) => item.category === category.categoryName
            );

            return (
              <div key={index} style={{ marginBottom: "2em" }}>
                <h3 style={{ marginBottom: "1em" }}>{category.categoryName}</h3>
                {productsInCategory.length === 0 ? (
                  <p className='text-center fs-4'>No products are found!</p>
                ) : (
                  <div className='horizontal-scroll-container'>
                    <Productslist data={productsInCategory} />
                  </div>
                )}
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
};

export default Home;