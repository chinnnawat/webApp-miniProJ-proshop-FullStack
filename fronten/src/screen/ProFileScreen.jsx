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
const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const { userInfo } = useSelector((state) => state.auth);
  
    // const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  
    const [updateProfile, { isLoading: loadingUpdateProfile }] =
      useProfileMutation();
  
      useEffect(() => {
        console.log(userInfo); // ดูค่า userInfo ที่ได้
        if (userInfo) {
          setName(userInfo.name);
          setEmail(userInfo.email);
        }
      }, [userInfo]);
  
    const dispatch = useDispatch();
    const submitHandler = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        // toast.error('Passwords do not match');
        console.log('Passwords do not match')
      } else {
        try {
          const res = await updateProfile({
            _id: userInfo._id,
            name,
            email,
            password,
          }).unwrap();
          dispatch(setCredentials({ ...res }));
        //   toast.success('Profile updated successfully');
        } catch (err) {
        //   toast.error(err?.data?.message || err.error);
        console.log('error')
        }
      }
    };
  
    return (
      <Row>
        <Col md={3}>
          <h2>User Profile</h2>
  
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
  
            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
  
            <Form.Group className='my-2' controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
  
            <Form.Group className='my-2' controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
  
            <Button type='submit' variant='primary'>
              Update
            </Button>
            {loadingUpdateProfile && <Loader />}
          </Form>
        </Col>
      </Row>
    );
  };
  
  export default ProfileScreen;