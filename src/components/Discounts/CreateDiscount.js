import React from "react";
import styled from "styled-components";
import DiscountForm from "./DiscountForm";


const CreateDiscount = (props) => {
    return (
        <Container>
            <Content>
                <DiscountForm />
            </Content>
        </Container>
    )
};

const Container = styled.div`
    max-width: 100%;
    margin-top: 50px;
    padding: 20px 0;
`;

const Content = styled.div`
    padding: 20px 0;
    box-shadow: 0 2px 2px 2px rgba(0,0,0,0.1);
    @media (min-width: 768px) {
        width: 60%;
        margin: 0 auto;
    }
    @media (max-width: 530px) {
        width: 100%;
        margin-bottom: 10px;
        padding-top: 1px;
        display: ${props => props.display};
    }
`;


export default CreateDiscount;