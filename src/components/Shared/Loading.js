import React from "react";
import styled from "styled-components";
import { connect } from 'react-redux';
import { setLoading, setLoadingMessage } from "../../actions";


const Loading = (props) => {
  return (
    <>
        <Container>
          <Content>
            <span className="close-popup" onClick={() => props.close(props.loading_message)}>&times;</span>
            {props.loading_message ? (
              <>{props.loading_message}</>
              ) : (
                <>
                  <img src="/images/icons/spinner.svg" className="spinner" alt="Loading..." />
                  <p>Loading...</p>
                </>
            )}
          </Content>
        </Container>
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  padding: 0px;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.4s;
`;

const Content = styled.div`
  background-color: white;
  border-radius: 5px;
  width: 200px;
  height: fit-content;
  position: relative;
  padding: 10px;
  margin: 0 auto;

  @keyframes load-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
  }

  img {
    height: 50px;
    pointer-events: none;
  }
  img.spinner {
    animation: load-spin infinite 2s linear;
  }

  &>span.close-popup {
        position: absolute;
        font-size: 20px;
        top: 0;
        right: 0;
        height: 20px;
        width: 20px;
        font-weight: 600;
        color: red;
        cursor: default;
    }
`;

const mapStateToProps = (state) => {
  return {
    loading: state.appState.loading,
    loading_message: state.appState.loading_message,
  }
};

const mapDispatchToProps = (dispatch) => ({
  close: (loading_message=null) => {
    dispatch(setLoadingMessage(null));
    dispatch(setLoading(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);