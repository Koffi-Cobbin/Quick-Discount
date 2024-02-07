import React from "react";
import styled from "styled-components";


const SignupStatusMessage = (props) => {
    return (
        <Container>
             <Section>
                <span className="close-popup">&times;</span>
                {props.activate_user && (
                    <>
                    <img src="/images/icons/tick-circle.svg" />
                    <p style={{color: "green"}}>Please confirm your account registration via the link sent to your email.</p>
                    </>
                 )}
                {props.activate_user === false && (
                    <>
                    <img src="/images/icons/error.svg" />
                    <p style={{color: "red"}}>Failed to login</p>
                    </>
                 )}
            </Section>
        </Container>
    );
};

const Container = styled.div`
    padding: 0px;
    min-height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Section = styled.section`
    width: 200px;
    height: fit-content;
    margin: 0 auto;
    padding: 10px;
    position: relative;
    border: 1px solid dodgerblue;
    border-radius: 5px;
    &>img {
        width: 50px;
    }
    &>span.close-popup {
        position: absolute;
        font-size: 16px;
        top: -10px;
        right: -6.5px;
        background-color: #fff;
        border: 1px solid blue;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        font-weight: 600;
    }
`;


export default SignupStatusMessage;