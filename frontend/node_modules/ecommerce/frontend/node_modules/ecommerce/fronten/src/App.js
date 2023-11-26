import React from 'react';
import Header from './component/Header';
import { Container } from 'react-bootstrap';
import Footer from './component/Footer';
// import HomeScreen from './screen/HomeScreen';
import { Outlet } from 'react-router-dom';


const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet/>
        </Container>
      </main>
      <Footer/>
    </>
  );
};

export default App;
