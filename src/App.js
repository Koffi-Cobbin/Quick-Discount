import React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import styled from "styled-components";

import "@fontsource-variable/inter"; // Defaults to wght axis
import "@fontsource-variable/inter/wght.css"; // Specify axis

import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Layout/Nav/Navbar";
import SideNav from "./components/Layout/Nav/SideNav";
import Home from "./components/Home/Home";
import Discounts from "./components/Discounts/Discounts";
import CreateDiscount from "./components/Discounts/CreateDiscount"; 
import DiscountDetail from "./components/Discounts/DiscountDetail";
import UpdateDiscount from "./components/Discounts/UpdateDiscount";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import ForgetPassword from "./components/Auth/ForgetPassword";
import Loading from "./components/Shared/Loading";
import Footer from "./components/Layout/Footer";
import CartProvider from "./store/CartProvider";
import LikesProvider from "./store/LikesProvider";
import WishlistProvider from "./store/WishlistProvider";
import Cart from "./components/Cart/Cart";
import Profile from "./components/User/Profile";
import OrganizerDashboard from "./components/Organizer/OrganizerDashboard";
import Payment from "./components/Payment/Payment";
import Logout from "./components/Auth/Logout";
import Help from "./components/Help/Help";
import TermsAndConditions from "./components/Discounts/TermsAndConditions";
import { getUserAuth, getDiscountsAPI } from "./actions";
import Protected from "./ProtectedRoute";

import Test from "./components/Tests/Test";


function App(props) {
  const { getUserAuth, getDiscounts } = props;
  const [scrollTop, setScrollTop] = useState(0);
  const [openNav, setOpenNav] = useState(false);
  const [cartIsShown, setCartIsShown] = useState(false);

  useEffect(() => {
    const handleScroll = (event) => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    getUserAuth();
    getDiscounts();
  }, [getUserAuth, getDiscounts]);

  const openSideNav = () => {
    setOpenNav(true);
  };

  const closeSideNav = () => {
    setOpenNav(false);
  };

  const scrollUp = () => {
    const element = document.getElementById("app");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  return (
  <CartProvider>
      <LikesProvider>
      <WishlistProvider>
      <div className="App" id="app">
        <Router>
          {cartIsShown && <Cart onClose={hideCartHandler} />}
          <ScrollToTop>
            <Routes>
            <Route
              exact
              path="/"
              element={[
                <Navbar
                  sidenav={openSideNav}
                  onShowCart={showCartHandler}
                  homeSearch={true}
                />,
                <Home />,
              ]}
            />

            {["/discounts/cat/:catId", "/discounts"].map((path, index) => (
              <Route
                path={path}
                key={index}
                element={[
                  <Navbar
                    sidenav={openSideNav}
                    onShowCart={showCartHandler}
                    style={{}}
                  />,
                  <Discounts />
                ]}
              />
            ))}

            <Route
              path="/discounts/:discountId"
              element={[
                <Navbar
                  sidenav={openSideNav}
                  onShowCart={showCartHandler}
                  style={{}}
                />,
                <DiscountDetail />,
              ]}
            />

            <Route
              path="/discounts/add"
              element={[
                <Protected user={props.user}>
                  <Navbar
                  sidenav={openSideNav}
                  onShowCart={showCartHandler}
                  />,
                  <CreateDiscount />
                </Protected>
              ]}
            />

            <Route
              path="/discounts/update/:discountId"
              element={[
                <Navbar
                  sidenav={openSideNav}
                  onShowCart={showCartHandler}
                />,
                <UpdateDiscount />,
              ]}
            />

            <Route
              path="/payment"
              element={[
                  <Navbar
                    sidenav={openSideNav}
                    onShowCart={showCartHandler}
                  />,
                  <Payment />
              ]}
            />

            <Route
              path="/dashboard"
              element={[
                <Protected user={props.user}>
                  <Navbar
                    sidenav={openSideNav}
                    onShowCart={showCartHandler}
                  />,
                  <Profile />
                </Protected>
              ]}
            />

            <Route
              path="/organizer-dashboard"
              element={[
                <Protected user={props.user}>
                  <Navbar
                    sidenav={openSideNav}
                    onShowCart={showCartHandler}
                  />,
                  <OrganizerDashboard />
                </Protected>
              ]}
            />

            <Route
              path="/login"
              element={[
                <Navbar
                  sidenav={openSideNav}
                />,
                <Login />,
              ]}
            />

            <Route
              path="/signup"
              element={[
                <Navbar
                  sidenav={openSideNav}
                />,
                <Signup />,
              ]}
            />

            <Route
              path="/logout"
              element={[
                <Navbar
                  sidenav={openSideNav}
                />,
                <Logout />,
              ]}
            />

            <Route
              path="/forgetpassword"
              element={[
                <Navbar
                  sidenav={openSideNav}
                />,
                <ForgetPassword />,
              ]}
            />

            {["/help/:secId", "/help"].map((path, index) => (
            <Route
              path={path}
              key={index}
              element={[
                <Navbar
                  sidenav={openSideNav}
                />,
                <Help />,
              ]}
            />
            ))}

            <Route
              path="/terms"
              element={[
                <Navbar
                  sidenav={openSideNav}
                />,
                <TermsAndConditions />,
              ]}
            />,

            <Route
              exact
              path="/test"
              element={[
                <Navbar
                  sidenav={openSideNav}
                />,
                <Test />
              ]}
              />
          </Routes>
          </ScrollToTop>
          {
            openNav && (
              <SideNav isOpen={openNav} close={closeSideNav} onShowCart={showCartHandler}/>
            )
          }

        {props.loading && <Loading />}

        </Router>

        <Footer />

        <ScrollToTopButton
          style={{ display: scrollTop > 100 ? "flex" : "none" }}
          onClick={scrollUp}
        >
          <img src="/images/icons/up-arrow-w.svg" alt="Up" />
        </ScrollToTopButton>
      </div>
      </WishlistProvider>
      </LikesProvider>
    </CartProvider>
  );
}

const ScrollToTopButton = styled.button`
  /* Fixed positioning takes it fully out of document flow —
     eliminates the phantom space that 'sticky + float' was
     creating below the footer. */
  position: fixed;
  bottom: 24px;
  right: 20px;
  height: 40px;
  width: 40px;
  border: none;
  border-radius: 50%;
  background-color: #fa8128;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(250, 129, 40, 0.4);
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #e07010;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(250, 129, 40, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  img {
    height: 20px;
    width: 20px;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    loading: state.appState.loading,
    loading_message: state.appState.loading_message,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
  getDiscounts: () => dispatch(getDiscountsAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);