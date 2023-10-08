import React from "react";
import ProductCard from "./ProductCard";
import ProductCardShop from "./ProductCardShop";

const ProductslistShop = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <ProductCardShop item={item} key={index} />
      ))}
    </>
  );
};

export default ProductslistShop;
