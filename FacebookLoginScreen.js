const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

import React, { Component } from 'react';
import {
  View,
  StyleSheet,Button
  } from 'react-native';
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

class FacebookLoginScreen extends Component {
  goToHomePage(accessToken) {
    this.props.navigator.replace({id: 'Homepage'});
  }

  componentWillMount () {
    console.log(AccessToken)
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        if(data)
        this.goToHomePage();
      }
    )
  }

  render() {
    return (

      <View style={styles.container}>
      
    

        <LoginButton


          readPermissions={['public_profile','email']}
          permissions={["email","user_friends","email","user_birthday","picture.type(large)"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    this.goToHomePage();
                  }
                )
              }
            }
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gmailButton : {
    marginBottom: 30,
  }

});

export default FacebookLoginScreen;