import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { googleAuth, signUpAPI } from "../../actions";
import { Navigate } from "react-router-dom";
import { isEmailValid, isPasswordValid, isContactValid } from "../../utils/middleware";


const Signup = (props) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    // ERRORS
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [contactError, setContactError] = useState("");


    const validateEmail = (value) => { 
        setEmail(value);
        let emailRes = isEmailValid(value);
        setEmailError(emailRes[1] ? emailRes[1] : "");
    }; 

    const validatePassword = (value) => { 
        setPassword(value);
        let paswdRes = isPasswordValid(value);
        setPasswordError(paswdRes[1] ? paswdRes[1] : "");
    }; 

    const validateContact = (value) => { 
        setContact(value);
        let contactRes = isContactValid(value);
        setContactError(contactRes[1] ? contactRes[1] : "");
    }; 

    const handleSignup = (e) => {
        e.preventDefault();
    
        if (e.target !== e.currentTarget) {
          return;
        }
    
        const payload = {
            name: username,
            email: email,
            contact: contact,
            password: password
        };

        props.signUp(payload);
      }

    const reset = () => {
        setEmail("");
        setUsername("");
        setContact("");
        setPassword("");
    };

    useEffect(() => {
        if (props.errors){
            if (props.errors.email){
                setEmailError(props.errors.email[0]);
            }
            if (props.errors.contact){
                setContactError(props.errors.contact[0]);
            }
        }
        }, [props.errors]);

    return (
        <Container>
            {(props.user || props.activate_user) && <Navigate to='/' />}
            <Section>
                <FormSection>
                    <Form>
                        <h1>Let's Bougie!</h1>
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

                            <div className="inputbox-wrap">
                                <div className="inputbox">
                                    <input 
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required="required" 
                                    />
                                    <span>Username</span>
                                </div>
                            </div>
                            
                            <div className="inputbox-wrap">
                                <div className="inputbox">
                                    <input 
                                        type="tel"
                                        value={contact}
                                        onChange={(e) => validateContact(e.target.value)} 
                                        required="required" 
                                    />
                                    <span>Contact</span>
                                </div>
                                {contactError && <p>{contactError}</p>}
                            </div>

                            <div className="inputbox-wrap">
                                <div className="inputbox">
                                    <input 
                                        type="password"
                                        value={password}
                                        onChange={(e) => validatePassword(e.target.value)} 
                                        required="required" 
                                    />
                                    <span>Password</span>
                                </div>
                                {passwordError && <p>{passwordError}</p>}
                            </div>

                            <div className="inputbox">
                                <input 
                                    type="button"
                                    disabled={!(password && email && contact)? true : false}
                                    onClick={(event) => handleSignup(event)}
                                    value="submit" 
                                />
                            </div>
                        </form>
                        <hr/>
                        {/* <Google onClick={() => props.signupWithGoogle()}>
                            <img src="/images/icons/google.svg" alt="Google"></img>
                            Sign up with Google
                        </Google> */}
                    </Form>

                </FormSection>
                <Hero>
                    <div>
                        <img src="/images/art8.png" alt="SignUp" />
                    </div>
                </Hero>
            </Section>

        </Container>
    );
};

const Container = styled.div`
    padding: 0px;
    margin-top: 50px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
`;

const Section = styled.section`
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    align-items: flex-start;
    justify-content: space-between;
    align-items: center;
    max-width: 1128px;
    margin: auto;
    /* border: 1px solid black; */
    @media (min-width: 768px) and (max-width: 1023px){
        min-height: 80%;
        width: 90%;
    } 

    @media (min-width: 1024px) {
        min-height: 80%;
        width: 70%;
    } 
`;

const FormSection = styled.div`
    width: 50%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    /* border: 1px solid black; */
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Form = styled.div`
    padding: 50px;
    background: #fff;
    border-radius: 10px;
    margin: 20px;
    /* border: 1px solid red; */
    & h1{
        font-size: 2em;
        border-left: 5px solid dodgerblue;
        padding: 10px;
        color: #000;
        letter-spacing: 5px;
        margin-bottom: 45px;
        font-weight: bold;
        padding-left: 10px;
        /* border: 1px solid blue; */
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
        padding: 20px;
        & h1{
        font-size: 1.5em;
        }
        & span {
            top: 16px;
            font-size: 13px;
        }
    }
`;

const Google = styled.button`
    display: flex;
    justify-content: center;
    background-color: #fff;
    align-items: center;
    height: 50px;
    width: 100%;
    border: 1px solid dodgerblue;
    border-radius: 10px;
    vertical-align: middle;
    z-index: 0;
    transition-duration: 167ms;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin: 10px auto;
    margin-bottom: 0;
    /* box-shadow: inset 000 1px rgb(0 0 0 / 60%), 
    inset 000 2px rgb(0 0 0 / 0%), 
    inset 000 1px rgb(0 0 0 / 0%); */
    &:hover{
        background-color: rgba(207, 207, 207, 0.25);
        color: rgba(0, 0, 0, 0.75);
    }
    @media (max-width: 768px) {
        width: 100%;
    }
`;


const Hero = styled.div`
    width: 50%;
    overflow: hidden;
    /* border: 1px solid black; */
    div {
        height: fit-content;
        width: 400px;
        padding: 50px;
        border-radius: 50%; 
        margin: 20px auto;
        background: #fff;
        border: 1px solid white;
        &>img{
            height: 400px;
            /* border: 1px solid blue; */
        }
    }
    @media (max-width: 768px) {
        display: none;
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        activate_user: state.userState.activate_user,
        errors: state.appState.errors,
    }
};

const mapDispatchToProps = (dispatch) => ({
    signUp: (payload) => dispatch(signUpAPI(payload)),
    signupWithGoogle: () => dispatch(googleAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);