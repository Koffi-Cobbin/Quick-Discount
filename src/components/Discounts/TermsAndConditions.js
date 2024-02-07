import React from "react";
import styled from "styled-components";

const TermsAndConditions = (props) => {
  return (
    <Container>
      <Content>
        <h1>QuickEvents - Terms and Conditions</h1>

        <ol>
          <li>
            <h2>Acceptance of Terms</h2>
            <p>
              Welcome to QuickEvents, an event posting and ticketing platform serving
              Ghana. By accessing and using our platform, you agree to abide by the
              following terms and conditions.
            </p>
          </li>
        
          <li>
            <h2>User Accounts</h2>
            <p>
              In order to use certain features of QuickEvents, you may need to create
              a user account. You are responsible for maintaining the
              confidentiality of your account information and agree to accept
              responsibility for all activities that occur under your account.
            </p>            
          </li>

          <li>
            <h2>Event Posting</h2>
            <p>
              Event organizers can post their events on QuickEvents. By posting an
              event, you represent and warrant that you have the necessary rights
              and permissions to do so, and you agree to provide accurate and
              complete information about the event.
            </p>           
          </li>

          <li>
            <h2>Ticketing</h2>
            <p>
              QuickEvents offers a ticketing service for events. Event organizers and
              attendees acknowledge that QuickEvents is not responsible for the actual
              event and any issues related to the event itself. Refunds and
              cancellations may be subject to the event organizer's policies.
            </p>            
          </li>

          <li>
            <h2>Intellectual Property</h2>
            <p>
              The content and materials on QuickEvents, including but not limited to
              text, graphics, logos, and images, are owned or licensed by QuickEvents
              and protected by intellectual property laws. You may not use,
              reproduce, or distribute any content without written permission from
              QuickEvents.
            </p>            
          </li>

          <li>
            <h2>Limitation of Liability</h2>
            <p>
              QuickEvents shall not be liable for any indirect, incidental, special,
              or consequential damages arising out of or in connection with the use
              of our platform. We do not endorse, guarantee, or warrant the accuracy
              or reliability of any event or user-generated content.
            </p>            
          </li>

          <li>
            <h2>Governing Law</h2>
            <p>
              These terms and conditions shall be governed by and construed in
              accordance with the laws of Ghana. Any disputes arising from the use
              of QuickEvents shall be subject to the exclusive jurisdiction of the
              courts of Ghana.
            </p>            
          </li>
        </ol>

        <p>
          Please review these terms and conditions carefully before using
          QuickEvents. By using our platform, you agree to be bound by these
          terms. If you do not agree with any part of these terms, please
          refrain from using QuickEvents.
        </p>

        <p>Last updated: 1st Sempteber, 2023.</p>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  text-align: left;
  line-height: 1.5;
  margin-top: 50px;
  min-height: 90vh;
  font-family: Arial, sans-serif;
`;

const Content = styled.div`
  width: 80%;
  margin: 0 auto;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #fa8128;
  }
  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
  }
  ul {
    margin-left: 20px;
  }
`;

export default TermsAndConditions;
