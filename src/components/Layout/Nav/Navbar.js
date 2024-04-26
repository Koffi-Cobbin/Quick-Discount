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
        <Container style={props.style} id="top">
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
                        <input type="text" placeholder="Search" />
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

                        <NavList>
                        <NavList>
                                <NavLink to="/discounts/add" className={({isActive}) => isActive ? 'current' : undefined}>
                                    <span>Post</span>
                                </NavLink>
                            </NavList>
                        </NavList>

                        {props.user ? (
                            <>
                            {/* <NavList>
                                <NavLink>
                                    <NavCartButton onClick={props.onShowCart} />
                                </NavLink>
                            </NavList> */}

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
                            {/* <NavList>
                                <NavLink to="/signup" className={({isActive}) => isActive ? 'current' : undefined}>
                                    <span>Sign Up</span>
                                </NavLink>
                            </NavList> */}                            
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
    font-family: Inter, 'Roboto', sans-serif;
    background-color: #fa8128;
    backdrop-filter: blur(10);
    @media (min-width: 768px) {
        #sidenav{
            display: none;
        }
    }
`;


const Content = styled.div`
    display: flex;
    align-items: center; /** flex-start */
    min-height: 100%;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;

    @media (min-width: 768px) {
        width: 90%;        
    }

    /* Largest devices such as desktops (1920px and up) */
    @media only screen and (min-width: 120em) {
        width: 80%;
    }

    /* Largest devices such as desktops (1280px and up) */
    @media only screen and (min-width: 160em) {
        width: 60%;
    }
`;


const Logo = styled.span`
    font-size: 0px;
    img {
        height: 70px;
        margin-top: -5px;
        margin-right: 10px;
        padding: 0px;
        /* border: 2px solid white; */
    }
    @media screen and (max-width: 768px){
        img {
            height: 40px;
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
        height: 70px;
    }
    .show {display:block;}
`;

const SearchWrapper = styled.div`
    position: relative;
`;

const Search = styled.div`
    padding: 0;
    margin: 0;
    /* border: 1px solid blue; */
    input {
        border: none;
        box-sizing: none;
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 20px;
        color: #fff; 
        width: 300px;
        padding: 0 8px 0 40px;
        font-size: 16px;
        height: 40px;
        border-color: #dce6f1;
        /* vertical-align: text-top; */
        outline: none;
        &::placeholder{
            color: #fff;
        }
        @media (max-width: 768px) {
            max-width: 150px;
        }
    }
    @media (min-width: 769px) {
        min-width: 300px;
    }

    @media (max-width: 1020px) {
        display: none;
    }
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
    color: #000;
    font-size: 20px;
    font-weight: 500;
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
    margin-right: 8px;
    
    a {
        // align-items: flex-start;
        background: transparent;
        display: flex;
        flex-direction: row;
        justify-content: center;
        min-height: 30px;
        min-width: 80px;
        position: relative;
        text-decoration: none;
        margin-left: 5px;
        color: #fff;

        img {
            width: 30px;
            height: 30px;
        }

        span {
            display: flex;
            align-items: center;
            margin: 0;
            position: relative;
            img {
                width: 12px;
                height: 12px;
            }
        }

        &.current{
            background-color: #fa8128;
            padding: 0 15px;
            border-radius: 40px;
        }

        @media (max-width: 768px) {
            min-width: 70px;
        }
    }
    &:hover,
    &.active{
        a {
            border-bottom: 2px solid #fa8128;
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
    font-size: 30px;
    font-weight: 600;
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
