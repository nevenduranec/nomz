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
  render: function () {
    return (
      <div className='container'>
      <div className='row'>
        <div className="col s12"><img src={require('../assets/images/logo.png')} /></div>
        {this.props.children}
      </div>
      </div>
    )
  }
});

module.exports = Main;
