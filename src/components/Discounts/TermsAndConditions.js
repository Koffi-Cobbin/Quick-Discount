import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TermsAndConditions = (props) => {
  return (
    <Container>
      <Content>
        <BackLink to="/">
          ← Back to Home
        </BackLink>

        <Header>
          <Title>Terms and Conditions</Title>
          <Subtitle>QuickDiscount - Ghana's fastest way to find & run discounts</Subtitle>
        </Header>

        <Section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to QuickDiscount, Ghana's premier discount discovery platform. 
            By accessing and using our platform, you agree to abide by the following 
            terms and conditions.
          </p>
        </Section>

        <Section>
          <h2>2. User Accounts</h2>
          <p>
            To use certain features of QuickDiscount, you may need to create an account. 
            You are responsible for maintaining the confidentiality of your account 
            information and accept responsibility for all activities under your account.
          </p>
        </Section>

        <Section>
          <h2>3. Discount Posting</h2>
          <p>
            Organizers can post discounts on QuickDiscount. By posting a discount, you 
            represent and warrant that you have the necessary rights and permissions 
            to do so, and you agree to provide accurate and complete information.
          </p>
        </Section>

        <Section>
          <h2>4. Platform Usage</h2>
          <p>
            QuickDiscount provides a platform to discover and share discounts. Users 
            acknowledge that QuickDiscount is not responsible for the actual discounts 
            or deals posted by third parties.
          </p>
        </Section>

        <Section>
          <h2>5. Intellectual Property</h2>
          <p>
            All content on QuickDiscount, including text, graphics, logos, and images, 
            are owned by QuickDiscount and protected by intellectual property laws. 
            You may not use or distribute any content without written permission.
          </p>
        </Section>

        <Section>
          <h2>6. Limitation of Liability</h2>
          <p>
            QuickDiscount shall not be liable for any indirect, incidental, or 
            consequential damages arising from the use of our platform. We do not 
            endorse or guarantee the accuracy of any user-generated content.
          </p>
        </Section>

        <Section>
          <h2>7. Governing Law</h2>
          <p>
            These terms shall be governed by the laws of Ghana. Any disputes arising 
            from the use of QuickDiscount shall be subject to the exclusive jurisdiction 
            of the courts of Ghana.
          </p>
        </Section>

        <Footer>
          <p>
            Please review these terms carefully before using QuickDiscount. 
            By using our platform, you agree to be bound by these terms.
          </p>
          <LastUpdated>Last updated: January 1, 2026</LastUpdated>
        </Footer>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background-color: #0e0c0b;
  color: rgba(240, 236, 230, 0.8);
  padding: 100px 20px 40px;
  min-height: 100vh;
  font-family: Inter, Roboto, sans-serif;
`;

const Content = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #fa8128;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  transition: color 0.2s;

  &:hover {
    color: #e07010;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(240, 236, 230, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #f5f0e8;
  margin: 0 0 8px;
  font-family: Georgia, serif;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: rgba(240, 236, 230, 0.5);
  margin: 0;
`;

const Section = styled.section`
  margin-bottom: 28px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #fa8128;
    margin: 0 0 12px;
  }

  p {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(240, 236, 230, 0.75);
    margin: 0;
  }
`;

const Footer = styled.div`
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(240, 236, 230, 0.1);

  p {
    font-size: 14px;
    color: rgba(240, 236, 230, 0.6);
    line-height: 1.6;
    margin: 0 0 16px;
  }
`;

const LastUpdated = styled.p`
  font-size: 13px;
  color: rgba(240, 236, 230, 0.4);
  font-family: 'Courier New', monospace;
`;

export default TermsAndConditions;
