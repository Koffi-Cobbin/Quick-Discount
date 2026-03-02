import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import { getUserNotificationsAPI, getWishlistAPI } from "../../actions";

const Profile = (props) => {
  const { wishlist, notifications, getWishlist, getUserNotifications } = props;

  useEffect(() => {
    if (!wishlist) getWishlist();
    if (!notifications) getUserNotifications();
  }, [wishlist, notifications, getWishlist, getUserNotifications]);

  return (
    <Wrapper>
      <Dashboard />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* margin-top: 60px; */
  min-height: 100vh;
  background-color: #0b0905;
`;

const mapStateToProps = (state) => ({
  user: state.userState.user,
  wishlist: state.discountState.wishlist,
  notifications: state.userState.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  getWishlist: () => dispatch(getWishlistAPI()),
  getUserNotifications: () => dispatch(getUserNotificationsAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
