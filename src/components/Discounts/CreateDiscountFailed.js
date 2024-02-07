import React from "react";
import styled from "styled-components";


const CreateDiscountFailed = () => {
    return (
        <Container>
             <Section>
                <img src="/images/icons/error.svg" />
                <p>
                    Unable to submit event.
                    Please make sure all enteries are filled and with the right data
                    and re-submit.
                </p>
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
    color: red;
    border: 1px solid red;
    border-radius: 5px;
    &>img {
        width: 50px;
    }
`;


export default CreateDiscountFailed;