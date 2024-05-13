import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { forgetPasswordAPI, setLoading, setLoadingMessage } from "../../actions";
import { isEmailValid } from "../../utils/middleware";


const ForgetPassword = (props) => {
    const [email, setEmail] = useState("");
    // ERRORS
    const [emailError, setEmailError] = useState("");

    const validateEmail = (value) => { 
        setEmail(value);
        let emailRes = isEmailValid(value);
        setEmailError(emailRes[1] ? emailRes[1] : "");
    }; 


    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (e.target !== e.currentTarget) {
          return;
        }
    
        const payload = {
          email: email
        };
    
        props.forgetPassword(payload);
      }

    useEffect(() => {
    }, []);

    return (
        <Container>
             <Section>
                <FormSection>
                    <Form>
                        <p>Input email you registered with to send password reset link.</p>
                        <form> 
                            <div className="inputbox-wrap">
                                <div className="inputbox">
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => validateEmail(e.target.value)}
                                        required="required" 
                                    />
                                    <span>Email</span>
                                </div>
                                {emailError && <p>{emailError}</p>}
                            </div>

                            <div className="inputbox">
                                <input 
                                    type="button" 
                                    value="submit" 
                                    onClick={handleSubmit}
                                    disabled={!email ? true : false}
                                />
                            </div>
                        </form>  
                    </Form>

                </FormSection>
            </Section>

        </Container>
    );
};

const Container = styled.div`
    padding: 0px;
    margin-top: 50px;
    height: 100vh;
    display: flex;
    justify-content: center;
`;

const Section = styled.section`
    display: flex;
    align-items: center;
    margin: auto;
    /* border: 1px solid black; */
`;

const FormSection = styled.div`
    display: flex;
    align-items: center;
    margin: auto;
`;

const Form = styled.div`
    padding: 50px;
    background: #fff;
    border-radius: 10px;
    margin: 20px;
    /* border: 1px solid green; */
    & p{
        padding: 5px 0 10px 0;
    }
    & .inputbox-wrap {
        & p {
            text-align: left;
            padding-left: 10px;
            color: red;
        }
        margin-bottom: 30px;
    }
    & .inputbox {
        height: 50px;
        padding: 0;
        /* border: 1px solid green; */
        position: relative;
        &:last-child {
            margin-bottom: 0;
        }
    }
    & input {
        position: relative;
        padding: 11px 5px;
        border-radius: 10px;
        font-size: 1.2em;
        border: 2px solid #000;
        outline: none;
        display: block;
        width: 100%;
        &:focus ~ span,
        &:valid ~ span {
            transform: translateX(-13px) translateY(-35px);
            font-size: 1em;
        }
    }

    & span {
        position: absolute;
        top: 14px;
        left: 20px;
        font-size: 1em;
        transition: 0.6s;
        font-family: sans-serif;
    }

    & [type="button"] {
        width: 100%;
        background: dodgerblue;
        color: #fff;
        border: #fff;
        &:hover {
            background: linear-gradient(45deg, greenyellow, dodgerblue);
        }
    }
    @media (max-width: 768px) {
        padding: 0 20px;
        & h1{
        font-size: 1.5em;
        }
    }
`;



const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        errors: state.appState.errors,
    }
};


const mapDispatchToProps = (dispatch) => ({
    forgetPassword: (payload) => dispatch(forgetPasswordAPI(payload)),
    closeLoader: () => {
        dispatch(setLoadingMessage(null));
        dispatch(setLoading(false));
      },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
