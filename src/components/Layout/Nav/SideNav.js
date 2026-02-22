import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Search from "./Search";


const SideNav = (props) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [pressedEnter, setPressedEnter] = useState(false);
    
    useEffect(() => {
        const handleScroll = (event) => {
            setScrollTop(window.scrollY);
          };
      
          window.addEventListener("scroll", handleScroll);
      
          return () => {
            window.removeEventListener("scroll", handleScroll);
          };
    }, [])


    const getInputValue = () => {
        //   Get input value
        const inputValue = document.querySelector("#searchInput").value;
        console.log('Input value:', inputValue);
    };


    const addSearchEvent = () => {
        let searchInputWraps = document.getElementsByClassName("wrapper");
        let searchInputWrap = searchInputWraps[searchInputWraps.length - 1];
        console.error('Found search input wrapper... ', searchInputWrap);        
        
        // get nested child input element of searchInputWrap
        if (searchInputWrap) {
            const input = searchInputWrap.querySelector('input');
            input.setAttribute("id", "searchInput");
            console.error('Found search input... ', input);
            // Add onEnterKey event listener to input
            input.addEventListener('keydown', function (e) {
                // console.log("Keypress Function Activated...");
                if (e.key === 'Enter') {
                    setPressedEnter(true);
                };
            });
          } else {
            console.error('Element not found');
          }
      };


    return (
        <Container onClick={props.close}>
            <Sidenav 
                onClick={(e) => e.stopPropagation()}
                style={{ transform: props.isOpen ? "translateX(0)" : "translateX(100%)" }}
            >
                <Header>
                    <Logo src="/images/logo.png" alt="Quick Discount" />
                    <CloseBtn onClick={props.close}>&times;</CloseBtn>
                </Header>

                <ScrollArea>
                    <SearchWrapper>
                        <Search 
                            homeSearch={props.homeSearch} 
                            styling={{zIndex: "1"}} 
                            closeNav={props.close} 
                            pressedEnter={pressedEnter}
                            addSearchEvent={addSearchEvent}/>
                    </SearchWrapper>

                    <NavLinks>
                        <NavLinkItem to="/" onClick={props.close}>
                            <Icon src="/images/icons/home.svg" alt="" onError={(e) => e.target.style.display='none'} />
                            <span>Home</span>
                        </NavLinkItem>
                        <NavLinkItem to="/discounts" onClick={props.close}>
                            <Icon src="/images/icons/discount.svg" alt="" onError={(e) => e.target.style.display='none'} />
                            <span>Discounts</span>
                        </NavLinkItem>
                        <NavLinkItem to="/discounts/add" onClick={props.close}>
                            <Icon src="/images/icons/plus.svg" alt="" onError={(e) => e.target.style.display='none'} />
                            <span>Post a Discount</span>
                        </NavLinkItem>
                        <NavLinkItem to="/help" onClick={props.close}>
                            <Icon src="/images/icons/help.svg" alt="" onError={(e) => e.target.style.display='none'} />
                            <span>Help & Support</span>
                        </NavLinkItem>
                    </NavLinks>

                    <Divider />

                    {props.user ? (
                        <UserSection>
                            <UserInfo>
                                {props.user.photoURL ? (
                                    <UserAvatar src={props.user.photoURL} alt="" />
                                ) : (
                                    <UserAvatar src="/images/icons/user.svg" alt="" />
                                )}
                                <UserDetails>
                                    <UserName>{props.user.displayName || 'User'}</UserName>
                                    <UserEmail>{props.user.email}</UserEmail>
                                </UserDetails>
                            </UserInfo>
                            <UserLinks>
                                <NavLinkItem to="/dashboard" onClick={props.close}>
                                    Dashboard
                                </NavLinkItem>
                                <NavLinkItem to="/logout" onClick={props.close} className="logout">
                                    Logout
                                </NavLinkItem>
                            </UserLinks>
                        </UserSection>
                    ) : (
                        <AuthSection>
                            <LoginButton to="/login" onClick={props.close}>
                                Login / Sign Up
                            </LoginButton>
                        </AuthSection>
                    )}
                </ScrollArea>
                
                <Footer>
                    <p>&copy; 2026 Quick Discount</p>
                </Footer>
            </Sidenav>
        </Container>
    )
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
  transition: opacity 0.3s ease;
`;

const Sidenav = styled.div`
    width: 300px;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    color: #333;
`;

const Header = styled.div`
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
`;

const Logo = styled.img`
    height: 40px;
`;

const CloseBtn = styled.button`
    font-size: 28px;
    color: #666;
    border: none;
    background: none;
    cursor: pointer;
    line-height: 1;
    &:hover { color: #fa8128; }
`;

const ScrollArea = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
`;

const SearchWrapper = styled.div`
    padding: 10px 20px 20px;
`;

const NavLinks = styled.div`
    display: flex;
    flex-direction: column;
`;

const NavLinkItem = styled(Link)`
    display: flex;
    align-items: center;
    padding: 12px 25px;
    text-decoration: none;
    color: #444;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        background-color: #fff5ee;
        color: #fa8128;
        padding-left: 30px;
    }

    &.logout {
        color: #d9534f;
        &:hover { background-color: #fdf2f2; }
    }
`;

const Icon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 15px;
    opacity: 0.7;
`;

const Divider = styled.div`
    height: 1px;
    background-color: #eee;
    margin: 15px 25px;
`;

const UserSection = styled.div`
    padding: 10px 0;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding: 0 25px 15px;
`;

const UserAvatar = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fa8128;
`;

const UserDetails = styled.div`
    margin-left: 12px;
    overflow: hidden;
`;

const UserName = styled.div`
    font-weight: 600;
    font-size: 15px;
    color: #222;
`;

const UserEmail = styled.div`
    font-size: 12px;
    color: #888;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const UserLinks = styled.div`
    display: flex;
    flex-direction: column;
`;

const AuthSection = styled.div`
    padding: 20px 25px;
`;

const LoginButton = styled(Link)`
    display: block;
    background-color: #fa8128;
    color: white;
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
    &:hover { background-color: #e67624; }
`;

const Footer = styled.div`
    padding: 15px;
    text-align: center;
    font-size: 12px;
    color: #aaa;
    border-top: 1px solid #eee;
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
    }
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
