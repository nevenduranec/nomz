var React = require('react');
var Firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyDPJ293TkV64b5qJoJU5VdNrOPJkEf9Ths",
    authDomain: "react-5f9c4.firebaseapp.com",
    databaseURL: "https://react-5f9c4.firebaseio.com",
    storageBucket: "react-5f9c4.appspot.com",
};

firebase.initializeApp(firebaseConfig);

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
            <div>
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            <a href="#!" className="brand-logo center"><img src={require('../assets/images/logo_burza.png')} /><img src={require('../assets/images/logo.png')} /></a>
                            <ul className="right hide-on-med-and-down">
                                {this.state.loggedIn && <li><a onClick={this.signOut}><i className="material-icons left">settings_power</i>Logout</a></li>}
                            </ul>
                        </div>
                    </nav>
                </div>
                <div className='container Main'>
                    <div className='row'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Main;
