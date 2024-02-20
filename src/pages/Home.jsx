import React from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/Banner2.png";
import service from "../assets/images/service.jpeg";
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
import RunningText from "../components/RunningText";

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
      <RunningText />
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="12">
              <div className="hero__content">
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {bannerImg.map((e) => (
                    <SwiperSlide>
                      <img src={e.bannerImg} alt="" />
                    </SwiperSlide>
                  ))}
                  {/* <SwiperSlide><img src={banner2} alt="" /></SwiperSlide> */}
                </Swiper>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <Services /> */}
      <section className="image__section">
        <Container>
          <Row>
            <Col lg="12">
              <img src={service} alt="" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="12">
              <div className="hero__content">
                {category.map((categoryItem, index) => (
                  <div key={index} style={{ marginBottom: "2em" }}>
                    <div className="category-header">
                      <h3 style={{ marginBottom: "1em" }}>
                        {categoryItem.categoryName}
                      </h3>
                      <div className="view-all-button">
                        <Link
                          to={{
                            pathname: "/shop",
                            search: `?${new URLSearchParams({
                              category: categoryItem.categoryName,
                            }).toString()}`,
                          }}
                        >
                          {" "}
                          View All
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Swiper
                        navigation={true}
                        modules={[Navigation]}
                        className="categorySwiper"
                        // slidesPerView={4}
                        spaceBetween={10}
                        breakpoints={{
                          320: {
                            slidesPerView: 2, // Adjust this as needed
                          },
                          640: {
                            slidesPerView: 2, // Adjust this as needed
                          },
                          768: {
                            slidesPerView: 2, // Adjust this as needed
                          },
                          1024: {
                            slidesPerView: 4,
                          },
                          // Add more breakpoints as needed
                        }}
                      >
                        {data.map((product, productIndex) => {
                          if (
                            product.category.includes(categoryItem.categoryName)
                          ) {
                            return (
                              <SwiperSlide key={productIndex}>
                                <Productslist data={[product]} />
                              </SwiperSlide>
                            );
                          }
                          return null;
                        })}
                      </Swiper>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
