import {Link,useParams} from 'react-router-dom';
import {Row,Col,ListGroup,Image,Button,Card} from 'react-bootstrap'
import Message from '../component/Message'
import Loader from '../component/Loader'
import {useGetOrderDetailsQuery, 
    useGetPayPalClientIdQuery, 
    usePayOrderMutation,
    useDeliverOrderMutation
} from '../slices/orderApiSlice'
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId)
    
    const [payOrder,{isLoading: loadingPay}] = usePayOrderMutation();

    const [{isPending},paypalDispatch] = usePayPalScriptReducer();

    const {userInfo} = useSelector((state)=>state.auth)

    const {data:paypal, isLoading:loadingPayPal,error: errorPaypal} = useGetPayPalClientIdQuery()

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation()

    useEffect(()=>{
        if(!errorPaypal && !loadingPayPal && paypal.clientId){
            const loadPayPalScript = async()=>{
                paypalDispatch({
                    type: 'resetOption',
                    value: {'client-id': paypal.clientId,currency: 'USD',}
                });
                paypalDispatch({type: 'setLoadingStatus',value:'pending'})
            }
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript()
                }
            }
        }
    },[order,paypal,paypalDispatch,loadingPayPal,errorPaypal])

    function onApproveTest(data, actions){
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success('Payment Success', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        })
    }
    async function onApprove(){
        await payOrder({orderId, details : {payer:{}}});
        refetch();
        toast.success('Operation successful!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
    }
    function onError(err){
        toast.error(err.message)
    }
    function createOrder(data,actions){
        return actions.order.create({
            purchase_units:[
                {
                    amount:{
                        value: order.totalPrice
                    }
                }
            ]
        }).then((orderId)=>{
            return orderId
        })
    }

    const deliverOrderHandler = async () =>{
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Operation successful!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }

    return isLoading? <Loader/> : error ? <Message variant='danger'/> :(
        <>
            <h1>{order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name : </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email : </strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Address : </strong> 
                                {order.shippingAddress.address},{" "}{order.shippingAddress.country}
                            </p>
                            { order.isDelivered ? (
                                <Message variant='success'>
                                    Delivered on {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>
                                    Not Delivered
                                </Message>
                            ) }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method : </strong>
                                {order.paymentMethod}
                            </p>
                            { order.isPaid ? (
                                <Message variant='success'>
                                    Paid on {order.paidAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>
                                    Not Paid
                                </Message>
                            ) }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.map((item,index)=>(
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col>
                                            {item.qty} x ${item.price} = ${item.qty*item.price}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
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
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {/* PAY ORDER PLACEHOLDER */}
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}
                                    {isPending ? <Loader/> : (
                                        <div>
                                            <Button onClick={onApproveTest} style={{marginBottom:'10px'}}>Test Pay Order</Button>
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                    >
                                                        <ToastContainer />
                                                </PayPalButtons>
                                            </div>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            )}
                            {/* MARK AS DELIVERED PLACEHOLDER */}
                            {loadingDeliver && <Loader/>}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                                            Mark As Delivered
                                            <ToastContainer />
                                        </Button>
                                    </ListGroup.Item>
                                )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )

}
export default OrderScreen