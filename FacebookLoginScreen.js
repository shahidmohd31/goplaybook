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
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
var userDetail = {};
class FacebookLoginScreen extends Component {
  goToHomePage(accessToken) {
    this.props.navigator.replace({id: 'Homepage',gameKey: {'fbLogin': true}});
  }

  componentWillMount () {
    console.log(AccessToken)

    AccessToken.getCurrentAccessToken().then(
      (data) => {
        if(data)
        this.goToHomePage();
      }
    )
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
    // play services are available. can now configure library
    })
    .catch((err) => {
      console.log("Play services error", err.code, err.message);
    })
    GoogleSignin.configure({
      webClientId: '227849209457-eq1c54f1h938m1ig4r8hqi48ip3gdhq5.apps.googleusercontent.com' // client ID of type WEB for your server (needed to verify user ID and offline access)
    })
    .then(() => {
      // you can now call currentUserAsync()
    });
  }

  gmailLogin(){
    GoogleSignin.signIn()
    .then((user) => {
      user.fbLogin = false;
      this.props.navigator.replace({id: 'Homepage',gameKey: user});
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }
  render() {
    return (

      <View style={styles.container}>
      
        <GoogleSigninButton
    style={{width: 230, height: 48}}
    size={GoogleSigninButton.Size.Wide}
    color={GoogleSigninButton.Color.Dark}
        onPress={this.gmailLogin.bind(this)}/>




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