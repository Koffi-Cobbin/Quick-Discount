import React, { useState, useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { connect } from "react-redux";
import { NavLink, Link, useLocation } from "react-router-dom";
import { logOutAPI } from "../../../actions";
import Search from "./Search";


const Navbar = (props) => {
    const [pressedEnter, setPressedEnter] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); // 'discounts' | 'help' | 'user' | null
    const [searchVisible, setSearchVisible] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setOpenDropdown(null);
        setSearchVisible(false);
    }, [location.pathname]);

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const closeDropdown = () => setOpenDropdown(null);

    const toggleSearch = () => setSearchVisible((v) => !v);

    // State: 'transparent' — home hero, not yet scrolled (see-through)
    // State: 'scrolled'    — home after scrolling (orange glass)
    // State: 'blur'        — any other page (dark frosted glass — always visible)
    const navState = isHome
        ? (scrolled ? "scrolled" : "transparent")
        : "blur";

    // Add KeyDown event to search input
    const addSearchEvent = () => {
        let searchInputWrap = document.getElementsByClassName("wrapper")[0];
        if (searchInputWrap) {
            const input = searchInputWrap.querySelector("input");
            if (input) {
                input.setAttribute("id", "searchInput");
                input.addEventListener("keydown", function (e) {
                    if (e.key === "Enter") setPressedEnter(true);
                });
            }
        }
    };

    return (
        <Container
            id="top"
            $navState={navState}
            style={props.style}
        >
            <Content>
                {/* Logo */}
                <Logo>
                    <NavLink to="/">
                        <img src="/images/logo.png" alt="Logo" />
                    </NavLink>
                </Logo>

                {/* Mid search - tablet only toggle */}
                <SearchEntryDisplayButton onClick={toggleSearch}>
                    <img src="/images/icons/search-icon-w.svg" alt="Search" />
                </SearchEntryDisplayButton>

                {/* Tablet search overlay */}
                <SearchEntryDisplay visible={searchVisible} id="search-display">
                    <div>
                        <input type="text" placeholder="Search discounts..." />
                        <SearchButton>
                            <img src="/images/icons/search-icon.svg" alt="" />
                        </SearchButton>
                        <CloseBtn onClick={toggleSearch}>&times;</CloseBtn>
                    </div>
                </SearchEntryDisplay>

                {/* Desktop search bar */}
                <SearchWrapper>
                    <Search
                        homeSearch={isHome}
                        pressedEnter={pressedEnter}
                        addSearchEvent={addSearchEvent}
                    />
                </SearchWrapper>

                {/* Hamburger — mobile only */}
                <Menu id="sidenav">
                    <HamburgerBtn onClick={props.sidenav} aria-label="Open menu">
                        <span /><span /><span />
                    </HamburgerBtn>
                </Menu>

                {/* Desktop nav */}
                <TopNav ref={dropdownRef}>
                    <NavListWrap>
                        {/* Home */}
                        <NavItem>
                            <NavLink to="/" end className={({ isActive }) => isActive ? "active current" : ""}>
                                <span>Home</span>
                            </NavLink>
                        </NavItem>

                        {/* Discounts dropdown */}
                        <NavItem className="has-dropdown">
                            <DropdownTrigger
                                onClick={() => toggleDropdown("discounts")}
                                isOpen={openDropdown === "discounts"}
                                aria-haspopup="true"
                                aria-expanded={openDropdown === "discounts"}
                            >
                                <span>
                                    Discounts
                                    <ChevronIcon isOpen={openDropdown === "discounts"}>
                                        <img src="/images/icons/down-arrow-w.svg" alt="" />
                                    </ChevronIcon>
                                </span>
                            </DropdownTrigger>
                            <DropdownMenu isOpen={openDropdown === "discounts"}>
                                <DropdownArrow />
                                <Link to="/discounts" onClick={closeDropdown}>
                                    <DropdownItem>
                                        <DropdownIcon>🏷️</DropdownIcon>
                                        All Discounts
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
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
                                    <ChevronIcon isOpen={openDropdown === "help"}>
                                        <img src="/images/icons/down-arrow-w.svg" alt="" />
                                    </ChevronIcon>
                                </span>
                            </DropdownTrigger>
                            <DropdownMenu isOpen={openDropdown === "help"}>
                                <DropdownArrow />
                                <Link to="/help/basics" onClick={closeDropdown}>
                                    <DropdownItem>
                                        <DropdownIcon>📖</DropdownIcon>
                                        Basics
                                    </DropdownItem>
                                </Link>
                                <Link to="/help/accounts" onClick={closeDropdown}>
                                    <DropdownItem>
                                        <DropdownIcon>👤</DropdownIcon>
                                        Account
                                    </DropdownItem>
                                </Link>
                                <Link to="/help/payment" onClick={closeDropdown}>
                                    <DropdownItem>
                                        <DropdownIcon>💳</DropdownIcon>
                                        Payments
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </NavItem>

                        {/* Post */}
                        <NavItem>
                            <NavLink to="/discounts/add" className={({ isActive }) => isActive ? "active current" : ""}>
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
                                            <img src={props.user.photoURL} alt="avatar" className="avatar" />
                                        ) : (
                                            <img src="/images/icons/user.svg" alt="user" className="avatar placeholder" />
                                        )}
                                        <span className="me-label">
                                            Me
                                            <ChevronIcon isOpen={openDropdown === "user"}>
                                                <img src="/images/icons/down-arrow-w.svg" alt="" />
                                            </ChevronIcon>
                                        </span>
                                    </UserAvatar>
                                </DropdownTrigger>
                                <DropdownMenu isOpen={openDropdown === "user"} align="right">
                                    <DropdownArrow align="right" />
                                    <UserDropdownHeader>
                                        {props.user.displayName || props.user.email}
                                    </UserDropdownHeader>
                                    <DropdownDivider />
                                    <Link to="/dashboard" onClick={closeDropdown}>
                                        <DropdownItem>
                                            <DropdownIcon>📊</DropdownIcon>
                                            Dashboard
                                        </DropdownItem>
                                    </Link>
                                    <Link to="/logout" onClick={closeDropdown}>
                                        <DropdownItem danger>
                                            <DropdownIcon>🚪</DropdownIcon>
                                            Logout
                                        </DropdownItem>
                                    </Link>
                                </DropdownMenu>
                            </NavItem>
                        ) : (
                            <NavItem>
                                <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                                    <LoginBtn>Login</LoginBtn>
                                </NavLink>
                            </NavItem>
                        )}
                    </NavListWrap>
                </TopNav>
            </Content>
        </Container>
    );
};

/* ─── Animations ─────────────────────────────────────────────────────────── */

const dropdownEnter = keyframes`
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

const slideDownFade = keyframes`
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Container ──────────────────────────────────────────────────────────── */

const Container = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    font-family: Inter, 'Roboto', sans-serif;

    /* Glassmorphism layer — always present, intensity shifts per state */
    backdrop-filter: ${({ $navState }) => ($navState === "transparent" ? "none" : "blur(20px) saturate(1.8)")};
    -webkit-backdrop-filter: ${({ $navState }) => ($navState === "transparent" ? "none" : "blur(20px) saturate(1.8)")};

    transition:
        background-color 0.4s ease,
        box-shadow       0.4s ease,
        border-color     0.4s ease,
        padding          0.35s ease;

    /*
     * State: 'transparent' — Home hero, not yet scrolled
     *   Barely-there black tint. Hero bleeds through.
     *   No border, no shadow — it's floating above the image.
     */
    ${({ $navState }) => $navState === "transparent" && css`
        background-color: rgba(0, 0, 0, 0.08);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: none;
        padding: 14px 0;
    `}

    /*
     * State: 'scrolled' — Home after scrolling
     *   Orange glass: brand colour, dense blur, crisp shadow.
     */
    ${({ $navState }) => $navState === "scrolled" && css`
        background-color: rgba(220, 103, 14, 0.78);
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow:
            0 4px 28px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        padding: 6px 0;
    `}

    /*
     * State: 'blur' — All other pages
     */
    ${({ $navState }) => $navState === "blur" && css`
        background: rgba(14, 9, 4, 0.82) !important;
        border-bottom: 2px solid rgba(220, 103, 14, 0.55) !important;
        box-shadow:
            0 4px 24px rgba(0, 0, 0, 0.22),
            0 1px 0 rgba(255, 255, 255, 0.04) inset,
            0 -1px 0 rgba(220, 103, 14, 0.2) inset !important;
        padding: 6px 0;
    `}

    /* Hide hamburger on desktop */
    @media (min-width: 768px) {
        #sidenav { display: none; }
    }
`;

/* ─── Content / Layout ───────────────────────────────────────────────────── */

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;
    position: relative;

    @media (min-width: 768px)  { width: 90%; }
    @media (min-width: 1920px) { width: 80%; }
    @media (min-width: 2560px) { width: 60%; }
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
        img { height: 40px; }
    }
`;

/* ─── Search ─────────────────────────────────────────────────────────────── */

const SearchWrapper = styled.div`
    position: relative;
    width: 380px;
    flex-shrink: 0;

    @media (max-width: 1020px) { display: none; }
`;

const SearchEntryDisplayButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;

    img { width: 20px; height: 20px; }

    @media (max-width: 767px)  { display: none; }
    @media (min-width: 1021px) { display: none; }
`;

const SearchButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    img { width: 22px; height: 22px; }
`;

const SearchEntryDisplay = styled.div`
    display: ${({ visible }) => (visible ? "flex" : "none")};
    align-items: center;
    justify-content: center;
    background-color: #eef3f8;
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 1100;
    padding: 12px 16px;
    animation: ${slideDownFade} 0.2s ease;

    & > div {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        max-width: 600px;

        input {
            flex: 1;
            height: 40px;
            padding: 0 14px;
            border: 1px solid #ccc;
            border-radius: 20px;
            font-size: 15px;
            outline: none;

            &:focus { border-color: #fa8128; }
        }
    }

    @media (min-width: 1021px) { display: none !important; }
`;

const CloseBtn = styled.button`
    background: transparent;
    border: none;
    font-size: 26px;
    line-height: 1;
    color: #333;
    cursor: pointer;
    padding: 0 4px;
    outline: none;
`;

/* ─── Hamburger ──────────────────────────────────────────────────────────── */

const Menu = styled.li`
    list-style: none;
    display: flex;
    align-items: center;

    @media (min-width: 600px) { display: none; }
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

    &:hover span { background: rgba(255,255,255,0.8); }
`;

/* ─── Top Nav ────────────────────────────────────────────────────────────── */

const TopNav = styled.nav`
    margin-left: auto;
    display: flex;
    align-items: center;

    @media (max-width: 600px) { display: none; }
`;

const NavListWrap = styled.ul`
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 2px;
`;

/* ─── Nav Items ──────────────────────────────────────────────────────────── */

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
        transition: color 0.2s ease, background-color 0.2s ease;
        position: relative;
        white-space: nowrap;

        span { display: flex; align-items: center; gap: 4px; }

        &:hover {
            color: #fff;
            background-color: rgba(255, 255, 255, 0.12);
        }

        &.active, &.current {
            color: #fff;
            font-weight: 600;

            &::after {
                content: '';
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

/* ─── Dropdown Trigger ───────────────────────────────────────────────────── */

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
    transition: color 0.2s ease, background-color 0.2s ease;
    white-space: nowrap;

    span { display: flex; align-items: center; gap: 4px; }

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

    img { width: 11px; height: 11px; display: block; }
`;

/* ─── Dropdown Menu ──────────────────────────────────────────────────────── */

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 10px);
    ${({ align }) => align === "right" ? "right: 0;" : "left: 0;"}
    min-width: 190px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    z-index: 1200;
    pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transform: ${({ isOpen }) => (isOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)")};
    transition: opacity 0.22s ease, transform 0.22s ease;

    a {
        display: block;
        text-decoration: none;
        color: #1a1a1a;

        &:hover > div { background-color: #fff5ee; }
        &:last-child > div { border-bottom: none; }
    }
`;

const DropdownArrow = styled.div`
    position: absolute;
    top: -6px;
    ${({ align }) => align === "right" ? "right: 18px;" : "left: 18px;"}
    width: 12px;
    height: 12px;
    background: #fff;
    transform: rotate(45deg);
    border-radius: 2px 0 0 0;
    box-shadow: -2px -2px 4px rgba(0,0,0,0.06);
`;

const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ danger }) => (danger ? "#e53e3e" : "#1a1a1a")};
    border-bottom: 1px solid #f5f5f5;
    transition: background-color 0.15s ease, color 0.15s ease;

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

/* ─── User Avatar Trigger ────────────────────────────────────────────────── */

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
            background: rgba(255,255,255,0.2);
        }
    }

    .me-label {
        display: flex;
        align-items: center;
        gap: 3px;
        color: rgba(255,255,255,0.9);
        font-size: 14px;
        font-weight: 500;
    }
`;

/* ─── Login Button ───────────────────────────────────────────────────────── */

const LoginBtn = styled.span`
    background: rgba(255, 255, 255, 0.18);
    border: 1.5px solid rgba(255, 255, 255, 0.55);
    border-radius: 20px;
    padding: 5px 18px;
    font-size: 14px;
    font-weight: 600;
    color: #fff !important;
    transition: background 0.2s ease, border-color 0.2s ease;

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