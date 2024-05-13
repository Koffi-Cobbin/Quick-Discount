import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Dashboard from "./Dashboard";
import SavedDiscounts from "./SavedDiscounts";
import UserDiscounts from "./UserDiscounts";
import Settings from "./Settings";

const Main = (props) => {
  useEffect(() => {
    const scrollToView = () => {
      let section; //   = document.getElementById("main");
      if (props.currentSection === "notification") {
        section = document.getElementById("user-notifications");
      } else {
        section = document.getElementById("main");
      }
      section.scrollIntoView({ behavior: "smooth" });
    };

    if (props.currentSection) {
      scrollToView();
    }
  }, [props.currentSection]);

  return (
    <Container id="main">
      {(props.currentSection === "dashboard" ||
        props.currentSection === "notification" ||
        !props.currentSection) && <Dashboard />}

      {props.currentSection === "bookmarks" && <SavedDiscounts />}

      {props.currentSection === "discounts" && <UserDiscounts />}

      {props.currentSection === "settings" && <Settings />}
    </Container>
  );
};

const Container = styled.div`
  grid-area: rightside;
  padding-top: 10px;
`;

const Section = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
  /* display: none; */
  /* &.show{
        display: block;
    } */
`;

const Title = styled.h4`
  color: #fa8128;
  margin: 10px 0;
  text-align: left;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 540px) {
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

const RowItem = styled.div`
  width: 270px;
  @media (max-width: 540px) {
    width: 200px;
    margin-bottom: 10px;
  }
`;

const Card = styled.div`
  min-width: 270px;
  height: 180px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  position: relative;
  img {
    width: 98%;
    height: 98%;
    border-radius: 5px;
    background-position: center;
    background-size: cover;
    margin-top: 2px;
  }
  div.overlay {
    width: 98%;
    height: 98%;
    position: absolute;
    z-index: 1;
    top: 1%;
    left: 1%;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 5px;
  }
  div.info {
    position: absolute;
    top: 40px;
    left: 35px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 2;
    border-radius: 5px;
    width: 200px;
    height: 100px;
    color: #fff;
  }
  @media (max-width: 540px) {
    width: 200px;
  }
`;

const DiscountPackageRow = styled.div`
  text-align: left;
`;

const DiscountPackageWrap = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
