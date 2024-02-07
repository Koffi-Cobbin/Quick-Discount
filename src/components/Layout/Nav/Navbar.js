import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { signOutAPI, logOutAPI } from "../../../actions";

import NavCartButton from "../NavCartButton";

const Navbar = (props) => {

    const toggleSearch = () => {
        document.getElementById("search-display").classList.toggle("show");
      };

    const toggleDropdown = (id) => {
        document.getElementById(id).classList.toggle("show current");
    };

    return (
        <Container style={props.style}>
            <Content>
                <Logo>
                    <NavLink to="/">
                        <img src="/images/logo.png" alt="Logo" />
                    </NavLink>
                </Logo>

                <SearchEntryDisplayButton onClick={toggleSearch} >
                    <img src="/images/icons/search-icon-w.svg" alt="" />
                </SearchEntryDisplayButton> 

                <SearchEntryDisplay id="search-display" className="search-display">
                    <div>
                        <input type="text" placeholder="Search" />
                        <SearchButton>
                            <img src="/images/icons/search-icon.svg" alt="" />
                        </SearchButton> 
                        <CloseBtn onClick={toggleSearch}>&times;</CloseBtn>
                    </div>
                </SearchEntryDisplay>

                <SearchWrapper>
                    <Search>
                        <div>
                            <input type="text" placeholder="Search" />
                        </div>
                        <SearchIcon>
                            <img src="/images/icons/search-icon.svg" alt="" />
                        </SearchIcon> 
                    </Search>
                </SearchWrapper>

                <Menu id="sidenav">
                    <NavLink onClick={props.sidenav}>
                        &#9776;
                        {/* <img src="/images/icons/more-w.svg" alt="More"></img> */}
                    </NavLink>
                </Menu>

                <TopNav>
                    <NavListWrap>
                        <NavList id="home">
                            <NavLink to="/" className={({isActive}) => isActive ? 'current' : undefined} end>
                                <span>Home</span>
                            </NavLink>
                        </NavList>

                        <NavList className="dropdown">
                            <NavLink onClick={() => toggleDropdown("events-drpdwn")} >
                                <span>
                                    Discounts &nbsp;
                                    <img src="/images/icons/down-arrow-w.svg" alt="" />
                                </span>
                            </NavLink>
                            <div className="dropdown-content" id="events-drpdwn">
                                <Link to="/discounts">
                                    All 
                                </Link>
                                {/* <Link to="/discounts/latest">
                                    Latest
                                </Link> */}
                            </div>
                        </NavList>

                        <NavList className="dropdown">
                            <NavLink onClick={() => toggleDropdown("help-drpdwn")}>
                                <span>
                                    Help &nbsp;
                                    <img src="/images/icons/down-arrow-w.svg" alt="" />
                                </span>
                            </NavLink>
                            <div className="dropdown-content" id="help-drpdwn">
                                <Link to="/help/basics">
                                    Basics
                                </Link>
                                <Link to="/help/accounts">
                                    Account
                                </Link>
                                <Link to="/help/payment">
                                    Payments
                                </Link>
                            </div>
                        </NavList>

                        {props.user ? (
                            <>
                            <NavList>
                                <NavLink>
                                    <NavCartButton onClick={props.onShowCart} />
                                </NavLink>
                            </NavList>

                            <NavList className="dropdown">
                                <NavLink >
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
                                </NavLink>
                                <div className="dropdown-content right">
                                    <Link to="/dashboard">Dashboard</Link>
                                    <Link to="/logout">
                                        Logout
                                    </Link>
                                </div>
                            </NavList>
                            </>
                        ) : (
                            <>
                            <NavList>
                                <NavLink to="/signup" className={({isActive}) => isActive ? 'current' : undefined}>
                                    <span>Sign Up</span>
                                </NavLink>
                            </NavList>
                            <NavList>
                                <NavLink to="/discounts/add" className={({isActive}) => isActive ? 'current' : undefined}>
                                    <span>Post</span>
                                </NavLink>
                            </NavList>
                            </>)
                        }
                        {/* <TicketCart id="ticket-card-2">
                            <NavLink>
                                <img src="/images/icons/ticket-w.svg" alt="Tickets"></img>
                                <span>0</span>
                            </NavLink>
                        </TicketCart> */}
                    </NavListWrap>
                    
                </TopNav>
            </Content>
        </Container>
    );
};

const Container = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 5px 0;
    padding-top: 10px;
    overflow: hidden;
    font-family: Arial;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    @media (min-width: 768px) {
        #sidenav{
            display: none;
        }
    }
`;


const Content = styled.div`
    display: flex;
    align-items: flex-start;
    min-height: 100%;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;
`;


const Logo = styled.span`
    font-size: 0px;
    img {
        height: 45px;
        margin-top: -5px;
        margin-right: 10px;
        /* border: 2px solid white; */
    }
    @media screen and (max-width: 768px){
        img {
            height: 30px;
            margin-top: -5px;
            /* border: 2px solid white; */
        }
    }
`;

const SearchEntryDisplayButton = styled.button`
    font-size: 0;
    img {
        position: relative;
        border: none;
        outline: none;
        box-sizing: none;
        width: 20px;
    }
    @media screen and (max-width: 767px){
        display: none;
    }
    @media screen and (min-width: 1021px){
        display: none;
    }
`;

const SearchButton = styled.button`
    font-size: 0px;
    img {
        position: relative;
        border: none;
        outline: none;
        box-sizing: none;
        background-color: transparent;
        width: 25px;
    }
`;

const SearchEntryDisplay = styled.div`
    display: none;
    & div {
        display: flex;
        justify-content: center;
        align-items: center;
        & input {
            width: 50%;
            height: 40px;
            padding-left: 10px;
            margin-right: 10px;
            border: 1px solid black;
            border-radius: 20px;
        }
    }
    @media screen and (max-width: 1020px){
        background-color: #eef3f8;
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        z-index: 1000;
        padding: 10px 0;
        overflow: hidden;
        font-family: Arial;
        height: 70px;
    }
    .show {display:block;}
`;

const SearchWrapper = styled.div`
    position: relative;
`;

const Search = styled.div`
    /* border: 1px solid white; */
    position: relative;
    & > div {
        padding: 0;
        /* border: 1px solid blue; */
        input {
            border: none;
            box-sizing: none;
            background-color: #f2f2f2;
            border-radius: 20px;
            color: rgba(0, 0, 0, 0.95); 
            width: 300px;
            padding: 0 8px 0 40px;
            line-height: 1.75;
            font-weight: 14px;
            height: 34px;
            border-color: #dce6f1;
            vertical-align: text-top;
            outline: none;
            @media (max-width: 768px) {
                max-width: 150px;
            }
        }
        @media (min-width: 769px) {
            min-width: 300px;
        }
    }
    @media (max-width: 1020px) {
        display: none;
    }
`;


const SearchIcon = styled.span`
    width: 40px;
    position: absolute;
    z-index: 1;
    top: 11px;
    left: 2px;
    border-radius: 2px;
    margin: 0;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CloseBtn = styled.button`
    position: absolute;
    right: 15px;
    font-size: 30px;
    color: black;
    border: none;
    outline: none;
    background-color: transparent;
`;

const TopNav = styled.nav`
    margin-left: auto;
    display: block; 
    color: #FFF;
    @media (max-width: 600px) {
        display: none;
    }
`;

const NavListWrap = styled.ul`
    display: flex;
    list-style-type: none;
    position: relative;
    padding: 0;
`;


const NavList = styled.li`
    display: flex;
    align-items: center;
    
    a {
        // align-items: flex-start;
        background: transparent;
        display: flex;
        flex-direction: row;
        font-size: 15.5px;
        justify-content: center;
        min-height: 30px;
        min-width: 80px;
        position: relative;
        text-decoration: none;
        margin-left: 5px;
        color: #FFF;

        img {
            width: 30px;
            height: 30px;
        }

        span {
            display: flex;
            align-items: center;
            margin: 0;
            font-family: Arial;
            position: relative;
            img {
                width: 12px;
                height: 12px;
                // align-self: flex-end;
            }
        }

        &.current{
            background-color: #fa8128;
            border-radius: 40px;
            // border-bottom: 2px solid #fa8128;
            // span:after {
            //     content: '';
            //     transform: scaleX(1);
            //     bottom: 0;
            //     left: 0;
            //     position: absolute;
            //     transition: transform 0.2s ease-in-out;
            //     width: 100%;
            // };
        }

        @media (max-width: 768px) {
            min-width: 70px;
        }
    }
    &:hover,
    &.active{
        a {
            border-bottom: 2px solid #fa8128;
            /* text-decoration: underline;
            text-decoration-color: #fa8128;
            text-decoration-thickness: 2px; */
        }

        span:after {
            content: '';
            transform: scaleX(1);
            bottom: 0;
            left: 0;
            position: absolute;
            transition: transform 0.2s ease-in-out;
            width: 100%;
        }
    }

    &.dropdown{
        position: relative;
        display: inline-block;
    }
    /* Dropdown Content (Hidden by Default) */
    & div.dropdown-content {
        display: none;
        position: fixed;
        background-color: #f1f1f1;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        &.right {
            right: 0;
        }
        /* Links inside the dropdown */
        &>a {
            background-color: #000;
            opacity: 0.8;
            color: #FFF;
            padding: 5px 16px;
            text-decoration: none;
            margin-left: 0;
        }
        &>a:hover, &a.active {
            color: #fa8128;
        }
    }
    @media (min-width: 1024px) {
        &.dropdown:hover .dropdown-content {display: block;}
    }
    .show {display:block;}
`;

const TicketCart = styled(NavList)`
    a {
        margin: 0 15px 0 -5px;
        color: white;
        
        img {
            margin-right: 5px;
        }
    }
    &#ticket-card-2{
        margin-right: 15px;
    }
`;

const Menu = styled(NavList)`
    color: #fff;
    a {
        min-width: 5px;
    }
    @media (min-width: 600px) {
        display: none;
    }
`;



const User = styled(NavList)`
    &.user-sm {
        padding: 0;
        span {
            padding: 0;
            & > img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
            }
            & > img.down {
                width: 12px;
                height: 12px;
            }
        }
    }

    span {
        display: flex;
        align-items: center;
    }

    /* @media (min-width: 768px) {
        &.user-sm {
            display: flex;
        }
    }

    @media (max-width: 480px) {
        &.user-sm {
            display: flex;
        }
    } */
`;


const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
    }
};

const mapDispatchToProps = (dispatch) => ({
    signOut: () => dispatch(logOutAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
