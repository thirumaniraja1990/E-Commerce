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

const Shop = () => {
  //const [productsData, setProductsData] = useState(products);
  const { data: products, loading } = useGetData("products");
  const [data, setData] = useState(products);
  const { data: category, loading: isLoad } = useGetData("category");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // const handleFilter = (e) => {
  //   const filterValue = e.target.value;
  //   const filteredProducts = products.filter(
  //     (item) => item.category === e.target.value
  //   );
  //   setData(filteredProducts);

  // };

  // const handleSearch = (e) => {
  //   const searchTerm = e.target.value;
  //   const searchedProducts = products.filter((item) =>
  //     item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setData(searchedProducts);
  // };

  // useEffect(() => {
  //   const filteredProducts = products.filter(
  //     (item) => item.category === category[0].categoryName
  //   );
  //   setData(filteredProducts);
  // }, [category])

  const handleFilter = (selectedOptions) => {
    const selectedCategoryValues = selectedOptions.map(
      (option) => option.value
    );
    setSelectedCategories(selectedCategoryValues);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    const searchedProducts = products.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(searchedProducts);
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

  const categoryOptions = category.map((item) => ({
    value: item.categoryName,
    label: item.categoryName,
  }));

  return (
    <>
      <Helmet title={"Shop"}></Helmet>
      <CommonSection title="Shop" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="filter__widget">
                <h5>Filter by Category:</h5>
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
            {/* <Col lg="3" md="6" className="text-end"> */}
            {/* <div className="filter__widget">
                <select>
                  <option>Sort by</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div> */}

            {/* <Col lg="3" md="6">
            <div className="filter__widget">
              <h5>Filter by Category:</h5>
              {category.map((item) => (
                <div key={item.categoryName}>
                  <label>
                    <input
                      type="checkbox"
                      value={item.categoryName}
                      checked={selectedCategories.includes(item.categoryName)}
                      onChange={handleFilter}
                    />
                    {item.categoryName}
                  </label>
                </div>
              ))}
            </div>
            </Col> */}
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          <Row>
            {data.length === 0 ? (
              <h1 className="text-center fs-4">No products are found!</h1>
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
