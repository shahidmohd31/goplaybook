import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,Button
} from 'react-native';
import firebase from 'firebase';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';


const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class Homepage extends Component {

 firebaseChecking(result){
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

       var ref = firebase.database().ref('user');
       ref.orderByChild('email').equalTo(result.email).once('value',(data)=> {
        console.log(data.toJSON())


        if (data.toJSON() != null) {
          console.log("user exist in db");
         
          var usrVerified = false;
          data.forEach(function(childSnapshot) {
            console.log(childSnapshot);
          usrVerified = childSnapshot.toJSON().verify;
         // var childData = childSnapshot.val();
       });

          if (!usrVerified) {
            alert("Please verify you E-mail");
            
            this.setState({verified: 'Email verification needed'});
          }else{
                this.setState({verified: 'Email verified'});

              };
          this.setState({welcomeM: 'welcome Back to our app'});
                      this.setState({loading: false})

          firebase.auth().onAuthStateChanged(function(user) { 
            if (user.emailVerified) {
              console.log('Email is verified');

               firebase.database().ref('user/'+ result.id).update(
                {
                  'verify': true
                }
               ).then(() => {
                console.log("data updated success");
               }).catch((error) => {
                    console.log(error);

               });
              // alert("email verified already")
            }
            // else {
            //   alert("email not verified")
            //  // Homepage.setState({verified: 'email not verified,please check your mail'});
            // }
          });

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
                    firebase.auth().onAuthStateChanged(function(user) {
                      user.sendEmailVerification(); 
                    });
                    })
                    .catch(() => {
                        // this.setState({ error: 'Authentication failed.', loading: false });
                        alert("user insert failed");
                    });
            });
    


        }else{
          // console.log("new user hai ye...");
          this.setState({welcomeM: 'Congratulations,for joining us!'});

            firebase.database().ref('user/'+ result.id).set(
        {
          'name':result.name,
          'email': result.email,
          'pic' : this.state.pic,
          'verify': false
        }
       ).then(() => {
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
                      console.log("user insertion success in email verification...");
                      this.setState({loading: false,verified: 'Not verified'});
                    firebase.auth().onAuthStateChanged(function(user) {
                      user.sendEmailVerification(); 
                    });
                    })
                    .catch(() => {
                        // this.setState({ error: 'Authentication failed.', loading: false });
                        alert("user insert failed");
                    });
            });
        console.log("data inserted success");
       }).catch((error) => {
            console.log(error);

       });


        }
        // console.log(data.toJSON());
       })


  };
  _responseInfoCallback = (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {

            this.setState({name: result.name, pic: result.picture.data.url});
            this.firebaseChecking(result);
    }
  }



  componentWillMount() {

    console.log(this.props.gameKey);
    if (this.props.gameKey.fbLogin == true) {
      this.setState({fbLogin: true});

      const infoRequest = new GraphRequest(
      '/me?fields=email,gender,name,picture.type(large)',
      null,
      this._responseInfoCallback
    );
    new GraphRequestManager().addRequest(infoRequest).start();
    } else{
      this.setState({name: this.props.gameKey.name, pic: this.props.gameKey.photo,gmail:true});

      this.firebaseChecking(this.props.gameKey);
      
    };
  }

  constructor() {
    super();
    this.state = {
      name : '',
      pic : '',
      email:'',
      welcomeM:'checking you in our db',
      verified: 'checking if verified',
      loading: true,
      fbLogin: false,
      gmail: false

    }
  }
  gmailSignOut(){
     this.props.navigator.replace({id:'FirstScreen'})
    GoogleSignin.signOut()
      .then(() => {
        console.log('out');
      })
      .catch((err) => {

      });
  }

  render(route, navigator) {
    console.log("heyyyyyy " +route);
    return (
      <View style={styles.container}>
        {this.state.loading &&
                  <View style={styles.loading}>
                      <ActivityIndicator size="large" color="#0000ff"/>
                  </View>
                  }
              <Text style={styles.welcomeMsg}>{this.props.gameKey.fbLogin}</Text>
              <Text style={styles.welcomeMsg}>{this.state.verified}</Text>

        <Text style={styles.welcomeMsg}>{this.state.welcomeM}</Text>
        <Text style={styles.name}>{this.state.email}</Text>
        <Text style={styles.name}>{this.state.name}</Text>
        <Image source={{uri:this.state.pic}} style={styles.image} />

         {this.state.fbLogin &&
                  <LoginButton
          onLogoutFinished = {() => {
            this.props.navigator.replace({id:'FirstScreen'})
          }}
        />
                  }

                  {this.state.gmail &&
                  <Button
                  onPress={this.gmailSignOut.bind(this)}
                  title="Logout"
                  color="#841584"
                  accessibilityLabel="Learn more about this purple button"
                />
                  }

                  

        
      </View>
    );
  }
  showLoading() {
       this.setState({loading: true})
    };

    hideLoading() {
       this.setState({loading: false})
    };
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
  },
  loading: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.5,
            backgroundColor: 'black',
            flex: 10,
            // justifyContent: 'center',
            alignItems: 'center'
        }
});

export default Homepage;