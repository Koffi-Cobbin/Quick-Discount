import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Row from "../UI/Row";
import Column from "../UI/Column";
import FormEntry from "../UI/FormEntry";
import { isContactValid, isEmailValid } from "../../utils/middleware";
import { userUpdateAPI } from "../../actions";


const Settings = (props) => {
    const [email, setEmail] = useState(props.user.email);
    const [contact, setContact] = useState(props.user.contact);
    const [username, setUsername] = useState(props.user.name);
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

    const handleUserUpdate = (e) => {
        e.preventDefault();
    
        // Create a new FormData object to send data including the file
        const payload = new FormData();
        payload.append('name', username);
        payload.append('email', email);
        payload.append('contact', contact);
        payload.append('profile_pic', file);
    
        // Log the contents of the FormData object
        for (const entry of payload.entries()) {
            console.log(entry[0], entry[1]);
        }
        props.updateUser(payload);
    };

    return (
        <Container>
            <Section>
                <Row className="max-480">
                    <Column className="col-50">
                        <FormEntry 
                            className=""
                            label={{
                                name: "Username",
                                iconClass: 'fa fa-user'
                            }}
                            input={{
                                id: "username",
                                type: 'text',
                                placeholder: props.user.name,
                                value: username,
                                onChange: (e) => setUsername(e.target.value),
                                required: 'required'
                            }}
                        />
                    </Column>

                    <Column className="col-50">
                        <FormEntry 
                            className=""
                            label={{
                                name: 'Email',
                                iconClass: 'fa fa-envelope'
                            }}
                            input={{
                                id: 'email',
                                type: 'email',
                                placeholder: props.user.email,
                                value: email,
                                onChange: (e) => validateEmail(e.target.value),
                                required: 'required'
                            }}
                        />

                        {emailError && (
                        <p className='error'>{emailError}</p>
                        )}
                    </Column>
                </Row>

                <Row className="max-480">
                    <Column className="col-50">
                        <FormEntry 
                            className=""
                            label={{
                                name: 'Contact',
                                iconClass: 'fa fa-phone'
                            }}
                            input={{
                                id: 'contact',
                                type: 'tel',
                                placeholder: props.user.contact,
                                value: contact,
                                onChange: (e) => validateContact(e.target.value),
                                required: 'required'
                            }}
                        />
                    </Column>

                    <Column className="col-50">
                        <FormEntry 
                            className=""
                            label={{
                                name: 'Profile picture',
                                iconClass: 'fa fa-file-photo-o'
                            }}
                            input={{
                                id: 'profile-pic',
                                type: 'file',
                                onChange: (e) => setFile(e.target.files[0]),
                                required: 'required'
                            }}
                        />
                    </Column>
                </Row>

                <Row>
                    <Column>
                            <SaveButton onClick={(event) => handleUserUpdate(event)}>Save</SaveButton>
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

const SaveButton = styled.button`
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #3e8ede;
    margin: 0 1rem;
    color: #FFF;    
`;


const mapStateToProps = (state) => {
    return {
      user: state.userState.user,
    };
  };
  
  const mapDispatchToProps = (dispatch) => ({ 
    updateUser: (payload) => {dispatch(userUpdateAPI(payload))},
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
