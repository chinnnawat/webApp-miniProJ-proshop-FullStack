import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import {notFound,errorHandler} from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cookieParser from 'cookie-parser';

// const express = require(express)
dotenv.config();
const port  = process.env.PORT || 5000 ;

connectDB(); //Connect To MongoDB

const app = express();

// Body parser middleware //Get email and password
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Cookie parser middleware
app.use(cookieParser())



app.get('/',(req,res)=>{
    res.send('API is Running...')
});

app.use('/api/products',productRoutes)
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);

app.get('/api/config/paypal',(req,res) =>res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))


app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=>console.log(`server running on port ${port}`))