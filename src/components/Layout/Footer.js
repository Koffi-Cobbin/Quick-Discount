import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const Footer = (props) => {

    return (
        <FooterSection>
            <Layout>
                <LeftSide>
                    <h3>
                        <b>Sitemap</b>
                    </h3>
                    <p>
                        <a href="/">Home</a>
                    </p>
                    <p>
                        <a href="/discounts">Discounts</a>
                    </p>
                    <p>
                        <a href="/discounts/add">Post</a>
                    </p>
                    <p>
                        <a href="/help">Help</a>
                    </p>
                    <p>
                        <a href="/login">Login</a>
                    </p>
                    <p>
                        <a href="/signup">Sign up</a>
                    </p>
                </LeftSide>

                <Main>
                    <h3>
                        <b>Let's Vybe</b>
                    </h3>
                    <p>
                        <a
                            href="https://wa.me/+233598972791"
                            target="_blank"
                            rel="noreferrer"
                        >
                            WhatsApp
                        </a>
                    </p>
                    <p>
                        <a
                            href="https://x.com/quickdiscountgh"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Twitter / X
                        </a>
                    </p>
                    <p>
                        <a
                            href="https://www.instagram.com/quickdiscountgh?igsh=bGZpeWltb284NXJs"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Instagram
                        </a>
                    </p>
                    <p>
                        <a
                            href="https://web.facebook.com/people/Quick-Discount-Gh/61558936265288/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Facebook
                        </a>
                    </p>
                    <p>
                        <a
                            href="https://www.tiktok.com/@quickdiscountgh"
                            target="_blank"
                            rel="noreferrer"
                        >
                            TikTok
                        </a>
                    </p>
                    <p>
                        <a
                            href="https://www.youtube.com/channel/UCD33fbhaEHeK5rgfC-eWveg"
                            target="_blank"
                            rel="noreferrer"
                        >
                            YouTube
                        </a>
                    </p>
                </Main>

                <RightSide>
                    <div className="footer-logo">
                        <img src="/images/logo-w.png" alt="QuickDiscount" />
                    </div>
                    <p>Ablekuma-Pokuase, Accra</p>
                    <p>Greater Accra Region</p>
                    <p>
                        Call Us: <a href="tel:+233598972791">+233598972791</a>
                    </p>
                    <p>
                        <a
                            href="mailto:quickdiscountgh@gmail.com"
                            className="footer-mail"
                        >
                            Leave a mail
                        </a>
                    </p>
                </RightSide>
            </Layout>
            <Copyright>
                <p className="text-center">
                    Copyright © 2026{" "}
                    <a href="/" className="text-center">
                        QuickDiscountGhLtd
                    </a>
                    . All rights reserved.
                </p>
                <p className="text-center">
                    Designed by Koffi Cobbin
                </p>
            </Copyright>
        </FooterSection>
    );
};

const FooterSection = styled.div`
    background-color: rgba(220, 103, 14, 0.78); 
    color: white;
    padding: 10px;
    margin-bottom: 0;
    font-size: 14px;
`;

const Layout = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    text-align: left;
    h3 {
        color: #fff;
        padding-bottom: 10px;
    }
    p {
        /* font-size: 14px; */
        padding: 1px;
        line-height: 1.5;
        a {
            text-decoration: none;
            color: white;
        }
    }
    @media (min-width: 768px) {
        width: 80%;
        margin: 20px auto;
    }
`;

const LeftSide = styled.div`
    width: 30%;
    @media (max-width: 480px) {
        text-align: center;
        width: 100%;
    }
`;

const Main = styled.div`
    width: 30%;
    @media (max-width: 480px) {
        text-align: center;
        width: 100%;
    }
`;

const RightSide = styled.div`
    width: 30%;
    & .footer-logo {
        margin: 20px 0;
        & > img {
            width: 200px;
        }
    }
    & .footer-mail {
        border: 1px solid white;
        padding: 2px 5px;
        border-radius: 5px;
    }
    @media (max-width: 480px) {
        text-align: center;
        width: 100%;
    }
`;

const Copyright = styled.div`
    margin-top: 30px;
    p {
        /* font-size: 13px; */
        margin: 10px auto;
        line-height: 1.5;
        .text-center {
            color: white;
            text-decoration: none;
            margin: 1 2px;
            padding: 5px;
            font-weight: 600;
        }
    }
`;

const mapStateToProps = (state) => {
    return {
        categories: state.discountState.categories,
    };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
