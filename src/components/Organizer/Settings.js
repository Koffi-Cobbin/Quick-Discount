import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Row from "../UI/Row";
import Column from "../UI/Column";
import FormEntry from "../UI/FormEntry";
import { isContactValid, isEmailValid } from "../../utils/middleware";
import { updateOrganizerAPI } from "../../actions";

const Settings = (props) => {
  const [email, setEmail] = useState(props.organizer.email);
  const [contact, setContact] = useState(props.organizer.phone_number);
  const [username, setUsername] = useState(props.organizer.name);
  const [location, setLocation] = useState(props.organizer.location);
  const [social_media_handle, setHandle] = useState(
    props.organizer.social_media_handle
  );
  const [file, setFile] = useState(null);
  // ERRORS
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");

  const validateEmail = (value) => {
    setEmail(value);
    let emailRes = isEmailValid(value);
    setEmailError(emailRes[1] ? emailRes[1] : "");
  };

  const validateContact = (value) => {
    setContact(value);
    let contactRes = isContactValid(value);
    setContactError(contactRes[1] ? contactRes[1] : "");
  };

  const handleOrganizerUpdate = (e) => {
    e.preventDefault();

    // Create a new FormData object to send data including the file
    const payload = new FormData();
    payload.append("name", username);
    payload.append("email", email);
    payload.append("contact", contact);
    payload.append("location", location);
    payload.append("social_media_handle", social_media_handle);
    payload.append("profile_pic", file);

    // Log the contents of the FormData object
    for (const entry of payload.entries()) {
      console.log(entry[0], entry[1]);
    }
    props.updateOrganizer(payload);
  };

  return (
    <Container>
      <Section>
        <Title>Organizer Info</Title>
        <Row className="max-480">
          <Column className="col-50">
            <FormEntry
              className=""
              label={{
                name: "Username",
                iconClass: "fa fa-user",
              }}
              input={{
                id: "username",
                type: "text",
                placeholder: props.organizer.name,
                value: username,
                onChange: (e) => setUsername(e.target.value),
                required: "required",
              }}
            />
          </Column>

          <Column className="col-50">
            <FormEntry
              className=""
              label={{
                name: "Email",
                iconClass: "fa fa-envelope",
              }}
              input={{
                id: "email",
                type: "email",
                placeholder: props.organizer.email,
                value: email,
                onChange: (e) => validateEmail(e.target.value),
                required: "required",
              }}
            />

            {emailError && <p className="error">{emailError}</p>}
          </Column>
        </Row>

        <Row className="max-480">
          <Column className="col-50">
            <FormEntry
              className=""
              label={{
                name: "Contact",
                iconClass: "fa fa-phone",
              }}
              input={{
                id: "contact",
                type: "tel",
                placeholder: props.organizer.phone_number,
                value: contact,
                onChange: (e) => validateContact(e.target.value),
                required: "required",
              }}
            />
            {contactError && <p className="error">{contactError}</p>}
          </Column>

          <Column className="col-50">
            <FormEntry
              className=""
              label={{
                name: "Profile picture",
                iconClass: "fa fa-file-photo-o",
              }}
              input={{
                id: "profile-pic",
                type: "file",
                onChange: (e) => setFile(e.target.files[0]),
                required: "required",
              }}
            />
          </Column>
        </Row>

        <Row className="max-480">
          <Column className="col-50">
            <FormEntry
              className=""
              label={{
                name: "Location",
                iconClass: "fa fa-map-marker",
              }}
              input={{
                id: "location",
                type: "text",
                placeholder: props.organizer.location,
                value: location,
                onChange: (e) => setLocation(e.target.value),
                required: "required",
              }}
            />
          </Column>

          <Column className="col-50">
            <FormEntry
              className=""
              label={{
                name: "Handle",
                iconClass: "fa fa-link",
              }}
              input={{
                id: "handle",
                type: "text",
                placeholder: props.organizer.social_media_handle,
                value: social_media_handle,
                onChange: (e) => setHandle(e.target.value),
                required: "required",
              }}
            />
          </Column>
        </Row>

        <Row>
          <About>{props.organizer.description}</About>
        </Row>

        <Row>
          <Column>
            <SaveButton onClick={(event) => handleOrganizerUpdate(event)}>
              Save
            </SaveButton>
          </Column>
        </Row>
      </Section>
    </Container>
  );
};

const Container = styled.div``;

const Section = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 30px 10px;
  margin-bottom: 10px;
  position: relative;
  text-align: left;
  p.error {
    color: red;
    margin-top: -15px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h4`
  color: #fa8128;
  margin: 0 0 10px 8px;
  /* text-align: center; */
  padding-bottom: 10px;
`;

const SaveButton = styled.button`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #3e8ede;
  margin: 0 1rem;
  color: #fff;
`;

const About = styled.p`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 10px;
  margin: 0 8px 8px 8px;
  font-size: 16px;
  line-height: 1.5;
  width: 100%;
  height: fit-content;
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    organizer: state.organizerState.organizer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateOrganizer: (payload) => {
    dispatch(updateOrganizerAPI(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
