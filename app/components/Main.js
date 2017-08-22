var React = require('react');
var Firebase = require('firebase');
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';

var firebaseConfig = {
    apiKey: "AIzaSyB5oZ-9giafN5zEK3YRPHtK4JhUnuDh0pU",
    authDomain: "nomz-6d3bb.firebaseapp.com",
    databaseURL: "https://nomz-6d3bb.firebaseio.com",
    projectId: "nomz-6d3bb",
    storageBucket: "nomz-6d3bb.appspot.com",
    messagingSenderId: "707080662890"
};

firebase.initializeApp(firebaseConfig);

const {Grid, Row, Col} = require('react-flexbox-grid');

var Main = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {
            loggedIn: false,
            openPlacesModal: false
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
            this.setState({
                loggedIn: false
            });
        }.bind(this), function(error) {
          // An error happened.
      });
    },
    addPlace: function() {
        this.setState({
            openPlacesModal: true
        });
    },
    render: function () {
        return (
            <div className="Main">
                {this.props.children &&
                <AppBar
                    title={
                        <span className="Logos">
                            <img src={require('../assets/images/logo.png')} />
                        </span>
                    }
                    showMenuIconButton={false}
                    iconElementRight={
                        this.state.loggedIn ?
                        <IconMenu
                          iconButtonElement={
                            <IconButton><MoreVertIcon /></IconButton>
                          }
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                          <MenuItem primaryText="Add place" onTouchTap={this.addPlace} />
                          <Divider />
                          <MenuItem primaryText="Sign out" onTouchTap={this.signOut} />
                        </IconMenu>
                        :
                        <div></div>
                    }
                />}
                <Grid>
                    {this.props.children ? React.cloneElement(this.props.children, { loggedIn: this.state.loggedIn, openPlacesModal: this.state.openPlacesModal }) : <Row center="xs"><img src={require('../assets/images/logo.png')} className="IntroLogo"/></Row>}
                    {this.props.children && <Row center="xs"><h1>Bon appétit!</h1></Row>}
                </Grid>
            </div>
        )
    }
});

module.exports = Main;
