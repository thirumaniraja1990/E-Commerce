import React, { useEffect, useState } from 'react'
import '../styles/cart.css'
import Helmet from '../components/Helmet/Helmet'
import CommonSection from '../components/UI/CommonSection'
import { Container,Row,Col, InputGroup, Button, Input } from 'reactstrap'
import { motion } from 'framer-motion'
import { cartActions } from '../redux/slices/cartSlice'
import { useSelector,useDispatch} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import useGetData from '../custom-hooks/useGetData'
import Address from '../components/UI/CommonAddress'
import { Divider, formControlClasses } from '@mui/material'
import { firestore } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
const Order = () => {
  const [myOrders, setMyOrder] = useState([])
  const navigate = useNavigate()
const { data: checkoutProducts, loading } = useGetData("checkout");
useEffect(() => {
  

setMyOrder(
  checkoutProducts
    .filter((e) => e.uid === JSON.parse(localStorage.getItem('user')).uid)
    .map((el) => {
      const orderedDate = Timestamp.fromDate(new Date(el.orderedDate?.seconds * 1000)).toDate();
      console.log(orderedDate);
      const formattedDate = orderedDate.toLocaleString(); // Adjust the date formatting as per your requirements
      console.log(formattedDate);
      return {
        ...el,
        products: JSON.parse(el.products),
        orderedDate: formattedDate,
      };
    })
);


}, [checkoutProducts])

const handleCheckout = () => {
  localStorage.setItem('products', JSON.stringify(myOrders))
  navigate('/checkout', true)
}

  return (
    <>
   <Helmet title='Cart'></Helmet>
   <CommonSection title='My Orders'/>
   <section>
   <Container>
    <Row>
      <Col lg='12'>
        {
          myOrders?.length === 0 ? <h2 className='fs-4 text-center'>No item added to the cart!</h2> : 
          <table className='table bordered'>
          <thead>
            <tr>
            <th>S.No</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Address</th>
              <th>Total Amount</th>
              <th>Ordered Date</th>
            </tr>
          </thead>
          <tbody>
          {myOrders?.map((item, index) => {
      const productCount = item.products?.length +1;
      const totalAmount = item?.products?.reduce((total, product) => total + product.quantity * product.price, 0) || 0;

      return (
        <React.Fragment key={index}>
          <tr style={{ verticalAlign: "middle" }}>
            <td rowSpan={productCount}>{index + 1}</td>
          </tr>
          {item.products?.map((e, productIndex) => (
            <tr key={productIndex}>
              <td>
                <img src={e.imgUrl} alt="" />
              </td>
              <td>{e.productName}</td>
              <td>${e.price}</td>
              <td>{e.quantity}</td>
              <td>${e.price * e.quantity}</td>
              {productIndex === 0 && (
                <>
           
            <td style={{ verticalAlign: "middle" }} rowSpan={productCount}><Address details={{name: item.name, phNo: item.phNo, email: item.email, address: item.address, city:item.city}}/></td>
            <td style={{ verticalAlign: "middle" }} rowSpan={productCount}>
              ${totalAmount.toFixed(2)}
            </td>
            <td style={{ verticalAlign: "middle" }} rowSpan={productCount}>
              {item.orderedDate === 'Invalid Date' ? '-' : item.orderedDate}
            </td>
            <Divider/>
          </>
          )}
            </tr>
          ))}
          
        </React.Fragment>
      );
    })}
          </tbody>
        </table>
       }
        
      </Col>
      
    </Row>
   </Container>
   </section>
   </>
  );
};

const Tr = ({item, index,  myOrders, setMyOrder}) => {
  const dispatch = useDispatch()
  
return <> 
<tr>
 
<td><img src={item.imgUrl} alt="" /></td>
<td>{item.productName}</td>
<td>${item.price}</td>
<td> 
{item.quantity}
  </td>
<td></td>
</tr></>
}
export default Order