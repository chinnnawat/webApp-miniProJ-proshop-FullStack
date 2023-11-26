import React from 'react'
import { useState, useEffect } from 'react'
import {Link, useLocation,useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Form, Button,Row,Col} from 'react-bootstrap'
import FormContainer from '../component/Formcontainer'
import Loader from '../component/Loader'
import{useRegisterMutation} from'../slices/userApiSlice'
import{setCredentials} from'../slices/authSlice'
import { toast } from 'react-toastify'

const RegisterScreen = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register,{isLoading}] = useRegisterMutation();
    const {userInfo} = useSelector((state)=>state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/'

    useEffect(()=>{
        if(userInfo){
            navigate(redirect)
        }
    },[userInfo,redirect,navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password!==confirmPassword){
            toast.error('Passwords do not match');
            return;
        }
        else{
            try {
                const res = await register({name,email,password}).unwrap();
                dispatch(setCredentials({...res,}));
                navigate(redirect)
            } catch (err) {
                toast.error(err?.data.message || err.error)
            }
        }
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            <Form onSubmit={submitHandler} >
                {/* Name */}
                <Form.Group controlId='name' className='my-3' >
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                {/* Email */}
                <Form.Group controlId='email' className='my-3' >
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                {/* Password */}
                <Form.Group controlId='password' className='my-3' >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                {/* Confirm Password */}
                <Form.Group controlId='confirmPassword' className='my-3' >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                
                <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
                    Register
                </Button>

                { isLoading && <Loader/>}

            </Form>

            <Row className='py-3'>
                <Col>
                    Already an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                    Login</Link>
                </Col>
            </Row>

        </FormContainer>
    )
}
export default RegisterScreen
