import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Search from "./Search";


const SideNav = (props) => {
    const [pressedEnter, setPressedEnter] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Lock body scroll when sidenav is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleClose = () => {
        // Trigger closing animation before unmounting
        setIsClosing(true);
        setTimeout(() => {
            props.close();
        }, 300); // match animation duration
    };

    const addSearchEvent = () => {
        let searchInputWraps = document.getElementsByClassName("wrapper");
        let searchInputWrap = searchInputWraps[searchInputWraps.length - 1];

        if (searchInputWrap) {
            const input = searchInputWrap.querySelector('input');
            if (input) {
                input.setAttribute("id", "searchInput");
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        setPressedEnter(true);
                    }
                });
            }
        }
    };

    return (
        <Overlay isClosing={isClosing} onClick={handleClose}>
            <Panel isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
                <CloseBtn onClick={handleClose}>&times;</CloseBtn>

                <SearchWrapper>
                    <Search
                        homeSearch={props.homeSearch}
                        styling={{ zIndex: "1" }}
                        closeNav={handleClose}
                        pressedEnter={pressedEnter}
                        addSearchEvent={addSearchEvent}
                    />
                </SearchWrapper>

                <NavLinks>
                    <Link to="/" onClick={handleClose}>
                        <span>Home</span>
                    </Link>
                    <Link to="/discounts" onClick={handleClose}>
                        <span>Discounts</span>
                    </Link>
                    <Link to="/discounts/add" onClick={handleClose}>
                        <span>Post</span>
                    </Link>
                    <Link to="/help" onClick={handleClose}>
                        <span>Help</span>
                    </Link>

                    {props.user ? (
                        <>
                            <DrpdnWrap>
                                <User className="user-sm">
                                    <span>
                                        {props.user && props.user.photoURL ? (
                                            <img src={props.user.photoURL} alt="" />
                                        ) : (
                                            <img src="/images/icons/user.svg" alt="" />
                                        )}
                                        <span>
                                            &nbsp;
                                            Me<img src="/images/icons/down-arrow-w.svg" alt="" className="down" />
                                        </span>
                                    </span>
                                </User>
                                <div className="dropdown-content">
                                    <Link to="/dashboard" onClick={handleClose}>
                                        Dashboard
                                    </Link>
                                    <Link to="/logout" onClick={handleClose}>
                                        Logout
                                    </Link>
                                </div>
                            </DrpdnWrap>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={handleClose}>
                                <span>Login</span>
                            </Link>
                        </>
                    )}
                </NavLinks>
            </Panel>
        </Overlay>
    );
};

// Animations
const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

const fadeOut = keyframes`
    from { opacity: 1; }
    to   { opacity: 0; }
`;

const slideIn = keyframes`
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
`;

const slideOut = keyframes`
    from { transform: translateX(0); }
    to   { transform: translateX(100%); }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.6);
    font-family: Lato, 'Roboto', sans-serif;
    animation: ${({ isClosing }) =>
        isClosing
            ? css`${fadeOut} 0.3s ease forwards`
            : css`${fadeIn} 0.3s ease forwards`};
`;

const Panel = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 75%;
    max-width: 320px;
    background-color: #0B0705;
    padding: 60px 0 20px;
    overflow-y: auto;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
    animation: ${({ isClosing }) =>
        isClosing
            ? css`${slideOut} 0.3s ease forwards`
            : css`${slideIn} 0.3s ease forwards`};

    @media (min-width: 600px) {
        width: 50%;
        max-width: 360px;
    }
`;

const CloseBtn = styled.button`
    position: absolute;
    top: 12px;
    right: 15px;
    font-size: 36px;
    line-height: 1;
    color: #fff;
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    padding: 0;
    z-index: 1;
`;

const SearchWrapper = styled.div`
    padding: 0 16px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 8px;
`;

const NavLinks = styled.div`
    display: flex;
    flex-direction: column;

    a {
        text-align: left;
        padding: 14px 20px;
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        color: #fff;
        display: block;
        transition: color 0.2s, background-color 0.2s;
        border-bottom: 1px solid rgba(255,255,255,0.05);

        img {
            width: 18px;
            height: 18px;
            padding: 0;
        }

        &:hover {
            color: #fa8128;
            background-color: rgba(250, 129, 40, 0.08);
        }
    }
`;

const DrpdnWrap = styled.div`
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);

    & div.dropdown-content {
        display: block;
        margin-top: 8px;
        padding-left: 12px;

        & > a {
            background-color: transparent;
            color: rgba(255,255,255,0.75);
            padding: 10px 16px;
            font-size: 14px;
            border-bottom: 1px solid rgba(255,255,255,0.05);

            &:hover {
                color: #fa8128;
            }
        }
    }
`;

const User = styled.a`
    display: flex;
    align-items: center;
    cursor: pointer;

    &.user-sm {
        padding: 0;
        span {
            padding: 0;
            color: #fff;

            & > img {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                margin-right: 6px;
            }

            & > img.down {
                width: 12px;
                height: 12px;
                margin-left: 4px;
                margin-right: 0;
            }
        }
    }

    span {
        display: flex;
        align-items: center;
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
    };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);