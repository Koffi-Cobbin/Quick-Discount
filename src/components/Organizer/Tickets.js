import React from "react";
import styled from "styled-components";
import Ticket from "../Tickets/Ticket/Ticket";
import { DUMMY_TICKETS } from "../Assets/data";

const Tickets = (props) => {

    return (
        <Container>
            <Section>
                <Title>Tickets </Title>
                <TicketRow>
                {
                    DUMMY_TICKETS.map((ticket) => (
                    <TicketWrap>
                        <Ticket
                            key={ticket.id}
                            id={ticket.id}
                            type={ticket.type}
                            name={ticket.name}
                            location={ticket.location}
                            price={ticket.price}
                            showForm={false}
                        />
                    </TicketWrap>
                    ))
                    }
                </TicketRow>
            </Section> 
        </Container>
    );
};

const Container = styled.div``;

const Section = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
`;

const Title = styled.h4`
    color: #fa8128;
    margin: 10px 0;
    text-align: left;
`;

const TicketRow = styled.div`
    text-align: left;
`;

const TicketWrap = styled.div`
    position: relative;
    margin-bottom: 10px;
`;

export default Tickets;
