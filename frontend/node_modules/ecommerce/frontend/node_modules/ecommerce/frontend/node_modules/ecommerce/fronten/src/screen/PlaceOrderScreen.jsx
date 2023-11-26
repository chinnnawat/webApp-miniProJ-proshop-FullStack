import React from 'react';
import { useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import { Button,Row,Col,ListGroup,Image,Card } from 'react-bootstrap';
import CheckoutSteps from '../component/CheckoutSteps';
import {toast} from 'react-toastify';
import Message from '../component/Message';
import Loader from '../component/Loader';
import {useCreateOrderMutation} from '../slices/orderApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const cart = useSelector((state)=>state.cart)
    const [createOrder,{isLoading,error}] = useCreateOrderMutation()

    useEffect(()=>{
        if(!cart.shippingAddress.address){
            navigate('/shipping')
        }
        else if (!cart.paymentMethod){
            navigate('/patment')
        }
    },[cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async() =>{
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress : cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`)
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
            <Col md={8}>
                <ListGroup variant='flush' >
                    {/* Address */}
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address :</strong>{' '}
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode},{' '} {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>
                    {/* PaymentMethod */}
                    <ListGroup.Item>
                        <h2>PaymentMethod</h2>
                        <strong>Methode : </strong>{cart.paymentMethod}
                    </ListGroup.Item>
                    {/* OrderItems */}
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your Cart is Empty</Message>
                        ) : (
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item,index)=>(
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fluid
                                                    rounded
                                                />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item._id}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x {item.price} = ${item.qty*item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) }
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items : </Col>
                                <Col>
                                    ${cart.itemsPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping : </Col>
                                <Col>
                                    ${cart.shippingPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping : </Col>
                                <Col>
                                    ${cart.taxPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total : </Col>
                                <Col>
                                    ${cart.totalPrice}
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {error && <Message variant='danger'>{error}</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cart.cartItems.length === 0}
                                onClick={placeOrderHandler}>
                                    Place Order
                            </Button>
                            {isLoading && <Loader/>}
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        </>
    )
}

export default PlaceOrderScreen