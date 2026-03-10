import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
    bg:        "#ffffff",
    surface:   "#faf8f5",
    border:    "rgba(0,0,0,0.08)",
    borderMed: "rgba(0,0,0,0.13)",
    orange:    "#fa8128",
    orangeDim: "rgba(250,129,40,0.08)",
    orangeMid: "rgba(250,129,40,0.2)",
    text:      "#1a1710",
    textSub:   "rgba(26,23,16,0.55)",
    textMuted: "rgba(26,23,16,0.35)",
};



/* ─── Keyframes ──────────────────────────────────────────────────────────── */
const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const fadeOut  = keyframes`from{opacity:1}to{opacity:0}`;
const slideIn  = keyframes`from{transform:translateX(100%)}to{transform:translateX(0)}`;
const slideOut = keyframes`from{transform:translateX(0)}to{transform:translateX(100%)}`;

/* ─── Overlay ────────────────────────────────────────────────────────────── */
const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    animation: ${({ isClosing }) =>
        isClosing
            ? css`${fadeOut} 0.3s ease forwards`
            : css`${fadeIn} 0.25s ease forwards`};
`;

/* ─── Panel ──────────────────────────────────────────────────────────────── */
const Panel = styled.div`
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 75%;
    max-width: 320px;
    background: ${T.bg};
    border-left: 1px solid ${T.border};
    padding: 58px 0 20px;
    overflow-y: auto;
    box-shadow: -8px 0 32px rgba(0, 0, 0, 0.1);
    animation: ${({ isClosing }) =>
        isClosing
            ? css`${slideOut} 0.3s ease forwards`
            : css`${slideIn} 0.3s ease forwards`};

    @media (min-width: 600px) {
        width: 50%;
        max-width: 360px;
    }
`;

/* ─── Close button ───────────────────────────────────────────────────────── */
const CloseBtn = styled.button`
    position: absolute;
    top: 14px; right: 14px;
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 7px;
    color: ${T.textMuted};
    cursor: pointer;
    z-index: 1;
    transition: background 0.2s, color 0.2s, border-color 0.2s;

    &:hover {
        background: ${T.orangeDim};
        border-color: ${T.orangeMid};
        color: ${T.orange};
    }
`;

/* ─── Nav links ──────────────────────────────────────────────────────────── */
const NavLinks = styled.div`
    display: flex;
    flex-direction: column;

    a {
        text-align: left;
        padding: 14px 20px;
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        color: ${T.text};
        display: block;
        transition: color 0.2s, background-color 0.2s;
        border-bottom: 1px solid ${T.border};

        img { width: 18px; height: 18px; padding: 0; }

        &:hover {
            color: ${T.orange};
            background-color: ${T.orangeDim};
        }
    }
`;

const DrpdnWrap = styled.div`
    padding: 14px 20px;
    border-bottom: 1px solid ${T.border};

    & div.dropdown-content {
        display: block;
        margin-top: 8px;
        padding-left: 12px;

        & > a {
            background-color: transparent;
            color: ${T.textSub};
            padding: 10px 16px;
            font-size: 14px;
            border-bottom: 1px solid ${T.border};
            &:hover { color: ${T.orange}; }
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
            color: ${T.text};

            & > img {
                width: 28px; height: 28px;
                border-radius: 50%;
                margin-right: 6px;
            }
            & > img.down {
                width: 12px; height: 12px;
                margin-left: 4px; margin-right: 0;
                /* invert the white arrow icon for light bg */
                filter: invert(1) brightness(0.3);
            }
        }
    }

    span { display: flex; align-items: center; }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
const SideNav = (props) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => props.close(), 300);
    };

    return (
        <>
            <Overlay isClosing={isClosing} onClick={handleClose}>
                <Panel isClosing={isClosing} onClick={(e) => e.stopPropagation()}>

                    <CloseBtn onClick={handleClose} aria-label="Close menu">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </CloseBtn>

                    {/* ── Nav links ── */}
                    <NavLinks>
                        <Link to="/" onClick={handleClose}><span>Home</span></Link>
                        <Link to="/discounts" onClick={handleClose}><span>Discounts</span></Link>
                        <Link to="/discounts/add" onClick={handleClose}><span>Post</span></Link>
                        <Link to="/help" onClick={handleClose}><span>Help</span></Link>

                        {props.user ? (
                            <DrpdnWrap>
                                <User className="user-sm">
                                    <span>
                                        {props.user?.photoURL
                                            ? <img src={props.user.photoURL} alt="" />
                                            : <img src="/images/icons/user.svg" alt="" style={{ filter: "invert(0.4)" }} />}
                                        <span>
                                            &nbsp;Me
                                            <img src="/images/icons/down-arrow-w.svg" alt="" className="down" />
                                        </span>
                                    </span>
                                </User>
                                <div className="dropdown-content">
                                    <Link to="/dashboard" onClick={handleClose}>Dashboard</Link>
                                    <Link to="/logout" onClick={handleClose}>Logout</Link>
                                </div>
                            </DrpdnWrap>
                        ) : (
                            <Link to="/login" onClick={handleClose}><span>Login</span></Link>
                        )}
                    </NavLinks>

                </Panel>
            </Overlay>
        </>
    );
};

/* ─── Redux ──────────────────────────────────────────────────────────────── */
const mapStateToProps = (state) => ({
    user: state.userState.user,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);