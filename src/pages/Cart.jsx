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
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const navigate = useNavigate()
  const cartItems2 = useSelector(state =>state.cart.cartItems)
const totalAmount = useSelector(state => state.cart.totalAmount);
const { data: cart, loading: isLoad } = useGetData("cart");
const { data: products, loading } = useGetData("products");
useEffect(() => {
  if (JSON.parse(localStorage.getItem('user'))?.uid) {
    const cartItems1 = products.filter(obj1 =>
      cart.filter(e => e.userID === JSON.parse(localStorage.getItem('user'))?.uid)
          .some(obj2 => obj2.productID === obj1.id)
    );
    
    const setCartItems1 = cartItems1.map(product => {
      const quantity = cart.filter(e => e.productID === product.id && e.userID === JSON.parse(localStorage.getItem('user'))?.uid).length;
      return { ...product, quantity };
    });
  
  setCartItems([...setCartItems1])
  }
  
}, [cart])
useEffect(() => {
if (cartItems2.length) {
  setCartItems([...cartItems2.map((e) => {
    return {
      ...e,
      quantity: 1
    }
  })])
}
}, [cartItems2])

const handleCheckout = () => {
  localStorage.setItem('products', JSON.stringify(cartItems))
  navigate('/checkout', true)
}

  return (
    <>
   <Helmet title='Cart'></Helmet>
   <CommonSection title='Shopping Cart'/>
   <section>
   <Container>
    <Row>
      <Col lg='9'>
        {
          cartItems?.length === 0 ? <h2 className='fs-4 text-center'>No item added to the cart!</h2> : 
          <table className='table bordered'>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            
           {
            cartItems?.map((item,index)=>( 
            <Tr item = {item} index={index} setCartItems={setCartItems} cartItems={cartItems}/>
            ))
           }
          </tbody>
        </table>
       }
        
      </Col>
      <Col lg='3'>
        <div>
          <h6 className='d-flex align-items-center justify-content-between'>Subtotal
          <span className='fs-4 fw-bold'>${cartItems.reduce((total, product) => total + (product.quantity * product.price), 0).toFixed(2)}</span></h6>
         
        </div>
        <p className='fs-6 mt-2'>taxes and shipping will calculate in checkout</p>
        <div>
          <button className="buy__btn w-100 " onClick={handleCheckout}>Checkout</button>
          <button className="buy__btn w-100 mt-4"><Link to='/shop'>Continue Shopping</Link></button>
        </div>
      </Col>
    </Row>
   </Container>
   </section>
   </>
  );
};

const Tr = ({item, index,  cartItems, setCartItems}) => {
  const dispatch = useDispatch()
  const deleteProduct = async () => {
    try {
    const cartQuery = query(collection(db, 'cart'), where('productID', '==', item.id));
    const querySnapshot = await getDocs(cartQuery);

    querySnapshot.forEach(async (queryDoc) => {
      const docRef = doc(db, 'cart', queryDoc.id);
      await deleteDoc(docRef);
    });

    dispatch(cartActions.deleteItem(item.productID));
    toast.error('Product removed from the Cart');
  } catch (error) {
    console.log('Error deleting product:', error);
  }
  }
  const handleAdd = () => {
    const arr = [...cartItems]
    arr[index].quantity =   arr[index].quantity + 1
    setCartItems([
      ...arr
    ])
  }
  const handleSub = () => {
    const arr = [...cartItems]
    if (arr[index].quantity == 1) {
      return
    }
    arr[index].quantity =   arr[index].quantity - 1
    setCartItems([
      ...arr
    ])
  }
return <> 
<tr>
 
<td><img src={item.imgUrl} alt="" /></td>
<td>{item.productName}</td>
<td>${item.price}</td>
<td> 
<InputGroup style={{width: '36%'}}>
    <Button color="danger" onClick={handleSub}>
     -
    </Button>
    <Input type='number' bsSize="sm" onChange={(e) => {
      if (e.target.value > 0) {
        const arr = [...cartItems]
      arr[index].quantity =   e.target.value
      setCartItems([
        ...arr
      ])
      }
      
    }} value={item.quantity} placeholder="Quantity" />
    <Button color="success" onClick={() => handleAdd()}>
     +
    </Button>
  </InputGroup>
  </td>
<td><motion.i whileHover={{scale:1.2}} onClick={deleteProduct} className="ri-delete-bin-line"></motion.i></td>
</tr></>
}
export default Cart