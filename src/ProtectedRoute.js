import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useEffect } from "react";
import { connect } from "react-redux";
import { setPreviousUrl } from '../src/actions';


const Protected = ({ user, children, setUrl }) => {
  const location = useLocation();

  useEffect(() => {
    setUrl(location.pathname);
  }, [location.pathname, setUrl]);

  return user ? children : <Navigate to="/login" />;
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