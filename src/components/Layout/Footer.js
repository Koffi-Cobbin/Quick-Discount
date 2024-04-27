import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { isEmailValid } from "../../utils/middleware";


const Footer = (props) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

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
            name: username,
            email: email,
            message: message
        };

        props.sendMessage(payload);
        reset();
      }

    const reset = () => {
        setEmail("");
        setUsername("");
        setMessage("");
    };

    useEffect(() => {
        if (props.errors){
            if (props.errors.email){
                setEmailError(props.errors.email[0]);
            }
        }
    }, [props.errors]);

    return (
        <FooterSection>
            <Layout>
                <LeftSide>
                    <h3><b>Sitemap</b></h3>
                    <p>Quick links to all pages</p>
                    <p><a href="/">Home</a></p>                    
                    <p><a href="/discounts">Discounts</a></p>
                    <p><a href="/help">Help</a></p>
                    <p><a href="/signup">Sign up</a></p>
                    <p><a href="/post">Post</a></p>                   
                </LeftSide>

                <Main>
                    <h3><b>Let's Vybe</b></h3>
                    <p><a href="/">Twitter / X</a></p>                    
                    <p><a href="/">Instagram</a></p>
                    <p><a href="/">Facebook</a></p>
                    <p><a href="/">YouTube</a></p>
                    <p><a href="/">Customer Support</a></p>
                </Main>

                <RightSide>                 
                    <div className="footer-logo">
                        <img src="/images/logo-w.png" alt="QuickDiscount" />
                    </div>
                    <p>Ablekuma-Pokuase, Accra</p>
                    <p>Greater Accra Region</p>
                    <p>Call Us: +233559553056</p>
                    <p>or <a href="mailto:admin@bestmall.com">Leave a mail</a></p>
                </RightSide>
            </Layout>
            <Copyright>
                <p className="text-center">Copyright © 2024 <a href="/" className="text-center">QuickDiscountGhLtd</a>. All rights reserved.</p>
                <p className="text-center">Designed by <a href="#" className="text-center">Koffi Cobbin</a></p>
            </Copyright>
        </FooterSection>
    )
};

const FooterSection = styled.div`
    margin-top: 10px;
    background-color:  #67309b;
    color: white;
    padding: 10px;
    margin-bottom: 0;
    font-family: Inter, 'Roboto', sans-serif;
    font-size: 14px;
    @media (max-width: 768px) {
    }
`;

const Layout = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    text-align: left;
    h3 {
        color: #fff;
        padding-bottom: 10px;
    }
    p {
        /* font-size: 14px; */
        padding: 1px;
        line-height: 1.5;
        a {
            text-decoration: none;
            color: white;
        }
    }
    @media (min-width: 768px) {
        width: 80%;
        margin: 20px auto;
    }
`;

const LeftSide = styled.div`
    width: 30%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Main = styled.div`
    width: 30%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const RightSide = styled.div`
    width: 30%;
    & .footer-logo{
        margin-bottom: 50px;
        &>img{
            width: 200px;
        }        
    }
    @media (max-width: 768px) {
        width: 100%;
    }
`;


const FormSection = styled.div`
    width: fit-content;
    box-sizing: border-box;
    display: flex;
    justify-content: left;
    align-items: center;

    border: 1px solid #fff;
    border-radius: 10px;
    padding-top: 5px;
    @media (max-width: 768px) {
    }
`;


const Form = styled.div`
    border-radius: 10px;
    margin: 20px;
  
    & .inputbox-wrap {
        & p {
            text-align: left;
            padding-left: 10px;
            color: #fb9a52;
        }
        margin-bottom: 30px;
    }
    & .inputbox {
        height: 50px;
        padding: 0;
        position: relative;
        &:last-child {
            margin-bottom: 0;
        }
    }
    & input {
        position: relative;
        padding: 11px 5px;
        border-radius: 10px;
        /* font-size: 1.2em; */
        color: #4a4a4a;
        outline: none;
        display: block;
        width: 100%;
        background-color: #fff;
        &:focus ~ span,
        &:valid ~ span {
            transform: translateX(-13px) translateY(-35px);
            /* font-size: 1em; */
            color: #fff;
        }
    }

    & span {
        position: absolute;
        top: 14px;
        left: 20px;
        transition: 0.6s;
        color: #999;
    }

    & [type="button"] {
        width: 100%;
        background: #fb9a52;
        color: #fff;
        border: #fff;
        &:hover {
            background: linear-gradient(45deg, #fb9a52, #fa8128);
        }
    }

    & .textbox {
        width: inherit;
        display: flex;
        justify-content: left;
        margin-bottom: 10px;
        flex-direction: column;        

        label {display: block;}

        .textinput {
            border-radius: 10px;
            background-color: #fff;
            /* border: 2px solid #000; */
            display: block;
            padding: 5px;
            color: #4a4a4a;
        }
    }

    @media (max-width: 768px) {
        /* padding: 20px; */
        & span {
            top: 16px;
            /* font-size: 13px; */
        }
    }
`;


const Copyright = styled.div`
    margin-top: 30px;
    p {
        /* font-size: 13px; */
        margin: 10px auto;
        line-height: 1.5;
        .text-center {
            color: white;
            text-decoration: none;
            margin: 1 2px;
            padding: 5px;
            font-weight: 600;
        }
    }
`;

const mapStateToProps = (state) => {
    return {
        categories: state.discountState.categories,
    }
  };
  
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);