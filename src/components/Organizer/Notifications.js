import React from "react";
import styled from "styled-components";
import Row from "../UI/Row";
import Column from "../UI/Column";
import { useState, useEffect } from "react";


const Notifications = (props) => {
    const [viewAll, setViewAll] = useState(false);

    const viewAllHandler = (id) => {
      setViewAll(!viewAll);
      let element = document.getElementById(id);
  
      if (element.style.maxHeight){
        element.style.maxHeight = null;
      } else {
        element.style.maxHeight = element.scrollHeight + "px";
      };
    };

  return (
    <Container>
        <NotificationSection style={props.style} className={props.className}>
            <Title>Notifications</Title>
            <Row className="max-480">
                <Column className="col-50 md">
                    <Notification>
                        <a>
                            <Avatar />
                        </a>

                        <div>
                            <span>Bougie Events</span>
                            <p>BougieFest '23 has been posponed.</p>
                        </div>
                    </Notification>
                </Column>

                <Column className="col-50 md">
                    <Notification>
                        <a>
                            <Avatar />
                        </a>

                        <div>
                            <span>Afrochella 2023</span>
                            <p>Look sharp! 11 tickets left.</p>
                        </div>
                    </Notification>
                </Column>
            </Row>

            <Row className="max-480">
                <Column className="col-25 md">
                    <Notification>
                        <a>
                            <Avatar />
                        </a>

                        <div>
                            <span>Afrochella 2023</span>
                            <p>Look sharp! 11 tickets left.</p>
                        </div>
                    </Notification>
                </Column>

                <Column className="col-25 md">
                    <Notification>
                        <a>
                            <Avatar />
                        </a>

                        <div>
                            <span>Afrochella 2023</span>
                            <p>Look sharp! 11 tickets left.</p>
                        </div>
                    </Notification>
                </Column>
            </Row>

            <ViewAll onClick={()=>{viewAllHandler("notification-list")}}>
                View all notifications 
                {!viewAll && <i className="fa fa-angle-double-down"></i>}
                {viewAll && <i className="fa fa-angle-double-up"></i>}
            </ViewAll>
        </NotificationSection>
    </Container>
  )
};

const Container = styled.div`
    margin: 0;
    padding: 0;
`;

const NotificationSection = styled.div`
    text-align: left;
`;

const Title = styled.h4`
    color: #fa8128;
    margin: 10px 0;
    
    padding-bottom: 10px;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.15); */
`;

const Notification = styled.div`
    display: flex;
    /* align-items: center; */
    margin: 12px 0;
    position: relative;
    font-size: 14px;
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;

    & > div {
      display: flex;
      flex-direction: column;
      span {
        color: blue;
      }
      p {
        color: rgba(0, 0, 0, 0.66);
      }
    }

    @media (max-width: 540px) {
        width: 100%;
    }
`;

const FeedList = styled.ul`
  margin-top: 16px;
  max-height: 200px;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  /* border: 1px solid black; */
`;

const Avatar = styled.div`
  background-image: url("/images/free.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 48px;
  height: 48px;
  margin-right: 8px;
  border: 2px solid #ddd;
  border-radius: 50%;
`;


const ViewAll = styled.a`
  color: #0a66c2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  cursor: default;
  &:hover, &.active {
    text-decoration: none;
  }
`;


export default Notifications;