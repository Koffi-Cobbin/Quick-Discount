import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { setLoading, setLoadingMessage } from "../../actions";
import { logOutAPI } from "../../actions";
import { Link } from "react-router-dom";


const Logout = (props) => {

    useEffect(() => {
        if (!props.user){
            props.closeLoader();
        }
    }, [props.errors, props.user]);

    return (
        <Container>
            {!props.user && <Navigate to='/' />}
            <Section>
             <div>
                <p>Are you sure you want to logout?</p>
                <Link to="/" className="no">No</Link>
                <button className="yes" onClick={()=>props.signout()}>Yes</button>
             </div>
            </Section> 
        </Container>
    );
};

const Container = styled.div`
    padding: 0px;
    margin-top: 50px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Section = styled.div`
    position: relative;
    margin-top: -50px;
    div {
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 5px;
        padding: 10px;
        max-width: 200px;
        a.no {
            border: 1px solid red;
            background-color: red;
            color: #fff;
            margin-right: 10px;
            border-radius: 5px;
            padding: 7px 10px;
            text-decoration: none;
            &:hover{
                text-decoration: none;
            };
        }
        button.yes {
            border: 1px solid blue;
            background-color: blue;
            color: #fff;
            border-radius: 5px;
            padding: 5px 10px;
        }
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        errors: state.appState.errors,
    }
};

const mapDispatchToProps = (dispatch) => ({
    signout: () => dispatch(logOutAPI()),
    closeLoader: () => {
        dispatch(setLoadingMessage(null));
        dispatch(setLoading(false));
      },
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
