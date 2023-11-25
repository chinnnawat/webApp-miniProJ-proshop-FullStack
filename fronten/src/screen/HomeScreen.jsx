import { Row, Col } from "react-bootstrap";
import Product from "../component/Product";
import {useGetProductsQuery} from '../slices/productApiSlice'
import Loader from "../component/Loader";
import Message from "../component/Message";
import { useParams } from "react-router-dom";
import Paginate from "../component/Paginate";

const HomeScreen =()=>{
    const {pageNumber} = useParams();
    const {data, isLoading, error} = useGetProductsQuery({pageNumber});

    return(
        <>
            {isLoading ? (
                <Loader/>
            ) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (<>
            <h1>Latest Product</h1>
            <Row>
                {data.products.map((product)=>(
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} >
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate pages={data.pages} page={data.page}/>
            </>)}
                
        </>
    )
}

export default HomeScreen


