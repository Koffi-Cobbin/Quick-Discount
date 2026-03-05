import React, { useEffect, useState } from "react";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Search from "./Search";


/* ─── Global overrides for ReactSearchAutocomplete internals ─────────────── */
const SearchGlobalStyle = createGlobalStyle`
    /* Wrapper shell */
    .sidenav-search-root .wrapper {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        border-radius: 0 !important;
    }

    /* Input row */
    .sidenav-search-root .wrapper > div:first-child {
        background: transparent !important;
        border-radius: 0 !important;
        border: none !important;
        height: 46px !important;
        padding: 0 14px !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
    }

    /* Search icon — hidden */
    .sidenav-search-root .wrapper > div:first-child > svg:first-of-type {
        display: none !important;
    }

    /* Input field */
    .sidenav-search-root input {
        background: transparent !important;
        color: #fff !important;
        font-family: 'Courier New', 'Consolas', monospace !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        letter-spacing: 0.03em !important;
        caret-color: #fa8128 !important;
        border: none !important;
        outline: none !important;
        padding: 0 !important;
        margin: 0 !important;
        flex: 1 !important;
    }

    .sidenav-search-root input::placeholder {
        color: rgba(255, 255, 255, 0.2) !important;
        font-style: italic !important;
    }

    /* Results dropdown */
    .sidenav-search-root .wrapper > div:nth-child(2) {
        background: #0f0a04 !important;
        border: 1px solid rgba(250, 129, 40, 0.22) !important;
        border-top: none !important;
        border-radius: 0 0 10px 10px !important;
        box-shadow: 0 18px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(250,129,40,0.06) inset !important;
        margin-top: 0 !important;
        overflow: hidden !important;
    }

    /* Each result row */
    .sidenav-search-root .wrapper > div:nth-child(2) > div {
        background: transparent !important;
        color: rgba(255, 255, 255, 0.75) !important;
        font-family: 'Courier New', 'Consolas', monospace !important;
        font-size: 13px !important;
        padding: 11px 14px 11px 16px !important;
        border-bottom: 1px solid rgba(255,255,255,0.04) !important;
        border-left: 2px solid transparent !important;
        transition: background 0.12s ease !important;
    }

    /* Hovered result */
    .sidenav-search-root .wrapper > div:nth-child(2) > div:hover {
        background: rgba(250, 129, 40, 0.09) !important;
        border-left-color: #fa8128 !important;
        color: #fff !important;
    }

    /* Clear (×) button */
    .sidenav-search-root .wrapper button {
        background: transparent !important;
        border: none !important;
        color: rgba(255,255,255,0.3) !important;
        padding: 0 !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
    }
    .sidenav-search-root .wrapper button svg {
        color: rgba(255,255,255,0.3) !important;
        fill: rgba(255,255,255,0.3) !important;
        width: 13px !important;
        height: 13px !important;
    }
    .sidenav-search-root .wrapper button:hover svg {
        color: rgba(250,129,40,0.8) !important;
        fill: rgba(250,129,40,0.8) !important;
    }
`;


const SideNav = (props) => {
    const [pressedEnter, setPressedEnter] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => props.close(), 300);
    };

    const addSearchEvent = () => {
        let searchInputWraps = document.getElementsByClassName("wrapper");
        let searchInputWrap = searchInputWraps[searchInputWraps.length - 1];
        if (searchInputWrap) {
            const input = searchInputWrap.querySelector("input");
            if (input) {
                input.setAttribute("id", "searchInput");
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") setPressedEnter(true);
                });
                input.addEventListener("focus",  () => setSearchFocused(true));
                input.addEventListener("blur",   () => setSearchFocused(false));
            }
        }
    };

    return (
        <>
            <SearchGlobalStyle />
            <Overlay isClosing={isClosing} onClick={handleClose}>
                <Panel isClosing={isClosing} onClick={(e) => e.stopPropagation()}>

                    <CloseBtn onClick={handleClose} aria-label="Close menu">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </CloseBtn>

                    {/* ── Search section ── */}
                    <SearchSection>

                        {/* Label row */}
                        <SearchLabel>
                            <LabelPip />
                            SEARCH
                        </SearchLabel>

                        {/* Styled shell wrapping the autocomplete widget */}
                        <SearchShell focused={searchFocused}>
                            {/* Corner bracket marks */}
                            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

                            <SearchInner className="sidenav-search-root">
                                <Search
                                    homeSearch={true}
                                    closeNav={handleClose}
                                    pressedEnter={pressedEnter}
                                    addSearchEvent={addSearchEvent}
                                    styling={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                        color: "#fff",
                                        outline: "none",
                                        placeholderColor: "rgba(255,255,255,0.2)",
                                        hoverBackgroundColor: "rgba(250,129,40,0.09)",
                                        lineColor: "rgba(250,129,40,0.18)",
                                        boxShadow: "none",
                                        zIndex: "9999",
                                        fontFamily: "'Courier New', monospace",
                                    }}
                                />
                            </SearchInner>
                        </SearchShell>

                    </SearchSection>

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
                                            : <img src="/images/icons/user.svg" alt="" />}
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


/* ─── Keyframes ──────────────────────────────────────────────────────────── */

const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const fadeOut  = keyframes`from{opacity:1}to{opacity:0}`;
const slideIn  = keyframes`from{transform:translateX(100%)}to{transform:translateX(0)}`;
const slideOut = keyframes`from{transform:translateX(0)}to{transform:translateX(100%)}`;

const borderGlow = keyframes`
    0%, 100% {
        border-color: rgba(250, 129, 40, 0.5);
        box-shadow: 0 0 0 0 rgba(250,129,40,0);
    }
    50% {
        border-color: rgba(250, 129, 40, 0.85);
        box-shadow: 0 0 20px rgba(250,129,40,0.18), inset 0 0 14px rgba(250,129,40,0.05);
    }
`;


const pipBlink = keyframes`
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.15; }
`;


/* ─── Overlay ────────────────────────────────────────────────────────────── */

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
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
    background-color: #0B0705;
    padding: 58px 0 20px;
    overflow-y: auto;
    box-shadow:
        -4px 0 20px rgba(0, 0, 0, 0.5),
        -1px 0 0 rgba(250, 129, 40, 0.07);
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
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 7px;
    color: rgba(255, 255, 255, 0.38);
    cursor: pointer;
    z-index: 1;
    transition: background 0.2s, color 0.2s, border-color 0.2s;

    &:hover {
        background: rgba(250, 129, 40, 0.1);
        border-color: rgba(250, 129, 40, 0.28);
        color: #fa8128;
    }
`;

/* ─── Search section ─────────────────────────────────────────────────────── */

const SearchSection = styled.div`
    padding: 0 15px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 4px;
`;

const SearchLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 9px;
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(250, 129, 40, 0.45);
    user-select: none;
`;

const LabelPip = styled.span`
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #fa8128;
    box-shadow: 0 0 8px 2px rgba(250, 129, 40, 0.45);
    animation: ${pipBlink} 2.6s ease-in-out infinite;
    flex-shrink: 0;
`;

/* ─── Shell — the frame around the autocomplete widget ───────────────────── */

const SearchShell = styled.div`
    position: relative;
    border-radius: 10px;
    border: 1.5px solid ${({ focused }) =>
        focused ? "rgba(250,129,40,0.5)" : "rgba(255,255,255,0.09)"};
    background: ${({ focused }) =>
        focused ? "rgba(250,129,40,0.03)" : "rgba(255,255,255,0.025)"};
    overflow: visible;
    z-index: 10000;
    transition: border-color 0.3s ease, background 0.3s ease;

    ${({ focused }) => focused && css`
        animation: ${borderGlow} 2.4s ease-in-out infinite;
    `}
`;

/* Corner bracket accents */
const Corner = styled.span`
    position: absolute;
    width: 8px; height: 8px;
    z-index: 3;
    pointer-events: none;

    ${({ pos }) => pos === "tl" && css`
        top: -1px; left: -1px;
        border-top: 2px solid rgba(250,129,40,0.55);
        border-left: 2px solid rgba(250,129,40,0.55);
        border-radius: 10px 0 0 0;
    `}
    ${({ pos }) => pos === "tr" && css`
        top: -1px; right: -1px;
        border-top: 2px solid rgba(250,129,40,0.55);
        border-right: 2px solid rgba(250,129,40,0.55);
        border-radius: 0 10px 0 0;
    `}
    ${({ pos }) => pos === "bl" && css`
        bottom: -1px; left: -1px;
        border-bottom: 2px solid rgba(250,129,40,0.55);
        border-left: 2px solid rgba(250,129,40,0.55);
        border-radius: 0 0 0 10px;
    `}
    ${({ pos }) => pos === "br" && css`
        bottom: -1px; right: -1px;
        border-bottom: 2px solid rgba(250,129,40,0.55);
        border-right: 2px solid rgba(250,129,40,0.55);
        border-radius: 0 0 10px 0;
    `}
`;

/* Inner wrapper holding the ReactSearchAutocomplete widget */
const SearchInner = styled.div`
    position: relative;
    z-index: 1;

    & > div { width: 100% !important; }
`;

/* ─── Nav links (original styling preserved) ─────────────────────────────── */

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

        img { width: 18px; height: 18px; padding: 0; }

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
            &:hover { color: #fa8128; }
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
                width: 28px; height: 28px;
                border-radius: 50%;
                margin-right: 6px;
            }
            & > img.down {
                width: 12px; height: 12px;
                margin-left: 4px; margin-right: 0;
            }
        }
    }

    span { display: flex; align-items: center; }
`;

/* ─── Redux ──────────────────────────────────────────────────────────────── */

const mapStateToProps = (state) => ({
    user: state.userState.user,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);