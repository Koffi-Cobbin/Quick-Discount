import React from "react";
import { PaystackButton } from "react-paystack";
import styled from "styled-components";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyPaymentAPI, 
  setLoadingMessage, 
  setCreateDiscountStatus,
  setLoading,
  setPayment
 } from "../../actions";
import * as messages from "../../utils/messages";


const Paystack = (props) => {
  const navigate = useNavigate();

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

  useEffect(() => {
    if (props.payment.paid) {
      props.showLoader();
      props.showSuccessMessage(messages.CREATE_DISCOUNT_SUCCESS_MESSAGE);
      console.log("PAYMENT VERIFIED");
      
      // clear payment from local storage if payment is made to allow for adding new discounts.
      props.clearPayment();

      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);   
    };
  }, [props.payment]);


  return (
    <Container>
      <h4>
        Payment of <b>GH&#8373; {props.payment.amount}</b> for {props.package_type} package.
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
  margin: 0 auto;
  h4 {
    b {
      color: #fa8128;
    }
    margin-bottom: 20px;
  }
`;

const PaystackButtonWrap = styled.div`
  padding: 10px;
  width: fit-content;
  color: #fff;
  border: 3px solid blue;
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
  showLoader: () => dispatch(setLoading(true)),
  verifyPayment: (payload) => dispatch(verifyPaymentAPI(payload)),
  clearPayment: () => dispatch(setPayment(null)),
  showSuccessMessage: (message) => dispatch(setLoadingMessage(message)),
  resetCreateDiscountStatus: () => dispatch(setCreateDiscountStatus(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Paystack);
