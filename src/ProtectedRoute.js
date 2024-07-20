import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useEffect } from "react";
import { connect } from "react-redux";
import { setPreviousUrl } from '../src/actions';


const Protected = (props) => {
  const location = useLocation();

  useEffect(() => {
    props.setUrl(location.pathname);
  }, []);

  return props.user ? props.children : <Navigate to="/login" />; 
};


const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setUrl: (url) => dispatch(setPreviousUrl(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Protected);