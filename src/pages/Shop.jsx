import React, { useEffect, useState } from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Col, Row } from "reactstrap";
import "../styles/shop.css";
import products from "../assets/data/products";
import Productslist from "../components/UI/Productslist";
import ProductDetails from "./ProductDetails";
import useGetData from "../custom-hooks/useGetData";
import ProductslistShop from "../components/UI/ProdctListShop";
import Select from "react-select"; // Import react-select
import { useHistory, useLocation } from "react-router-dom";

const Shop = () => {
  //const [productsData, setProductsData] = useState(products);
  const { data: products, loading } = useGetData("products");
  const [data, setData] = useState(products);
  const { data: category, loading: isLoad } = useGetData("category");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has("category")) {
      const category = queryParams.get("category");
      setSelectedCategories([category]);
    }
  }, [location.search]);
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    const searchedProducts = products.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(searchedProducts);
  };

  const handleFilter = (selectedOptions) => {
    const selectedCategoryValues = selectedOptions.map(
      (option) => option.value
    );

    // Check if "All" is selected
    if (selectedCategoryValues.includes("All")) {
      setSelectedCategories(category.map((item) => item.categoryName)); // Set all categories
    } else {
      setSelectedCategories(selectedCategoryValues); // Set selected categories
    }
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      // If no categories selected, show all products

      setData(products);
    } else {
      // Filter products based on selected categories
      const filteredProducts = products.filter((item) =>
        selectedCategories.includes(item.category)
      );
      setData(filteredProducts);
    }
  }, [selectedCategories, products]);

  const categoryOptions = [
    ...category.map((item) => ({
      value: item.categoryName,
      label: item.categoryName,
    })),
    { label: "All", value: "All" }, // Add "All" option
  ];
  return (
    <>
      <Helmet title={"Shop"}></Helmet>
      {/* <CommonSection title='Shop' /> */}
      <section>
        <Container>
          <Row>
            <p>Filter by Category</p>
            <Col lg='6' md='6'>
              <div className='filter__widget'>
                <Select
                  isMulti // Enable multi-select
                  options={categoryOptions} // Pass category options
                  value={categoryOptions.filter((option) =>
                    selectedCategories.includes(option.value)
                  )} // Set selected values
                  onChange={handleFilter} // Handle selection changes
                />
              </div>
            </Col>

            <Col lg='6' md='12'>
              <div className='search__box'>
                <input
                  type='text'
                  placeholder='Search...'
                  onChange={handleSearch}
                />
                <span>
                  <i className='ri-search-line'></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className='pt-0'>
        <Container>
          <Row>
            {data.length === 0 ? (
              <h1 className='text-center fs-4'>No products are found!</h1>
            ) : (
              <ProductslistShop data={data} />
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Shop;
