import React, { Component } from "react";
import firebase from "firebase/app"
//import "firebase/auth";
//import { getDatabase } from "firebase/database";
import database from '../../firebase';
//import { Flex, Box, Button, Image, Text, Alert, AlertIcon } from "@chakra-ui/core";
import { Grid, Button, Header, Confirm,Image } from "semantic-ui-react";
//export const database = getDatabase(Fireb);
//import { push, child, ref } from "firebase/database";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: ""
    }
  }
  close = () => this.setState({ error: false })
  
  loginWithGmail = e => {
    e.preventDefault();
	//const auth = firebase.auth();
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
      .then(result => {
        let additionalUserInfo = result.additionalUserInfo;
        
        if (additionalUserInfo.isNewUser) {
          this.addUserList(result);
          
        } else {
          let userRef = database().ref().child("users").child(result.user.uid);
          userRef.once("value", snapshot => {
            var isAvailable = snapshot.val();
            if (!isAvailable) {
              this.addUserList(result);
            } else {
              userRef.update({ photoURL: result.user.photoURL, uid: result.user.uid, displayName: result.user.displayName, name: result.additionalUserInfo.profile.given_name });
            }
          });
          
        }
      })
      .catch(error => {
        var errorMessage = error.message;
        this.setState({ error: true, errorMessage })
      });
  };

  addUserList = result => {
    database()
      .ref()
      .child("users")
      .child(result.user.uid)
      .set({
        name: result.additionalUserInfo.profile.given_name,
        photoURL: result.user.photoURL,
        displayName: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid
      });
  };

  render() {
    return (
      <React.Fragment>
         <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}> 			
            <Confirm
          open={this.state.error}
		  content={this.state.errorMessage}
          onCancel={this.close}
          onConfirm={this.close}
        />
            <Header marginTop={2} fontWeight={600} fontSize="2.5rem" color="orange.300">
              Slack Clone for Domeo Resources
            </Header>
            <Button
              onClick={this.loginWithGmail}
              variantColor="teal"
              size="lg"
              marginTop={5}
            >
              <Image
                src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
                alt="signin-google"
              />
            </Button>
          </Grid.Column>
      </Grid>
      </React.Fragment >
    );
  }
}
export default Login;
