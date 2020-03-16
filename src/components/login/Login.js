import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import {InputField} from "../../views/design/InputField";
import {Title} from "../../views/Header"
import {UserWrapper} from "../../views/design/UserWrapper";
import {LockIcon, UserIcon, EyeIcon, EyeStrokeIcon} from "../../views/design/Icon";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align.item: center;
  width: 100%;
  height: 100%;
  font-size: 30px;
`;
const Label = styled.label`
  color: black;
  margin-bottom: 10px;
  font-weight: 900;
  font-size: 40px;
  font-family: 'Open Sans' 
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 55%;
  height: 350px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 2px;
  background: rgb(66 ,66 ,66);
  transition: opacity 0.5s ease, transform 0.5s ease;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: none;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Login extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      passwordVisibility: false,
      showError: false
    };
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  toggleError = () => {
    this.setState((prevState, props) => {return{showError: !prevState.showError}
    })
  };

  toggleErrorFalse = () => {
    this.setState((prevState, props) => {return{showError: false}
    })
  };


  async login() {
    try {
      this.toggleErrorFalse();

      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const url = await api.put('/login', requestBody);

      // Get the returned user and update a new object.
      const response = await api.get(url.headers.location);
      const user = new User(response.data);

      if (user.token != null){
        localStorage.setItem('token', user.token);
        localStorage.setItem('id', user.id);
        this.props.history.push(`/game`);
      }

      if(url.status === 204){
        this.toggleError();
      }
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {}

  render() {
    return (
      <BaseContainer>
        <Container>
          {this.state.showError && <Label className="error-message">User is already logged in!</Label>}
        </Container>
        <Title>Login</Title>
        <FormContainer>
          <Form>
            <UserWrapper>
              <UserIcon
                  marginBottom="2px"
                  marginLeft="2px"
              />
            <InputField
              placeholder="Enter username"
              width="90%"
              onChange={e => {
                this.handleInputChange('username', e.target.value);
              }}
            />
            <Button
                width="1.6rem"
                background={"#424242"}
                boxShadow="null"
                height="1rem"
                disabled="true"
            />
            </UserWrapper>
            <UserWrapper>
              <LockIcon
                  marginBottom="2px"
                  marginLeft="2px"
              />
            <InputField
              placeholder="Enter password"
              width="90%"
              type = {!this.state.passwordVisibility ? "password" : null}
              onChange={e => {
                this.handleInputChange('password', e.target.value);
              }}
            />
            <Button
            width="1.6rem"
            background={"#424242"}
            boxShadow="null"
            height="1rem"
            onClick={() => {this.setState(prevState => ({
            passwordVisibility: !prevState.passwordVisibility}));}}
            >
              {(this.state.passwordVisibility) ?
                  <EyeStrokeIcon
                  marginBottom="null"
                  marginLeft="null"
              /> : <EyeIcon
                  marginBottom="null"
                  marginLeft="null"
              />}

            </Button>
            </UserWrapper>
            <ButtonContainer>
              <Button
                disabled={!this.state.username || !this.state.password}
                width="35%"
                marginTop="20px"
                onClick={() => {
                  this.login();
                }}
              >
                Login
              </Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button
                  width="25%"
                  onClick={() => {
                    this.props.history.push(`/register`);
                  }}
              >
                Sign up
              </Button>
            </ButtonContainer>
          </Form>
        </FormContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
