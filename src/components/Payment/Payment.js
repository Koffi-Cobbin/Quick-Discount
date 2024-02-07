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

  const cartCtx = useContext(CartContext);
  const totalAmount = `${cartCtx.totalAmount.toFixed(2)}`;

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
        cartCtx.clearCart(); 
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
        <Row className="max-768">
          <Column className="col-75">
            {props.payment ? (
            <Paystack payment={props.payment}/>
            ) : (
            <div className={classess.container}>
              <form>
                <Row className="max-480">
                  <Column className="col-50">
                    <h3>Billing Address</h3>
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
                  </Column>

                  <Column className="col-50">
                    <h3>Payment</h3>
                    <label>Payment Method</label>
                    <div className={classess["icon-container"]}>
                      <img
                        src="./images/mtn.png"
                        onClick={() => setPaymentMethod("momo")}
                      />
                      {/* <img
                        src="./images/voda.png"
                        onClick={() => setPaymentMethod("momo")}
                      />
                      <img
                        src="./images/tigo.jpg"
                        onClick={() => setPaymentMethod("momo")}
                      />
                      <i
                        className="fa fa-cc-visa"
                        style={{ color: "navy" }}
                        onClick={() => setPaymentMethod("card")}
                      ></i>
                      <i
                        className="fa fa-cc-mastercard"
                        style={{ color: "orange" }}
                        onClick={() => setPaymentMethod("card")}
                      ></i> */}
                    </div>

                    
                      {/* <>
                      <Spinner>
                        <img src="/images/icons/spinner.svg" className="spinner" alt="Loading..." />
                      </Spinner>
                      <p style={{textAlign: "center"}}>Wait for a momo prompt</p>
                      </> */}
                      <>
                      {paymentMethod === "momo" && (
                      <MobileMoney>
                        <label htmlFor="momoNumber" className={classess["payment-label"]}>
                          <i className="fa fa-phone"></i> &nbsp; Momo Contact
                        </label>
                        <input
                          type="tel"
                          id="momoNumber"
                          name="momoNumber"
                          className={classess["payment-input"]}
                          placeholder=""
                          value={momoNumber}
                          onChange={(e) =>
                            validateContact(e.target.value, "momo")
                          }
                          required
                        />
                        {momoContactError && (
                          <p className={classess.error}>{momoContactError}</p>
                        )}
                      </MobileMoney>
                    )}

                    {paymentMethod === "card" && (
                      <CreditCard>
                        <label htmlFor="cname" className={classess["payment-label"]}>Name on Card</label>
                        <input
                          type="text"
                          id="cname"
                          name="cardname"
                          className={classess["payment-input"]}
                          placeholder="Koffi Cobbin"
                          value={cardname}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />

                        <label htmlFor="ccnum" className={classess["payment-label"]}>Credit card number</label>
                        <input
                          type="text"
                          id="ccnum"
                          name="cardnumber"
                          className={classess["payment-input"]}
                          placeholder="1111-2222-3333-4444"
                          value={cardnumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />

                        <label htmlFor="expmonth" className={classess["payment-label"]}>Exp Month</label>
                        <input
                          type="text"
                          id="expmonth"
                          name="expmonth"
                          className={classess["payment-input"]}
                          placeholder="September"
                          value={expmonth}
                          onChange={(e) => setExpmonth(e.target.value)}
                          required
                        />

                        <Row>
                          <Column className="col-50">
                            <label htmlFor="expyear" className={classess["payment-label"]}>Exp Year</label>
                            <input
                              type="text"
                              id="expyear"
                              name="expyear"
                              className={classess["payment-input"]}
                              placeholder="2023"
                              value={expyear}
                              onChange={(e) => setExpyear(e.target.value)}
                              required
                            />
                          </Column>
                          <Column className="col-50">
                            <label htmlFor="cvv" className={classess["payment-label"]}>CVV</label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              className={classess["payment-input"]}
                              placeholder="352"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              required
                            />
                          </Column>
                        </Row>
                      </CreditCard>
                    )}
                    </>
                  </Column>
                </Row>

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
          </Column>

          <Column className="col-25">
            <div className={classess.container}>
              <h4>
                Cart
                <span className={classess.price} style={{ color: "black" }}>
                  <i className="fa fa-shopping-cart"></i>
                  <b>4</b>
                </span>
              </h4>
              {cartCtx.items.map((item) => (
                <p>
                  <a href="#" key={item.id}>
                    {item.name}
                  </a>{" "}
                  <span className={classess.price}>GH&#8373; {item.price}</span>
                </p>
              ))}
              <hr />
              <p>
                Total{" "}
                <span className={classess.price} style={{ color: "black" }}>
                  <b>GH&#8373; {totalAmount}</b>
                </span>
              </p>
            </div>
          </Column>
        </Row>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  min-height: 90vh;
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  text-align: left;
  margin: 0 auto;
  @media (min-width: 1024px) {
    min-width: 70%;
    min-height: 70%;
  }
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
