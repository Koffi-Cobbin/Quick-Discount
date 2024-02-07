import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getOrganizerDiscountsAPI } from "../../actions";


const LeftSide = (props) => {
  const navigate = useNavigate();

  const handleRedirect = (url) => {
      if (url){
          navigate(url);
      }
      else{
          navigate('/');
      }
    };

  const widgetOnClickHandler = (id) => {
    var element = document.getElementById(id);
    if (element.classList.contains('active')){
      return;
    }
    else{
      let widgets = document.getElementsByClassName('widget');
      for (let elem of widgets){
        if (elem.classList.contains('active')){
          elem.classList.toggle("active");
        }
      }
      element.classList.toggle("active");
      props.toggleSection(id);
    }
  };

  useEffect(() => {
    if (props.organizer){
      props.getOrganizerDiscounts(props.organizer.id);
    };    
    // props.getOrganizerNotifications();
  }, [props.organizer]);

  return (
    <Container>
        <ArtCard>
            <UserInfo>
                <CardBackground />
                <a>
                    <Photo />
                    <UserName>Welcome, {props.organizer ? props.organizer.name : 'Organizer'}!</UserName>
                </a>
                <a>
                <AddPhotoText onClick={()=>widgetOnClickHandler("settings")}>Add a photo</AddPhotoText>
                </a>
            </UserInfo>

            <Widgets>
              <Widget id="dashboard" className="widget active" onClick={()=>widgetOnClickHandler("dashboard")}>
                <div>
                  <img src="/images/icons/dashboard-b.svg" alt="" />
                  <span>Dashboard</span>
                </div>
              </Widget>

              <Widget id="notifications" className="widget" onClick={()=>widgetOnClickHandler("notifications")}>
                <div>
                  <img src="/images/icons/bell-b.svg" alt="" />
                  <span>Notifications</span>
                </div>
                <span>{props.notification ? props.notification.length : 0}</span>
              </Widget>

              <Widget 
                id="organizer-discounts" 
                className="widget" 
                onClick={()=>widgetOnClickHandler("organizer-discounts")}>
                <div>
                  <i className="fa fa-caret-square-o-right"></i>
                  <span>Discounts</span>
                </div>
                <span>{props.discounts ? props.discounts.length : 0}</span>
              </Widget>
              <Widget 
                id="user-profile" 
                className="widget" 
                onClick={()=>handleRedirect('/dashboard')}>
                <div>
                  <i className="fa fa-arrow-left"></i>
                  <span>Back</span>
                </div>
              </Widget>
            </Widgets>

            <Settings id="settings" className="widget" onClick={()=>widgetOnClickHandler("settings")}>
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
  &>a.active, &>a:hover{
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
  background-image: url("/images/icons/u-c-coal.svg");
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: white;
  background-position: center;
  background-size: 90%;
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
  &.active, &:hover{
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
    i {
      font-size: 18px;
      margin-right: 10px;
      color: black;
    }
  }
  &.active, &:hover {
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
  &.active, &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    text-decoration: none;
  }
`;


const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    organizer: state.organizerState.organizer,
    discounts: state.organizerState.discounts,
    notifications: state.organizerState.notifications,
  };
};

const mapDispatchToProps = (dispatch) => ({ 
  getOrganizerDiscounts: (organizer_id) => {dispatch(getOrganizerDiscountsAPI(organizer_id))},
  // getOrganizerNotifications: () => {dispatch()}
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSide);
