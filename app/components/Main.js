var React = require('react');
var Firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyDPJ293TkV64b5qJoJU5VdNrOPJkEf9Ths",
    authDomain: "react-5f9c4.firebaseapp.com",
    databaseURL: "https://react-5f9c4.firebaseio.com",
    storageBucket: "react-5f9c4.appspot.com",
};

firebase.initializeApp(firebaseConfig);

const {Grid, Row, Col} = require('react-flexbox-grid');

var Main = React.createClass({

    getInitialState: function(){
        return {
            loggedIn: false
        }
    },
    componentWillMount: function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.setState({
                    loggedIn: true
                });
            } else {
                this.setState({
                    loggedIn: false
                });
            }
        }.bind(this));
    },
    signOut: function() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }, function(error) {
          // An error happened.
        });
    },
    render: function () {
        return (
            <Grid>
                {this.props.children}
            </Grid>
        )
    }
});

module.exports = Main;
