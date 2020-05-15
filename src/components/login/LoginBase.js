import React, { Component } from 'react';
import styled from 'styled-components';
import {withRouter} from "react-router-dom";
import Login from '../login/Login'
import { Button } from '../../views/design/Button';



const Text = styled.div`
      font-size: 30px;
      color: #ffffff
        margin-top: 200px;
`;

const Sign = styled.div`
      font-size: 30px;
      color: #ffffff
     
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 800px;
  width: 800px;
  border-radius: 20px;
  align-items: flex-start;  
  padding-left: 20px;
  margin-left: calc(50% - 400px);

`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 200px;
  width: 800px;
  align-items: flex-start;  
  margin-left: calc(50% - 400px);

`;





class LoginBase extends Component {

    componentDidMount() {
        this.props.changeMusicToDim()
    }

    render(){
        return(
            <div>
            {!localStorage.getItem("confirmed")? (
                <FormContainer>
                <Text>The game you are about to play may contain flashing images and quick images.
                    If you are pregnant or have heart problems, please do not play this game.
                    The developers of this game are not responsible of any kind of damage.
                    This game is a fangame of the game called "Just One".
                    This game was only made for fun. If you find any glitch, error or bug,
                    please report it via email, link in the description. And please play it on Google Chrome
                    for all the features ;).
                    <br></br>
                    <br></br>
                    <Container>
                    <Sign>Confirm to continue>>>>>>>>>>>>>>>>>></Sign><Button
                        height= "80px;"
                        width="400px;"
                        onClick={() => {
                     localStorage.setItem("confirmed", "true");
                     this.forceUpdate();
                }}> I'm not pregnant and I have no heart problems...  yet
                </Button><Sign></Sign>
                    </Container>
                </Text>
                    </FormContainer>

        ) : (
                <Login changeMusicToDim={this.props.changeMusicToDim} > </Login>
        )}
            </div>

        );

    }
}
export default withRouter(LoginBase);