import React, { useEffect, useState } from 'react'
import { Container,Row,Col } from 'reactstrap'
import '../styles/dashboard.css'
import useGetData from '../custom-hooks/useGetData'

const Dashboard = () => {

const {data: products} = useGetData('products')
const {data: users} = useGetData('users')
const {data: checkout} = useGetData('checkout')
const [product, setProduct] = useState([])
useEffect(() => {
  setProduct([...checkout.map((e) => {
    return {
      ...e,
      products: JSON.parse(e.products)
    }
  })])
 
  const result = checkout.map((e) => {
    return {
      ...e,
      products: JSON.parse(e.products)
    };
  }).reduce((acc, obj) => {
    if (Array.isArray(obj.products)) {
      const productTotal = obj.products.reduce((sum, product) => {
        return sum + Number(product.price) * Number(product.quantity);
      }, 0);
      console.log(productTotal);
      return acc + productTotal;
    }
    return acc;
  }, 0);
  }, [checkout])

  return (
    <>
    <section>
    <Container>
      <Row>
        <Col className="lg-3" > 
        <div className="revenue__box">
          <h5>Total Sales</h5>
          <span>
          {checkout.map((e) => {
    return {
      ...e,
      products: JSON.parse(e.products)
    };
  }).reduce((acc, obj) => {
    if (Array.isArray(obj.products)) {
      const productTotal = obj.products.reduce((sum, product) => {
        return sum + Number(product.price) * Number(product.quantity);
      }, 0);
      return acc + productTotal;
    }
    return acc;
  }, 0)}</span>
          </div>
          </Col>
          <Col className="lg-3" > 
        <div className="order__box">
          <h5>Total Orders</h5>
          <span>{checkout.length  }</span>
          </div>
           </Col>
           <Col className="lg-3" > 
        <div className="products__box">
          <h5>Total Products</h5>
          <span>{products.length}</span>
          </div>
          </Col>
          <Col className="lg-3" > 
           <div className="users__box">
          <h5>Total Users</h5>
          <span>{users.length}</span>
          </div>
          </Col>
      </Row>
    </Container>
  </section>
  </>
  );
}

export default Dashboard;