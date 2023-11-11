import React from 'react'
import { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Message from '../component/Message'
import Loader from '../component/Loader'
import { useProfileMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'
const ProFileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    useEffect(()=>{
        if (userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    },[userInfo.name, userInfo.email]);

    const submitHandler = (e) =>{
        e.preventDefault();
        console.log('submitHandler');
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e)=>setName(e.target.value)}></Form.Control>
                    </Form.Group>
                </Form>
            </Col>
            <Col md={9}>Column</Col>
        </Row>
    )
}
export default ProFileScreen