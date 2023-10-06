import React, { useEffect, useState } from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Col, Row } from "reactstrap";
import "../styles/shop.css";
import products from "../assets/data/products";
import Productslist from "../components/UI/Productslist";
import ProductDetails from "./ProductDetails";
import useGetData from "../custom-hooks/useGetData";

const Shop = () => {
  //const [productsData, setProductsData] = useState(products);
  const { data: products, loading } = useGetData("products");
  const [data, setData] = useState(products);
  const { data: category, loading: isLoad } = useGetData("category");

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    const filteredProducts = products.filter(
      (item) => item.category === e.target.value
    );
    setData(filteredProducts);
    
  };

  const defaultCategory = "Tamilnadu Special";

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    const searchedProducts = products.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(searchedProducts);
  };

  useEffect(() => {
    const filteredProducts = products.filter(
      (item) => item.category === defaultCategory
    //   category[0].categoryName
    );
    setData(filteredProducts);
  }, [category])


  return (
    <>
      <Helmet title={"Shop"}></Helmet>
      {/* <CommonSection title="Shop"/> */}
    
      <section className="pt-0">
        <Container>
          <Row className="mt-5">
            {data.length === 0 ? (
              <h1 className="text-center fs-4">No products are found!</h1>
            ) : (
              <Productslist data={data} />
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Shop;
