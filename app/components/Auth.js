var React = require('react');
var ReactRouter = require('react-router');

var Auth = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
            user: ''
        }
    },
    componentWillMount: function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.context.router.push({
                    pathname: '/orders/'
                });
            }
        }.bind(this));
    },
    signInWithGoogle: function () {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {

            this.state.token = result.credential.accessToken;
            this.state.user = result.user;

        }.bind(this)).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

    },
    render: function () {
        return (
            <div>
                <button className="button" onClick={this.signInWithGoogle}>Google</button>
            </div>
        )
    }
});

module.exports = Auth;
