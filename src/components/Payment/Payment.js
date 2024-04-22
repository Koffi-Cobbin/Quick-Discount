import React from "react";
import styled from "styled-components";
import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import classess from "./Payment.module.css";
import Row from "../UI/Row";
import Column from "../UI/Column";
import Paystack from "./Paystack";
import CartContext from "../../store/cart-context";
import { checkoutAPI, setUserOrder, setPayment } from "../../actions";
import { isContactValid, isEmailValid } from "../../utils/middleware";


const Payment = (props) => {
  const [email, setEmail] = useState(props.user.email);
  const [contact, setContact] = useState(props.user.contact);
  const [momoNumber, setMomoNumber] = useState(props.user.contact);
  const [username, setUsername] = useState(props.user.name);
  const [cardname, setCardName] = useState("");
  const [cardnumber, setCardNumber] = useState("");
  const [expmonth, setExpmonth] = useState("");
  const [expyear, setExpyear] = useState("");
  const [cvv, setCvv] = useState("");
  // ERRORS
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [momoContactError, setMomoContactError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [enableSubmit, setEnableSubmit] = useState(false);

  const navigate = useNavigate();

  const totalAmount = props.amount.toFixed(2);

  const validateEmail = (value) => {
    setEmail(value);
    let emailRes = isEmailValid(value);
    setEmailError(emailRes[1] ? emailRes[1] : "");
  };

  const validateContact = (value, cntType) => {
    let contactRes = isContactValid(value);
    if (cntType === "cnt") {
      setContact(value);
      console.log(1);
      setContactError(contactRes[1] ? contactRes[1] : "");
    } else {
      setMomoNumber(value);
      console.log(2);
      setMomoContactError(contactRes[1] ? contactRes[1] : "");
    }
  };

  useEffect(() => {
    const isAllEntriesFilled = async () => {
      if (username && email && contact && momoNumber ) {
        setEnableSubmit(true);
      } else {
        setEnableSubmit(false);
      }
    };

    const handleRedirect = async () => {
      if (props.payment.paid) {
        props.clearOrder()
        props.clearPayment()
        navigate("/dashboard");
      }
    };

    isAllEntriesFilled();
    handleRedirect();
  }, [username, email, contact, momoNumber, props.payment]);

  useEffect(() => {

  }, []);

  // useEffect(() => {
  //   const isAllEntriesFilled = async () => {
  //     if (
  //       username &&
  //       email &&
  //       contact &&
  //       (momoNumber || (cardname && cardnumber && expmonth && expyear && cvv))
  //     ) {
  //       setEnableSubmit(true);
  //     } else {
  //       setEnableSubmit(false);
  //     }
  //   };
  //   isAllEntriesFilled();
  //   console.log(
  //     username &&
  //       email &&
  //       contact &&
  //       (momoNumber || (cardname && cardnumber && expmonth && expyear && cvv))
  //   );
  // }, [
  //   username,
  //   email,
  //   contact,
  //   momoNumber,
  //   cardname,
  //   cardnumber,
  //   expmonth,
  //   expyear,
  //   cvv,
  // ]);

  const handleCheckout = (e) => {
    e.preventDefault();

    if (e.target !== e.currentTarget) {
      return;
    }

    const payload = {
      username: username,
      email: email,
      contact: contact,

      momoNumber: momoNumber,
      cardname: cardname,
      cardnumber: cardnumber,
      expmonth: expmonth,
      expyear: expyear,
      cvv: cvv,
    };

    props.checkout(payload);
    // payWithPayStack();
    console.log(payload);
  };

  return (
    <Wrapper>
      <Container>
        <Row>
            {props.payment ? (
            <Paystack payment={props.payment}/>
            ) : (
            <div className={classess.container}>
              <form>
                <h3 className={classess.title}>Billing Address</h3>
                <label
                  className={classess["payment-label"]}
                  htmlFor="username"
                >
                  <i className="fa fa-user"></i> Full Name
                </label>
                <input
                  className={classess["payment-input"]}
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <label htmlFor="email" className={classess["payment-label"]}>
                  <i className="fa fa-envelope"></i> Email
                </label>
                <input
                  className={classess["payment-input"]}
                  type="text"
                  id="email"
                  name="email"
                  placeholder="koffi@example.com"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  required
                />
                {emailError && (
                  <p className={classess.error}>{emailError}</p>
                )}

                <label htmlFor="contact" className={classess["payment-label"]}>
                  <i className="fa fa-phone"></i> Contact
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  className={classess["payment-input"]}
                  placeholder=""
                  value={contact}
                  onChange={(e) => validateContact(e.target.value, "cnt")}
                  required
                />
                {contactError && (
                  <p className={classess.error}>{contactError}</p>
                )}
              

            <div>
              <p>
                Total: &nbsp;{" "}
                <span className={classess.price} style={{ color: "black" }}>
                  <b>GH&#8373; {totalAmount}</b>
                </span>
              </p>
            </div>

            <input
              type="submit"
              value="Continue to checkout"
              className={`"payment-input" ${classess.btn}`}
              disabled={!enableSubmit}
              onClick={(event) => handleCheckout(event)}
            />
          </form>
        </div>
        )}
        </Row>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-family: Lato, 'Roboto', sans-serif;
  font-size: 20px;
`;

const Container = styled.div`
  text-align: left;
  width: 100%;
  /* border: 1px solid black; */
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 0;
  /* border: 1px solid black; */
  @keyframes load-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
  }

  img.spinner {
    height: 60px;
    pointer-events: none;
    animation: load-spin infinite 2s linear;
  }
`;

const MobileMoney = styled.div``;

const CreditCard = styled.div``;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    payment: state.userState.payment,
  };
};

const mapDispatchToProps = (dispatch) => ({
  checkout: (payload) => dispatch(checkoutAPI(payload)),
  clearOrder: () => dispatch(setUserOrder(null)),
  clearPayment: () => dispatch(setPayment(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
