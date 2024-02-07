import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";


const Rightside = (props) => {
  const [viewAll, setViewAll] = useState(false);

  const viewAllHandler = (id) => {
    setViewAll(!viewAll);
    let element = document.getElementById(id);
    let section = document.getElementById("user-notifications");
    section.scrollIntoView({ behavior: 'smooth' });

    if (element.style.maxHeight){
      element.style.maxHeight = null;
    } else {
      element.style.maxHeight = element.scrollHeight + "px";
    };
  };

  return (
      <Container>
          <Notification id="user-notifications">
              <Title>
                  <h2>Notifications</h2>
                  <img src="/images/icons/feed-icon.svg" alt="" />
              </Title>

              <FeedList id="notification-list">
                {props.notifications ? (
                  <li>
                      <a>
                          <Avatar />
                      </a>

                      <div>
                          <span>Bougie Events</span>
                          <p>BougieFest '23 has been posponed.</p>
                      </div>
                  </li>
                ) : (
                  <Message>You have no notifications.</Message>
                )}
              </FeedList>

              {props.notifications && 
              <ViewAll onClick={()=>{viewAllHandler("notification-list")}}>
                  View all notifications 
                  {!viewAll && <i className="fa fa-angle-double-down"></i>}
                  {viewAll && <i className="fa fa-angle-double-up"></i>}
              </ViewAll>
              }
          </Notification>

          <BannerCard>
              <img
              src="/images/8.jpg"
              alt=""
              />
          </BannerCard>
      </Container>
  );
};


const Container = styled.div`
  width: 28%;
  @media (min-width: 540px) {
    margin-left: 20px;
  }
  @media (max-width: 540px) {
    width: 100%;
  }
`;

const Notification = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 12px;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
`;

const FeedList = styled.ul`
  margin-top: 16px;
  text-align: left;
  max-height: 200px;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  /* border: 1px solid black; */
  li {
    display: flex;
    align-items: center;
    margin: 12px 0;
    position: relative;
    font-size: 14px;
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
  }
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

const BannerCard = styled(Notification)`
  img {
    width: 100%;
    height: 100%;
  }
`;

const Message = styled.div`
    text-align: center;
`;

const mapStateToProps = (state) => {
  return {
      user: state.userState.user,
      notifications: state.userState.notifications,
  }
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Rightside);