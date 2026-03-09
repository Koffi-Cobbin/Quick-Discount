import React from "react";
import styled, { keyframes, css } from "styled-components";
import { connect } from "react-redux";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { setLoading, setLoadingMessage } from "../../actions";
import { logOutAPI } from "../../actions";
import { NavLink } from "react-router-dom";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Logout = ({ user, errors, closeLoader, signout }) => {

    useEffect(() => {
        if (!user){
            closeLoader();
        }
    }, [errors, user, closeLoader]);

    return (
        <Page>
            <Card>
                {!user && <Navigate to='/' />}
                <CardHeader>
                    <IconWrapper>
                        <LogoutIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </LogoutIcon>
                    </IconWrapper>
                    <Title>Sign out</Title>
                    <Subtitle>Are you sure you want to sign out?</Subtitle>
                </CardHeader>
                
                <ButtonGroup>
                    <CancelButton to="/">
                        Cancel
                    </CancelButton>
                    <ConfirmButton onClick={() => signout()}>
                        Yes, sign out
                    </ConfirmButton>
                </ButtonGroup>
            </Card>
        </Page>
    );
};

const Page = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f7f5;
    padding: 24px;
    font-family: Inter, 'Roboto', sans-serif;
`;

const Card = styled.div`
    width: 100%;
    max-width: 380px;
    background: #fff;
    border-radius: 20px;
    padding: 40px 36px;
    box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.08),
        0 1px 4px rgba(0, 0, 0, 0.04);
    animation: ${fadeUp} 0.5s ease both;
    text-align: center;

    @media (max-width: 480px) {
        padding: 28px 20px;
        border-radius: 16px;
    }
`;

const CardHeader = styled.div`
    margin-bottom: 28px;
`;

const IconWrapper = styled.div`
    width: 56px;
    height: 56px;
    margin: 0 auto 16px;
    background: rgba(250, 129, 40, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LogoutIcon = styled.svg`
    width: 28px;
    height: 28px;
    color: #fa8128;
`;

const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    color: #0e0c0b;
    margin: 0 0 8px;
    font-family: Georgia, serif;
    letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
    font-size: 0.875rem;
    color: #666;
    margin: 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
`;

const CancelButton = styled(NavLink)`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    background: #f0ece8;
    color: #666;
    text-decoration: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    transition: background 0.2s, color 0.2s;
    font-family: inherit;

    &:hover {
        background: #e5e1dc;
        color: #0e0c0b;
    }
`;

const ConfirmButton = styled.button`
    flex: 1;
    height: 48px;
    background: #fa8128;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    font-family: inherit;
    letter-spacing: 0.01em;

    &:hover {
        background: #e07010;
        box-shadow: 0 4px 16px rgba(250, 129, 40, 0.35);
        transform: translateY(-1px);
    }
    &:active {
        transform: translateY(0);
        box-shadow: none;
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

