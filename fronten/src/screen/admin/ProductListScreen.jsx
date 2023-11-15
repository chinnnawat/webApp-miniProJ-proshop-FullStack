import React from 'react'
import { LinkContainer } from 'react-router-bootstrap';
import { Table,Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../component/Message'
import Loader from '../../component/Loader';
import { useGetProductsQuery, useCreateProductMutation } from '../../slices/productApiSlice'
import {toast, ToastContainer} from 'react-toastify'

const ProductListScreen = () => {
    const {data: products, isLoading, error,refetch} = useGetProductsQuery();
    console.log(products)

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const deleteHandler = (id) => {
        console.log('delete', id)
    }

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product ?')){
            try {
                await createProduct();
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
    <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-end'>
                <Button className='btn-sm m-3' onClick={createProductHandler} >
                    <FaEdit/> Create Product
                </Button>
            </Col>
        </Row>
        {loadingCreate && <Loader/>}
        {isLoading ? <Loader/> : 
        error ? 
        <Message>
            {error}
        </Message> :
        (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product)=>(
                            <tr key={ product._id }>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit/>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={ () => deleteHandler(product._id) }>
                                        <FaTrash style={{color : 'white'}}/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        )
        }
    </>
    );
}

export default ProductListScreen