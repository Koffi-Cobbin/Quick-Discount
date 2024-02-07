import React from "react";
import { PaystackButton } from "react-paystack";
import styled from "styled-components";
import { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";
import { verifyPaymentAPI } from "../../actions";
import { Navigate, useNavigate } from "react-router-dom";

const Paystack = (props) => {
  // Paystack configuration
  const publicKey = props.payment.public_key;
  const amount = `${parseFloat(props.payment.amount).toFixed(2) * 100}`;
  const email = props.payment.email;
  const currency = "GHS"; // Currency code
  const reference = props.payment.ref_code;

  const extraData = {
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
  };

  // Handle successful payment
  const handleSuccess = (paystack_response) => {
    console.log("Payment successful!", paystack_response);
    props.verifyPayment(paystack_response);
  };

  // Handle failed payment
  const handleFailure = (error) => {
    console.error("Payment failed!", error);
  };

  // const verify = () => {
  //   const paystack_response = {
  //     message: "Approved",
  //     redirecturl: "?trxref=QuickEvents-vXzGQPdh154tUha&reference=QuickEvents-vXzGQPdh154tUha",
  //     reference: "QuickEvents-vXzGQPdh154tUha",
  //     status: "success",
  //     trans: "2872549296",
  //     transaction: "2872549296",
  //     trxref: "QuickEvents-vXzGQPdh154tUha"
  //   };
  //   props.verifyPayment(paystack_response);
  // };

  return (
    <Container>
      <h4>
        Payment of <b>GH&#8373; {props.payment.amount}</b> for tickets
      </h4>
      <PaystackButtonWrap>
        <PaystackButton
          text="Make Payment"
          className="paystack-button"
          publicKey={publicKey}
          amount={amount}
          currency={currency}
          reference={reference}
          email={email}
          metadata={extraData} // Pass extra data as metadata
          onSuccess={handleSuccess}
          onClose={handleFailure}
        />
      </PaystackButtonWrap>
      {/* <button onClick={verify}>Verify</button> */}
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  min-height: 50vh;
  h4 {
    b {
      color: #fa8128;
    }
    margin-bottom: 20px;
  }
`;

const PaystackButtonWrap = styled.div`
  background-color: blue;
  padding: 10px;
  width: fit-content;
  color: #fff;
  border-radius: 10px;
  margin: 0 auto;
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    payment: state.userState.payment,
  };
};

const mapDispatchToProps = (dispatch) => ({
  verifyPayment: (payload) => dispatch(verifyPaymentAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Paystack);
