import React from 'react';
import ReactDOM from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './assets/styles/bootstraps.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import HomeScreen from './screen/HomeScreen';
import ProductScreen from './screen/ProductScreen';
import { Provider } from 'react-redux';
import store from './store';
import CartScreen from './screen/CartScreen'
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import  ShippingScreen  from "./screen/ShippingScreen"
import PrivateRoute from './component/PrivateRoute'
import PaymentScreen from './screen/PaymentScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>} >
      <Route index={true} path='/' element={<HomeScreen/>}></Route>
      <Route path='/product/:id' element={<ProductScreen/>}></Route>
      <Route path='/cart' element={<CartScreen/>}></Route>
      <Route path='/login' element={<LoginScreen/>}></Route>
      <Route path='/register' element={<RegisterScreen/>}></Route>

      {/* Private Route */}
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/shipping' element={<ShippingScreen/>}></Route>
        <Route path='/payment' element={<PaymentScreen/>}></Route>
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
