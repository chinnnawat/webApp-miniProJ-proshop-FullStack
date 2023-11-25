import { Row, Col } from "react-bootstrap";
import Product from "../component/Product";
import {useGetProductsQuery} from '../slices/productApiSlice'
import Loader from "../component/Loader";
import Message from "../component/Message";
import { useParams } from "react-router-dom";
import Paginate from "../component/Paginate";
import { Link } from "react-router-dom";
import ProductCarousel from "../component/ProductCarousel";

const HomeScreen =()=>{
    const {pageNumber, keyword} = useParams();
    const {data, isLoading, error} = useGetProductsQuery({keyword,pageNumber});

    return(
        <>
            {!keyword ? <ProductCarousel/> : (
                <Link to='/' className="btn btn-light mb-4">
                    Go Back
                </Link>
                )}
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
            <Paginate 
            pages={data.pages} 
            page={data.page}
            keyword={keyword ? keyword : ''}
            />
            </>)}
                
        </>
    )
}

export default HomeScreen


