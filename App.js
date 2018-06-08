/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Navigator
} from 'react-native-deprecated-custom-components';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import FacebookLoginScreen from './FacebookLoginScreen';
import Homepage from './homepage';

// const FBSDK = require('react-native-fbsdk');
// const {
//   LoginButton,
//   AccessToken,GraphRequestManager,GraphRequest
// } = FBSDK;


type Props = {};
export default class App extends Component<Props> {
  render() {
     return (
      <Navigator
        initialRoute={{id: 'FirstScreen', name: 'Index'}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }} />
    );


  }
     renderScene(route, navigator) {
    var routeId = route.id;
    if (routeId === 'FirstScreen') {
      return (
        <FacebookLoginScreen
          navigator={navigator} gameKey={route.gameKey} />
      );
    }
    if (routeId === 'Homepage') {
      return (
        <Homepage
          navigator={navigator} gameKey={route.gameKey}/>
      );
    }
  }
  



}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
