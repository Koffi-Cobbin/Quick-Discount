import React, { useState, useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { connect } from "react-redux";
import { NavLink, Link, useLocation } from "react-router-dom";
import { logOutAPI } from "../../../actions";
import Search from "./Search";

const Navbar = (props) => {
    const [pressedEnter, setPressedEnter] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);
    const searchPanelRef = useRef(null);

    const isHome = location.pathname === "/";

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close search panel when clicking outside of it
    useEffect(() => {
        if (!searchVisible) return;
        const handleClickOutside = (e) => {
            if (
                searchPanelRef.current &&
                !searchPanelRef.current.contains(e.target)
            ) {
                setSearchVisible(false);
            }
        };
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchVisible]);

    // Close everything on route change
    useEffect(() => {
        setOpenDropdown(null);
        setSearchVisible(false);
    }, [location.pathname]);

    // Lock body scroll when search panel is open on tablet
    useEffect(() => {
        document.body.style.overflow = searchVisible ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [searchVisible]);

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const closeDropdown = () => setOpenDropdown(null);

    const toggleSearch = () => {
        setSearchVisible((v) => !v);
        setSearchFocused(false);
    };

    const navState = isHome ? (scrolled ? "scrolled" : "transparent") : "blur";

    const addSearchEvent = () => {
        const searchInput = document.querySelector(".search-input input");
        if (!searchInput) return;
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                setPressedEnter(true);
                setTimeout(() => setPressedEnter(false), 300);
            }
        });
    };

    return (
        <>
            <Container $navState={navState} ref={dropdownRef}>
                <Content>
                    {/* ── Logo ── */}
                    <NavLink to="/">
                        <Logo>
                            <img src="/images/logo.png" alt="QuickDiscount" />
                        </Logo>
                    </NavLink>

                    {/* ── Desktop Search (≥1021px) ── */}
                    <SearchWrapper className="search-input">
                        <Search
                            pressedEnter={pressedEnter}
                            addSearchEvent={addSearchEvent}
                        />
                    </SearchWrapper>

                    {/* ── Tablet Search Trigger (768px–1020px) ── */}
                    <SearchEntryDisplayButton
                        $active={searchVisible}
                        onClick={toggleSearch}
                        aria-label="Open search"
                    >
                        <img
                            src="/images/icons/search-icon-w.svg"
                            alt="search"
                            width="18"
                            height="18"
                        />
                    </SearchEntryDisplayButton>

                    {/* ── Hamburger (≤599px) ── */}
                    <Menu>
                        <HamburgerBtn
                            onClick={() => props.sidenav && props.sidenav()}
                            aria-label="Open navigation"
                        >
                            <span />
                            <span />
                            <span />
                        </HamburgerBtn>
                    </Menu>

                    {/* ── Desktop Top Nav (≥600px) ── */}
                    <TopNav>
                        <NavListWrap>
                            {/* Home */}
                            <NavItem>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        isActive ? "active current" : ""
                                    }
                                >
                                    <span>Home</span>
                                </NavLink>
                            </NavItem>

                            {/* Discounts — direct link (no dropdown) */}
                            <NavItem>
                                <NavLink
                                    to="/discounts"
                                    className={({ isActive }) =>
                                        isActive ? "active current" : ""
                                    }
                                >
                                    <span>Discounts</span>
                                </NavLink>
                            </NavItem>

                            {/* Help dropdown */}
                            <NavItem className="has-dropdown">
                                <DropdownTrigger
                                    onClick={() => toggleDropdown("help")}
                                    isOpen={openDropdown === "help"}
                                    aria-haspopup="true"
                                    aria-expanded={openDropdown === "help"}
                                >
                                    <span>
                                        Help
                                        <ChevronIcon
                                            isOpen={openDropdown === "help"}
                                        >
                                            <img
                                                src="/images/icons/down-arrow-w.svg"
                                                alt=""
                                            />
                                        </ChevronIcon>
                                    </span>
                                </DropdownTrigger>
                                <DropdownMenu isOpen={openDropdown === "help"}>
                                    <DropdownArrow />
                                    <Link
                                        to="/help/basics"
                                        onClick={closeDropdown}
                                    >
                                        <DropdownItem>
                                            <DropdownIcon>📖</DropdownIcon>
                                            Basics
                                        </DropdownItem>
                                    </Link>
                                    <Link
                                        to="/help/accounts"
                                        onClick={closeDropdown}
                                    >
                                        <DropdownItem>
                                            <DropdownIcon>👤</DropdownIcon>
                                            Account
                                        </DropdownItem>
                                    </Link>
                                    <Link
                                        to="/help/payment"
                                        onClick={closeDropdown}
                                    >
                                        <DropdownItem>
                                            <DropdownIcon>💳</DropdownIcon>
                                            Payments
                                        </DropdownItem>
                                    </Link>
                                </DropdownMenu>
                            </NavItem>

                            {/* Post */}
                            <NavItem>
                                <NavLink
                                    to="/discounts/add"
                                    className={({ isActive }) =>
                                        isActive ? "active current" : ""
                                    }
                                >
                                    <span>Post</span>
                                </NavLink>
                            </NavItem>

                            {/* User / Auth */}
                            {props.user ? (
                                <NavItem className="has-dropdown">
                                    <DropdownTrigger
                                        onClick={() => toggleDropdown("user")}
                                        isOpen={openDropdown === "user"}
                                        aria-haspopup="true"
                                        aria-expanded={openDropdown === "user"}
                                    >
                                        <UserAvatar>
                                            {props.user.photoURL ? (
                                                <img
                                                    src={props.user.photoURL}
                                                    alt="avatar"
                                                    className="avatar"
                                                />
                                            ) : (
                                                <img
                                                    src="/images/icons/user.svg"
                                                    alt="user"
                                                    className="avatar placeholder"
                                                />
                                            )}
                                            <span className="me-label">
                                                Me
                                                <ChevronIcon
                                                    isOpen={
                                                        openDropdown === "user"
                                                    }
                                                >
                                                    <img
                                                        src="/images/icons/down-arrow-w.svg"
                                                        alt=""
                                                    />
                                                </ChevronIcon>
                                            </span>
                                        </UserAvatar>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        isOpen={openDropdown === "user"}
                                        align="right"
                                    >
                                        <DropdownArrow align="right" />
                                        <UserDropdownHeader>
                                            {props.user.displayName ||
                                                props.user.email}
                                        </UserDropdownHeader>
                                        <DropdownDivider />
                                        <Link
                                            to="/dashboard"
                                            onClick={closeDropdown}
                                        >
                                            <DropdownItem>
                                                <DropdownIcon>📊</DropdownIcon>
                                                Dashboard
                                            </DropdownItem>
                                        </Link>
                                        <Link
                                            to="/logout"
                                            onClick={closeDropdown}
                                        >
                                            <DropdownItem danger>
                                                <DropdownIcon>🚪</DropdownIcon>
                                                Logout
                                            </DropdownItem>
                                        </Link>
                                    </DropdownMenu>
                                </NavItem>
                            ) : (
                                <NavItem>
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            isActive ? "active" : ""
                                        }
                                    >
                                        <LoginBtn>Login</LoginBtn>
                                    </NavLink>
                                </NavItem>
                            )}
                        </NavListWrap>
                    </TopNav>
                </Content>
            </Container>

            {/* ── Tablet Search Panel — rendered outside navbar so it overlays everything ── */}
            <TabletSearchBackdrop
                visible={searchVisible}
                onClick={() => setSearchVisible(false)}
            />
            <TabletSearchPanel visible={searchVisible} ref={searchPanelRef}>
                <TabletSearchInner>
                    <SearchPanelLabel>
                        <SearchPanelPip />
                        SEARCH DISCOUNTS
                    </SearchPanelLabel>

                    <SearchShell focused={searchFocused}>
                        <Search
                            homeSearch={true}
                            pressedEnter={pressedEnter}
                            addSearchEvent={addSearchEvent}
                            closeNav={() => setSearchVisible(false)}
                        />
                    </SearchShell>

                    <SearchHints>
                        <SearchHint onClick={() => setSearchVisible(false)}>
                            <Link to="/discounts">🏷️ All Deals</Link>
                        </SearchHint>
                        <SearchHint onClick={() => setSearchVisible(false)}>
                            <Link to="/discounts/cat/food">🍔 Food</Link>
                        </SearchHint>
                        <SearchHint onClick={() => setSearchVisible(false)}>
                            <Link to="/discounts/cat/fashion">👗 Fashion</Link>
                        </SearchHint>
                        <SearchHint onClick={() => setSearchVisible(false)}>
                            <Link to="/discounts/cat/electronics">💻 Tech</Link>
                        </SearchHint>
                    </SearchHints>
                </TabletSearchInner>
            </TabletSearchPanel>
        </>
    );
};

/* ─── Animations ─────────────────────────────────────────────────────────── */

const pipBlink = keyframes`
    0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px rgba(250,129,40,0.5); }
    50%       { opacity: 0.3; box-shadow: none; }
`;

/* ─── Navbar Container ───────────────────────────────────────────────────── */

const Container = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;

    backdrop-filter: ${({ $navState }) =>
        $navState === "transparent" ? "none" : "blur(20px) saturate(1.8)"};
    -webkit-backdrop-filter: ${({ $navState }) =>
        $navState === "transparent" ? "none" : "blur(20px) saturate(1.8)"};

    transition:
        background-color 0.4s ease,
        box-shadow 0.4s ease,
        border-color 0.4s ease,
        padding 0.35s ease;

    ${({ $navState }) =>
        $navState === "transparent" &&
        css`
            background-color: rgba(0, 0, 0, 0);
            box-shadow: none;
            padding: 14px 0;
        `}

    ${({ $navState }) =>
        $navState === "scrolled" &&
        css`
            background-color: rgba(220, 103, 14, 0.78);
            border-bottom: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow:
                0 4px 28px rgba(0, 0, 0, 0.18),
                inset 0 1px 0 rgba(255, 255, 255, 0.12);
            padding: 6px 0;
        `}

    ${({ $navState }) =>
        $navState === "blur" &&
        css`
            background: rgba(14, 9, 4, 0.82) !important;
            border-bottom: 2px solid rgba(220, 103, 14, 0.55) !important;
            box-shadow:
                0 4px 24px rgba(0, 0, 0, 0.22),
                0 1px 0 rgba(255, 255, 255, 0.04) inset,
                0 -1px 0 rgba(220, 103, 14, 0.2) inset !important;
            padding: 6px 0;
        `}

    @media (min-width: 768px) {
        #sidenav {
            display: none;
        }
    }
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;
    position: relative;

    @media (min-width: 768px) {
        width: 90%;
    }
    @media (min-width: 1920px) {
        width: 80%;
    }
    @media (min-width: 2560px) {
        width: 60%;
    }
`;

/* ─── Logo ───────────────────────────────────────────────────────────────── */

const Logo = styled.span`
    font-size: 0;
    flex-shrink: 0;

    img {
        height: 64px;
        margin-top: -4px;
        margin-right: 10px;
        padding: 0;
        transition: height 0.35s ease;
        display: block;
    }

    @media (max-width: 768px) {
        img {
            height: 40px;
        }
    }
`;

/* ─── Desktop Search (≥1021px) ───────────────────────────────────────────── */

const SearchWrapper = styled.div`
    position: relative;
    width: 380px;
    flex-shrink: 0;

    @media (max-width: 1020px) {
        display: none;
    }
`;

/* ─── Tablet Search Trigger Button (768px–1020px) ────────────────────────── */

const SearchEntryDisplayButton = styled.button`
    background: ${({ $active }) =>
        $active ? "rgba(250, 129, 40, 0.25)" : "rgba(255, 255, 255, 0.12)"};
    border: 1.5px solid
        ${({ $active }) =>
            $active ? "rgba(250, 129, 40, 0.7)" : "rgba(255, 255, 255, 0.3)"};
    border-radius: 20px;
    cursor: pointer;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition:
        background 0.2s,
        border-color 0.2s,
        transform 0.15s;

    &:hover {
        background: rgba(250, 129, 40, 0.2);
        border-color: rgba(250, 129, 40, 0.6);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.97);
    }

    @media (max-width: 767px) {
        display: none;
    }
    @media (min-width: 1021px) {
        display: none;
    }
`;

/* ─── Tablet Search Panel ────────────────────────────────────────────────── */

const TabletSearchBackdrop = styled.div`
    position: fixed;
    inset: 0;
    z-index: 998;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: opacity 0.28s ease;

    @media (max-width: 767px) {
        display: none;
    }
    @media (min-width: 1021px) {
        display: none;
    }
`;

const TabletSearchPanel = styled.div`
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    z-index: 999;

    background: rgba(14, 9, 4, 0.96);
    backdrop-filter: blur(24px) saturate(1.8);
    -webkit-backdrop-filter: blur(24px) saturate(1.8);
    border-bottom: 2px solid rgba(220, 103, 14, 0.5);
    box-shadow:
        0 16px 48px rgba(0, 0, 0, 0.4),
        0 1px 0 rgba(255, 255, 255, 0.04) inset;

    pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transform: ${({ visible }) =>
        visible ? "translateY(0)" : "translateY(-10px)"};
    transition:
        opacity 0.28s ease,
        transform 0.28s ease;

    @media (max-width: 767px) {
        display: none;
    }
    @media (min-width: 1021px) {
        display: none;
    }
`;

const TabletSearchInner = styled.div`
    padding: 20px 32px 24px;
`;

const SearchPanelLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(250, 129, 40, 0.7);
    margin-bottom: 14px;
`;

const SearchPanelPip = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fa8128;
    animation: ${pipBlink} 2s ease-in-out infinite;
`;

const SearchShell = styled.div`
    border-radius: 12px;
    overflow: hidden;

`;

const SearchHints = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    flex-wrap: wrap;
`;

const SearchHint = styled.span`
    a {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.65) !important;
        text-decoration: none !important;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition:
            background 0.2s,
            color 0.2s,
            border-color 0.2s;
        white-space: nowrap;

        &:hover {
            background: rgba(250, 129, 40, 0.15);
            color: #fa8128 !important;
            border-color: rgba(250, 129, 40, 0.35);
        }
    }
`;

/* ─── Hamburger (≤599px) ─────────────────────────────────────────────────── */

const Menu = styled.li`
    list-style: none;
    display: flex;
    align-items: center;

    @media (min-width: 600px) {
        display: none;
    }
`;

const HamburgerBtn = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
        display: block;
        width: 24px;
        height: 2px;
        background: #fff;
        border-radius: 2px;
        transition: transform 0.2s ease;
    }

    &:hover span {
        background: rgba(255, 255, 255, 0.8);
    }
`;

/* ─── Desktop Top Nav (≥600px) ───────────────────────────────────────────── */

const TopNav = styled.nav`
    margin-left: auto;
    display: flex;
    align-items: center;

    @media (max-width: 600px) {
        display: none;
    }
`;

const NavListWrap = styled.ul`
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 2px;
`;

const NavItem = styled.li`
    position: relative;
    display: flex;
    align-items: center;

    a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.9);
        font-size: 15px;
        font-weight: 500;
        padding: 8px 12px;
        border-radius: 8px;
        transition:
            color 0.2s ease,
            background-color 0.2s ease;
        position: relative;
        white-space: nowrap;

        span {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        &:hover {
            color: #fff;
            background-color: rgba(255, 255, 255, 0.12);
        }

        &.active,
        &.current {
            color: #fff;
            font-weight: 600;

            &::after {
                content: "";
                position: absolute;
                bottom: 2px;
                left: 12px;
                right: 12px;
                height: 2px;
                background: #fff;
                border-radius: 2px;
            }
        }
    }
`;

const DropdownTrigger = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    padding: 8px 12px;
    border-radius: 8px;
    transition:
        color 0.2s ease,
        background-color 0.2s ease;
    white-space: nowrap;

    span {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.12);
    }

    ${({ isOpen }) =>
        isOpen &&
        css`
            color: #fff;
            background-color: rgba(255, 255, 255, 0.18);
        `}
`;

const ChevronIcon = styled.span`
    display: inline-flex;
    align-items: center;
    transition: transform 0.25s ease;
    transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};

    img {
        width: 11px;
        height: 11px;
        display: block;
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 10px);
    ${({ align }) => (align === "right" ? "right: 0;" : "left: 0;")}
    min-width: 190px;
    background: #fff;
    border-radius: 12px;
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.18),
        0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    z-index: 1200;
    pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transform: ${({ isOpen }) =>
        isOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)"};
    transition:
        opacity 0.22s ease,
        transform 0.22s ease;

    a {
        display: block;
        text-decoration: none;
        color: #1a1a1a;

        &:hover > div {
            background-color: #fff5ee;
        }
        &:last-child > div {
            border-bottom: none;
        }
    }
`;

const DropdownArrow = styled.div`
    position: absolute;
    top: -6px;
    ${({ align }) => (align === "right" ? "right: 20px;" : "left: 20px;")}
    width: 12px;
    height: 12px;
    background: #fff;
    transform: rotate(45deg);
    border-radius: 2px;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
`;

const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ danger }) => (danger ? "#e53e3e" : "#1a1a1a")};
    border-bottom: 1px solid #f5f5f5;
    transition:
        background-color 0.15s ease,
        color 0.15s ease;

    &:hover {
        background-color: ${({ danger }) => (danger ? "#fff5f5" : "#fff5ee")};
        color: ${({ danger }) => (danger ? "#c53030" : "#fa8128")};
    }
`;

const DropdownIcon = styled.span`
    font-size: 15px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
`;

const DropdownDivider = styled.hr`
    margin: 0;
    border: none;
    border-top: 1px solid #f0f0f0;
`;

const UserDropdownHeader = styled.div`
    padding: 12px 16px 10px;
    font-size: 13px;
    font-weight: 600;
    color: #555;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
`;

const UserAvatar = styled.span`
    display: flex;
    align-items: center;
    gap: 6px;

    img.avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.7);
        object-fit: cover;

        &.placeholder {
            padding: 3px;
            background: rgba(255, 255, 255, 0.2);
        }
    }

    .me-label {
        display: flex;
        align-items: center;
        gap: 3px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: 500;
    }
`;

const LoginBtn = styled.span`
    background: rgba(255, 255, 255, 0.18);
    border: 1.5px solid rgba(255, 255, 255, 0.55);
    border-radius: 20px;
    padding: 5px 18px;
    font-size: 14px;
    font-weight: 600;
    color: #fff !important;
    transition:
        background 0.2s ease,
        border-color 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.28) !important;
        border-color: #fff;
    }
`;

/* ─── Redux ──────────────────────────────────────────────────────────────── */

const mapStateToProps = (state) => ({
    user: state.userState.user,
});

const mapDispatchToProps = (dispatch) => ({
    signOut: () => dispatch(logOutAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
