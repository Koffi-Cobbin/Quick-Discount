import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const LeftSide = (props) => {
  const widgetOnClickHandler = (id) => {
    var element = document.getElementById(id);

    let widgets = document.getElementsByClassName("widget");
    for (let elem of widgets) {
      if (elem.classList.contains("active")) {
        elem.classList.toggle("active");
      }
    }
    element.classList.toggle("active");
    props.toggleSection(id);
  };

  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground />
          <a>
            <Photo
              style={{
                backgroundImage: props.user.profile_pic
                  ? `url(${props.user.profile_pic})`
                  : `url("/images/icons/u-c-coal.svg")`,
              }}
            />
            <UserName>
              Welcome, {props.user ? props.user.name : "there"}!
            </UserName>
          </a>
          <a>
            <AddPhotoText onClick={() => widgetOnClickHandler("settings")}>
              Add a photo
            </AddPhotoText>
          </a>
        </UserInfo>

        <Widgets>
          <Widget
            id="dashboard"
            className="widget active"
            onClick={() => widgetOnClickHandler("dashboard")}
          >
            <div>
              <img src="/images/icons/dashboard-b.svg" alt="" />
              <span>Dashboard</span>
            </div>
          </Widget>

          <Widget
            id="notification"
            className="widget"
            onClick={() => widgetOnClickHandler("notification")}
          >
            <div>
              <img src="/images/icons/bell-b.svg" alt="" />
              <span>Notifications</span>
            </div>
            <span>{props.notification ? props.notification.length : 0}</span>
          </Widget>

          <Widget
            id="tickets"
            className="widget"
            onClick={() => widgetOnClickHandler("tickets")}
          >
            <div>
              <img src="/images/icons/ticket-b.svg" alt="" />
              <span>Tickets</span>
            </div>
            <span>{props.tickets ? props.tickets.length : 0}</span>
          </Widget>

          <Widget
            id="bookmarks"
            className="widget"
            onClick={() => widgetOnClickHandler("bookmarks")}
          >
            <div>
              <img src="/images/icons/item-icon.svg" alt="" />
              <span>Saved Events</span>
            </div>
            <span>{props.wishlist ? props.wishlist.length : 0}</span>
          </Widget>
        </Widgets>

        {props.organizer && (
          <OrganizerDashboard
            id="organizer-dashboard"
            className="widget"
            href="/organizer-dashboard"
          >
            <span>
              {/* <img src="/images/icons/settings-b.svg" alt="" /> */}
              <i className="fa fa-delicious"></i>
              Organizer Dashboard
            </span>
          </OrganizerDashboard>
        )}

        <Settings
          id="settings"
          className="widget"
          onClick={() => widgetOnClickHandler("settings")}
        >
          <span>
            <img src="/images/icons/settings-b.svg" alt="" />
            Settings
          </span>
        </Settings>
      </ArtCard>
    </Container>
  );
};

const Container = styled.div`
  grid-area: leftside;
`;

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const UserInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
  & > a.active,
  & > a:hover {
    text-decoration: none;
    cursor: default;
  }
`;

const CardBackground = styled.div`
  background: black; /* url("/images/icons/card-bg.svg") */
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
`;

const Photo = styled.div`
  box-shadow: none;
  /* background-image: url("/images/icons/u-c-coal.svg"); */
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: white;
  background-position: center;
  background-size: 99%;
  background-repeat: no-repeat;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
`;

const UserName = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #323232;
  font-weight: 600;
`;

const AddPhotoText = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.33;
  font-weight: 400;
  &.active,
  &:hover {
    text-decoration: none;
  }
`;

const Widgets = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 12px;
  padding-bottom: 12px;
`;

const Widget = styled.a`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  div {
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
      line-height: 1.333;
      color: rgba(0, 0, 0, 1);
      cursor: default;
    }
    img {
      height: 20px;
      margin-right: 10px;
    }
  }
  &.active,
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    text-decoration: none;
  }
`;

const Settings = styled.a`
  border-color: rgba(0, 0, 0, 0.8);
  text-align: left;
  padding: 12px;
  font-size: 12px;
  display: block;
  span {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 1);
    cursor: default;
    img {
      height: 20px;
      margin-right: 10px;
    }
    i {
      font-size: 18px;
      margin-right: 10px;
    }
  }
  &.active,
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    text-decoration: none;
  }
`;

const OrganizerDashboard = styled(Settings)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    tickets: state.userState.tickets,
    events: state.eventState.events,
    notifications: state.userState.notifications,
    wishlist: state.eventState.wishlist,
    organizer: state.organizerState.organizer,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps)(LeftSide);
