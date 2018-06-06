import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native';
import firebase from 'firebase';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class Homepage extends Component {

  //Create response callback.
  _responseInfoCallback = (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      // alert(JSON.stringify(result));

            this.setState({name: result.name, pic: result.picture.data.url});

          var config = {
        apiKey: "AIzaSyA4arEqqFAbinXNxESiW1yAvPmduQk3JMw",
        authDomain: "reactnative-9d929.firebaseapp.com",
        databaseURL: "https://reactnative-9d929.firebaseio.com",
        projectId: "reactnative-9d929",
        storageBucket: "reactnative-9d929.appspot.com",
        messagingSenderId: "227849209457"
        };
        if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
        console.log("helllooooo");
        // console.log(firebase);

       //  firebase.database().ref('user/005').set(
       //  {
       //    'name':'hemraj',
       //    'age': '28'
       //  }
       // ).then(() => {
       //  console.log("data inserted success");
       // }).catch((error) => {
       //      console.log(error);

       // });

        var ref = firebase.database().ref('user');
       ref.orderByChild('email').equalTo(result.email).once('value',(data)=> {
        console.log("hello4")

        if (data.toJSON() != null) {
          console.log("user exist in db");
          this.setState({welcomeM: 'welcome Back to our app'});

          firebase.auth().signInWithEmailAndPassword(result.email, "password")
            .then(() => { 
              console.log("user found in email verification..")
              // this.setState({ error: '', loading: false });
               })
            .catch(() => {
                //Login was not successful, let's create a new account
                firebase.auth().createUserWithEmailAndPassword(result.email, "password")
                    .then(() => { 
                      // this.setState({ error: '', loading: false }); 
                      console.log("user insertion success in email verification...")
                    })
                    .catch(() => {
                        // this.setState({ error: 'Authentication failed.', loading: false });
                        alert("user insert failed");
                    });
            });
    


        }else{
          console.log("new user hai ye...");
          this.setState({welcomeM: 'Congratulations,for joining us!'});

            firebase.database().ref('user/'+ result.id).set(
        {
          'name':result.name,
          'email': result.email,
          'pic' : result.picture.data.url
        }
       ).then(() => {
        console.log("data inserted success");
       }).catch((error) => {
            console.log(error);

       });
        }
        console.log(data.toJSON());
       })
    console.log("helllooooo2");





    }
  }



  componentWillMount() {
    // Create a graph request asking for user information with a callback to handle the response.
    const infoRequest = new GraphRequest(
      '/me?fields=email,gender,name,picture.type(large)',
      null,
      this._responseInfoCallback
    );
// const infoRequest = new GraphRequest('/me', {
//                                parameters: {
//                                    fields: {
//                                        string: 'email,name,first_name,last_name'
//                                    }
//                                }
//                            }, responseInfoCallback);
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  constructor() {
    super();
    this.state = {
      name : '',
      pic : '',
      email:'',
      welcomeM:'checking you in our db'
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeMsg}>{this.state.welcomeM}</Text>
        <Text style={styles.name}>{this.state.email}</Text>
        <Text style={styles.name}>{this.state.name}</Text>
        <Image source={{uri:this.state.pic}} style={styles.image} />
        <LoginButton
          onLogoutFinished = {() => {
            this.props.navigator.replace({id:'FirstScreen'})
          }}
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
  image : {
    height : 200,
    width : 200,
    margin : 20
  },
  welcomeMsg : {
    fontSize : 20
  },
  name : {
    fontSize : 40
  }
});

export default Homepage;