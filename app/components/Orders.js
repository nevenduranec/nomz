var React = require('react');
var ReactFireMixin = require('reactfire');
var ListNomz = require('./ListNomz');
var ListPlaces = require('./ListPlaces');
var ReactDOM = require('react-dom');

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import OrderIcon from 'material-ui/svg-icons/action/done';

const {Grid, Row, Col} = require('react-flexbox-grid');


var OrderContainer = React.createClass({

    mixins: [ReactFireMixin],

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function(){
        var date = new Date(),
            today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

        return {
            user: {},
            noResults: false,
            loading: true,
            nomzez: [],
            places: [],
            nomzRef: today + '/nomz/',
            placesRef: today + '/places/',
            orderModal: {
                open: false
            },
            placesModal: {
                open: false
            },
            editNom: false
        }
    },
    componentWillMount: function() {

        firebase.auth().onAuthStateChanged(function(user) {
            this.state.firebaseRefNomz = firebase.database().ref(this.state.nomzRef);
            this.bindAsArray(this.state.firebaseRefNomz, 'nomzez');

            if (user){
                this.setState({
                    user: user
                });
            } else {
                this.setState({
                    user: {}
                });
            }


        }.bind(this));

        firebase.database().ref(this.state.nomzRef).on('value', function(snapshot) {
            if (!snapshot.val()) {
                this.setState({
                    loading: false,
                    noResults: true
                });
            } else {
                this.setState({
                    noResults: false,
                    loading: false
                });
            }
        }.bind(this));

    },

    handleRemoveItem: function(key, uid) {
        if (this.state.user.uid === uid) {
            this._fbRemove('firebaseRefNomz', key);
        }
    },

    handleEditItem: function(index, key, editType) {

        this.openCloseModal('open', 'orderModal')
        this.state.editNom = key;

        setTimeout(() => { // https://github.com/callemall/material-ui/issues/3618
            this.refs.nom.input.value = this.state.nomzez[index].nom;
            this.refs.nomPrice.input.value = this.state.nomzez[index].nomPrice;
        },250);

    },

    handlePlusOne: function(item) {
        this._fbAdd('nomzez',{
            user: {
                name: this.state.user.displayName,
                email: this.state.user.email,
                uid: this.state.user.uid,
                photoURL: this.state.user.photoURL
            },
            nom: item.nom,
            nomPrice: item.nomPrice,
            time: Date.now()
        });
    },

    handleSubmitOrder: function(e){
        e.preventDefault();

        var isEdit = this.state.editNom ? true : false;

        if (!isEdit){

            this._fbAdd('nomzez',{
                user: {
                    name: this.state.user.displayName,
                    email: this.state.user.email,
                    uid: this.state.user.uid,
                    photoURL: this.state.user.photoURL
                },
                nom: this.refs.nom.input.value,
                nomPrice: this.refs.nomPrice.input.value,
                time: Date.now()
            });

        } else {
            this._fbUpdate('firebaseRefNomz', this.state.editNom, {
                nom: this.refs.nom.input.value,
                nomPrice: this.refs.nomPrice.input.value,
                time: Date.now()
            });
            this.state.editNom = false;
        }

        this.openCloseModal('close','orderModal');


    },
    openCloseModal: function(event, modalType) {
        event === 'open' ? this.setState({[modalType]: {open: true}}) : this.setState({[modalType]: {open: false}});
    },
    _fbAdd: function(path, obj) {
        this.firebaseRefs[path].push(obj);
    },
    _fbUpdate: function(path, key, obj){
        var child = this.state[path].child(key);
        child.update(obj);
    },
    _fbRemove: function(path, key){
        this.state[path].child(key).remove();
    },
    signInWithGoogle: function () {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {

            this.setState({
                user: result.user,
                token: result.credential.accessToken,
                loggedIn: true
            });

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
    componentWillReceiveProps: function(nextProps){
        this.setState({
            placesModal: {
                open: nextProps.openPlacesModal
            },
        });
    },
    render: function() {

        var actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.openCloseModal.bind(null,'close', 'orderModal')}
          />,
          <RaisedButton
            label="Order"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmitOrder}
            icon={<OrderIcon />}
          />,
        ];
        var actionsPlaces = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.openCloseModal.bind(null,'close', 'placesModal')}
          />,
          <RaisedButton
            label="Order"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmitOrder}
            icon={<OrderIcon />}
          />,
        ];
        return (
            <Grid>

                <ListNomz
                    items={this.state.nomzez}
                    onRemoveItem={ this.handleRemoveItem }
                    onEditItem={ this.handleEditItem }
                    onPlusOne={ this.handlePlusOne }
                    user={this.state.user}
                    loggedIn={this.props.loggedIn}
                    isLoading={this.state.loading}
                    noResults={this.state.noResults}
                />

                <Dialog
                title="Your order"
                open={this.state.orderModal.open}
                actions={actions}
                onRequestClose={this.openCloseModal.bind(null,'close', 'orderModal')}
                >

                    <form onSubmit={this.handleSubmitOrder}>
                        <Row>
                            <Col xs={12}>
                                <TextField
                                    floatingLabelText="What do you want to order?"
                                    type="text"
                                    id="nom"
                                    required
                                    ref="nom"
                                    fullWidth={true}
                                />
                            </Col>
                            <Col xs={12}>
                                <TextField
                                    floatingLabelText="How much does it cost?"
                                    type="number"
                                    id="nomPrice"
                                    required
                                    ref="nomPrice"
                                    fullWidth={true}
                                />
                            </Col>
                            <FlatButton type="submit" style={{display: 'none'}}>Submit</FlatButton>
                        </Row>
                    </form>
                </Dialog>


                <Dialog
                title="Add place to order from"
                open={this.state.placesModal.open}
                actions={actionsPlaces}
                onRequestClose={this.openCloseModal.bind(null,'close', 'placesModal')}
                >

                    <form onSubmit={this.handleSubmitOrder}>
                        <Row>
                            <Col xs={12}>
                                <TextField
                                    floatingLabelText="What do you want to order?"
                                    type="text"
                                    id="nom"
                                    required
                                    ref="nom"
                                    fullWidth={true}
                                />
                            </Col>
                            <Col xs={12}>
                                <TextField
                                    floatingLabelText="How much does it cost?"
                                    type="number"
                                    id="nomPrice"
                                    required
                                    ref="nomPrice"
                                    fullWidth={true}
                                />
                            </Col>
                            <FlatButton type="submit" style={{display: 'none'}}>Submit</FlatButton>
                        </Row>
                    </form>
                </Dialog>

                <FloatingActionButton onTouchTap={this.openCloseModal.bind(null,'open', 'orderModal')} style={{position: 'fixed', bottom: '20px', right: '20px'}}>
                    <ContentAdd />
                </FloatingActionButton>

                { !this.props.loggedIn && <FloatingActionButton onTouchTap={this.signInWithGoogle} style={{position: 'fixed', bottom: '20px', right: '20px'}}>
                    <ContentAdd />
                </FloatingActionButton>}

            </Grid>

        )
    }
});

module.exports = OrderContainer;
