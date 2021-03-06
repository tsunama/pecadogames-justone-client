import React from 'react';
import styled from 'styled-components';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import User from "../shared/models/User";
import {BackgroundContainer} from "../main/Main";
import RedShyguy from "./Assets/ProfilePictures/red.png";
import GreenShyguy from "./Assets/ProfilePictures/green.png";
import BlueShyguy from "./Assets/ProfilePictures/blue.png";
import YellowShyguy from "./Assets/ProfilePictures/yellow.png";
import PurpleShyguy from "./Assets/ProfilePictures/purple.png";
import PinkShyguy from "./Assets/ProfilePictures/pink.png";
import {WindowHeader, PhoneContainer, TextLeft, TextContainer, One, Two, ProfilePicContainer, ProfileContainer, ButtonRow, RowContainer, InvitationContainer, PhoneScreenContainer} from "./Assets/profileAssets";
import { PixelButton } from "../../views/design/PixelButton";
import {AcceptButton, DeclineButton} from "../profile/Assets/RequestBox";
import {InvitationText} from "../lobby/InviteLobbyPhone"

const InputField = styled.input`
  background: transparent;
  margin: 0px;
  margin-left: 5px;
  text-align: left;
  font-size:25px;
  width: 237px;
  border: none;
  color: #c0c0c0;
  border-bottom: 1px solid black;
`;

const ColorContainer = styled(TextContainer)`
    column-count: 1;
    row-count: 2;
    height: 78px;
`;

const ColorButtonContainer = styled.div`
    background: transparent;
    margin-left: 5px;
    margin: 0px;
    width: 500px;
    float:left;
    padding: 4px;
`;

const InputFieldDate = styled(InputField)`
    defaultValue-color: grey;
`;

const SaveButton = styled(PixelButton)`
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    opacity: ${props => (props.disabled ? 0.4 : 1)};
    width: 200px;
    &:hover {
        background: ${props => (props.disabled ? "#118f33" : "default")};
    }
`;

const ColorButton = styled.button`
    background: ${props => props.background|| "white"};
    height: 25px;
    width: 25px;
    margin: 5px;
    margin-left: 28px;
    margin-right: 28px;
    border-color: black;
    border-width: ${props => props.borderWidth|| "1px"};
`;

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            id: null,
            username: null,
            birthday: null,
            avatarColor: null,
            phone: null,
            lobbies: [],
            phoneCheck: false,
            alreadyChanged: true,
            accepted: false,
        };
    }


    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    async updateProfile(){
        try {
            this.checkBirthday(this.state.birthday)
            const requestBody = JSON.stringify({
                userId: localStorage.getItem("id"),
                token: localStorage.getItem("token"),
                username: this.state.username,
                birthday: this.state.birthday,
                avatarColor: this.state.avatarColor,
            })
            await api.put(`users/${this.state.id}`, requestBody);
            this.props.history.push(`/game/users/${this.state.id}`);
        }
        catch(error){
            alert(`Could not update profile: \n${handleError(error)}`)
        }
    }

    checkBirthday(birthday){
        try{
            if(birthday === null){
                return null
            }
            new Date(birthday);
        }
        catch(error){
            alert("Invalid date")
        }
    }

    //method checks if state's color matches color of button
    colorMatcher(colorToMatch) {
        return colorToMatch === this.state.avatarColor;
    }

    //checks if logged in user has permission to be on this page
    userHasPermission(){
        let pathArray = window.location.pathname.split('/');
        let userId = pathArray[pathArray.length-2];
        if (userId !== localStorage.getItem("id")){
            alert("You don't have permissions to edit this profile.")
            this.props.history.push(`/game/users/${this.state.id}`);
        }
    }

    //returns profile pic based on current state
    getProfilePic(){
        if (this.state.avatarColor === "GREEN"){
            return GreenShyguy;
        }
        else if (this.state.avatarColor === "BLUE"){
            return BlueShyguy;
        }
        else if (this.state.avatarColor === "PINK"){
            return PinkShyguy;
        }
        else if (this.state.avatarColor === "PURPLE"){
            return PurpleShyguy;
        }
        else if (this.state.avatarColor === "YELLOW"){
            return YellowShyguy;
        }
        else if (this.state.avatarColor === "RED"){
            return RedShyguy;
        }

    }

    async getInvitation(){
        let interval = setInterval(async()=>{
                const response = await api.get(`/users/${localStorage.getItem('id')}/invitations?token=${localStorage.getItem('token')}`);
                this.handleInputChange('lobbies', response.data)
                this.checkPhone()
                if(this.state.accepted){
                    clearInterval(this.state.phone)
                }
            }
            , 500)
            this.handleInputChange('phone', interval)
    }

    checkPhone(){
        if(this.state.lobbies.length > 0 && !this.state.phoneCheck ){
            this.handleInputChange('phoneCheck', true)
            if (this.state.phoneCheck === true && this.state.alreadyChanged ){
                this.props.changePhoneToOn()
                this.handleInputChange('alreadyChanged', false)
            }
        }
        else if(this.state.lobbies.length === 0){
            this.handleInputChange('phoneCheck', false)
            if (this.state.phoneCheck === false && !this.state.alreadyChanged ){
                this.handleInputChange('alreadyChanged', true)
                this.props.changePhoneToOff()
            }
        }
    }

    async accept(lobbyId){
        try {
            const requestBody = JSON.stringify({
                accepterId: localStorage.getItem('id'),
                accepterToken: localStorage.getItem('token'),
                accepted: true
            });
            await api.put(`/lobbies/${lobbyId}/acceptances`, requestBody);
            this.props.changeTalkingToOn()

        }
        catch(error){

        }
        this.handleInputChange('accepted', true)
        setTimeout(  ()=>localStorage.setItem('lobbyId', lobbyId), 1500)
        setTimeout(  ()=>this.props.history.push('/game'), 1600)
        setTimeout(  ()=>this.props.changeTalkingToOff(), 1600)
    }



    async decline(lobbyId){
        try {
            const requestBody = JSON.stringify({
                accepterId: localStorage.getItem('id'),
                accepterToken: localStorage.getItem('token'),
                accepted: false

            });
            await api.put(`/lobbies/${lobbyId}/acceptances`, requestBody);
        }
        catch(error){

        }
    }

    async componentDidMount() {
        this.props.changeMusicToNormal()
        this.state.id = this.props.match.params.id;
        this.userHasPermission()
        try {
            await api.get(`/users/${this.state.id}?token=${localStorage.getItem('token')}`)
                .then(response => {return new User(response.data)})
                .then(data => this.setState(
                    {user: data,
                        username: data.username,
                        birthday: data.birthday,
                        avatarColor : data.avatarColor,
                       })
                );
        }        catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
        this.getInvitation()
    }

    componentWillUnmount() {
        clearInterval(this.state.phone)
        this.props.changePhoneToOff()

    }


    render() {
        return (
            <BackgroundContainer className={"backgroundMain"}>
            <PhoneContainer className={"phoneProfile"}>
            {this.state.phoneCheck && !this.state.accepted ?  
                    <PhoneScreenContainer>
                        <WindowHeader>
                            ..\LobbyInvitation.js
                        </WindowHeader>
                        {this.state.lobbies.map(lobby => {return(
                            <InvitationContainer>
                                <InvitationText
                                    width="300px"
                                    fontSize="30px">
                                    Invitation to lobby "{lobby.lobbyName}"
                                </InvitationText>
                                <ButtonRow
                                marginTop="20px">
                                    <AcceptButton
                                        marginTop = "0px"
                                        height = "50px"
                                        onClick={() => {this.accept(lobby.lobbyId);}}>
                                        Accept
                                    </AcceptButton>
                                    <DeclineButton
                                        marginTop = "0px"
                                        onClick={() => {this.decline(lobby.lobbyId);}}>
                                        Reject
                                    </DeclineButton>
                                </ButtonRow>
                            </InvitationContainer>
                                                )}
                                                )}
                    </PhoneScreenContainer> 
                    :
                    <PhoneScreenContainer>
                        <WindowHeader>..\Profile\Edit.js</WindowHeader>
                        <ProfileContainer className={"profileContainer"}>
                            <One>
                                <ProfilePicContainer className={"profilePicContainer"}>
                                    <img src={this.getProfilePic()} alt={"Avatar"} className={"profilePicture"}/>
                                    </ProfilePicContainer>
                            </One>
                            <Two>
                                <TextContainer>
                                    <TextLeft>Username:</TextLeft>
                                    <InputField
                                    placeholder={this.state.username}
                                    onChange={e =>{
                                        this.handleInputChange('username', e.target.value)
                                    }}
                                    />
                                </TextContainer>
                                <TextContainer>
                                    <TextLeft>Birthday:</TextLeft>
                                    <InputFieldDate
                                        placeholder={"dd.mm.jjjj"}
                                        defaultValue={this.state.birthday}
                                    onChange={e =>{
                                        this.handleInputChange('birthday', e.target.value)
                                    }}
                                    />
                                </TextContainer>
                                <ColorContainer>
                                    <TextLeft>Pick a color for your profile picture:</TextLeft>
                                    <ColorButtonContainer>
                                        <ColorButton id="RED"
                                                    background={"#b31a1a"}
                                                    borderWidth={(this.colorMatcher("RED")) ? "1px" : "3px"}
                                                    onClick={()=>{
                                                        this.setState({avatarColor: "RED"})
                                                    }}
                                        />
                                        <ColorButton id="GREEN"
                                                    background={"#008a0e"}
                                                    borderWidth={(this.colorMatcher("GREEN")) ? "1px" : "3px"}
                                                    onClick={()=>{
                                                        this.setState({avatarColor: "GREEN"})
                                                    }}
                                        />
                                        <ColorButton id="YELLOW"
                                                    background={"#dece38"}
                                                    borderWidth={(this.colorMatcher("YELLOW")) ? "1px" : "3px"}
                                                    onClick={()=>{
                                                        this.setState({avatarColor: "YELLOW"})
                                                    }}
                                        />
                                        <ColorButton id="BLUE"
                                                    background={"#2b37a8"}
                                                    borderWidth={(this.colorMatcher("BLUE")) ? "1px" : "3px"}
                                                    onClick={()=>{
                                                        this.setState({avatarColor: "BLUE"})
                                                    }}
                                        />
                                        <ColorButton id="PURPLE"
                                                    background={"#562ba8"}
                                                    borderWidth={(this.colorMatcher("PURPLE")) ? "1px" : "3px"}
                                                    onClick={()=>{
                                                        this.setState({avatarColor: "PURPLE"})
                                                    }}
                                        />
                                        <ColorButton id="PINK"
                                                    background={"#cf71dc"}
                                                    borderWidth={(this.colorMatcher("PINK")) ? "1px" : "3px"}
                                                    onClick={()=>{
                                                        this.setState({avatarColor: "PINK"})
                                                    }}
                                        />
                                    </ColorButtonContainer>
                                </ColorContainer>
                                <ButtonRow
                                    marginTop="44px">
                                    <RowContainer>
                                        <PixelButton
                                            onClick={() => {
                                                this.props.history.push(`/game/users/${this.state.id}`);
                                            }}
                                        >
                                            Back
                                        </PixelButton>
                                    </RowContainer>
                                    <RowContainer>
                                        <SaveButton
                                            disabled={!this.state.username || this.state.username.length >10}
                                            onClick={()=>{
                                                this.updateProfile();
                                            }}
                                        >
                                            Save Profile
                                        </SaveButton>
                                    </RowContainer>
                                </ButtonRow>
                            </Two>
                        </ProfileContainer>
                </PhoneScreenContainer>
                }
            </PhoneContainer>
            </BackgroundContainer>
        );
    }
}

export default withRouter(Profile);
