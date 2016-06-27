var React = require('react');
var ReactFireMixin = require('reactfire');
var ListNomz = require('./ListNomz');
var ListPlaces = require('./ListPlaces');
var ReactDOM = require('react-dom');
var axios = require('axios');

import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import PersonIcon from 'material-ui/svg-icons/social/person';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
            noResultsPlaces: false,
            loadingPlaces: true,
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
            editNom: false,
            editPlace: false,
            selectedPlace: "Select a place"
        }
    },
    componentWillMount: function() {

        firebase.auth().onAuthStateChanged(function(user) {
            this.state.firebaseRefNomz = firebase.database().ref(this.state.nomzRef);
            this.bindAsArray(this.state.firebaseRefNomz, 'nomzez');

            this.state.firebaseRefPlaces = firebase.database().ref(this.state.placesRef);
            this.bindAsArray(this.state.firebaseRefPlaces, 'places');

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

        firebase.database().ref(this.state.placesRef).on('value', function(snapshot) {
            if (!snapshot.val()) {
                this.setState({
                    loadingPlaces: false,
                    noResultsPlaces: true
                });
            } else {
                this.setState({
                    noResultsPlaces: false,
                    loadingPlaces: false
                });
            }
        }.bind(this));

    },

    handleRemoveItem: function(key, uid, type) {
        if (this.state.user.uid === uid) {
            this._fbRemove(type === 'nom' ? 'firebaseRefNomz' : 'firebaseRefPlaces', key);
        }
    },

    handleEditItem: function(index, key, type) {

        if (type === 'nom'){
            this.openCloseModal('open', 'orderModal')
            this.state.editNom = key;

            setTimeout(() => { // https://github.com/callemall/material-ui/issues/3618
                this.refs.nom.input.refs.input.value = this.state.nomzez[index].nom;
                this.refs.nomPrice.input.value = this.state.nomzez[index].nomPrice;
                this.setState({
                    selectedPlace: this.state.nomzez[index].place
                });
            },250);
        } else {
            this.openCloseModal('open', 'placesModal')
            this.state.editPlace = key;

            setTimeout(() => { // https://github.com/callemall/material-ui/issues/3618
                this.refs.placeName.input.value = this.state.places[index].placeName;
                this.refs.placeURL.input.value = this.state.places[index].placeURL;
            },250);
        }

    },

    handlePlusOne: function(item) {
        this._fbAdd('nomzez',{
            user: {
                name: this.state.user.displayName,
                email: this.state.user.email,
                uid: this.state.user.uid,
                photoURL: this.state.user.photoURL
            },
            place: item.place,
            nom: item.nom,
            nomPrice: item.nomPrice,
            time: Date.now()
        });
    },

    handleSubmitOrder: function(e){
        e.preventDefault();

        if (!this.refs.nom.input.refs.input.value || !this.refs.nomPrice.input.value || this.state.places.length !== 0 && this.state.selectedPlace === 'Select a place'){
            return false;
        }

        var isEdit = this.state.editNom ? true : false;

        if (!isEdit){

            this._fbAdd('nomzez',{
                user: {
                    name: this.state.user.displayName,
                    email: this.state.user.email,
                    uid: this.state.user.uid,
                    photoURL: this.state.user.photoURL
                },
                place: this.state.selectedPlace,
                nom: this.refs.nom.input.refs.input.value,
                nomPrice: this.refs.nomPrice.input.value,
                time: Date.now()
            });

        } else {

            this._fbUpdate('firebaseRefNomz', this.state.editNom, {
                place: this.state.selectedPlace,
                nom: this.refs.nom.input.refs.input.value,
                nomPrice: this.refs.nomPrice.input.value,
                time: Date.now()
            });

            this.state.editNom = false;
        }

        this.openCloseModal('close','orderModal');


    },

    handleSubmitPlace: function(e){
        e.preventDefault();

        var isEdit = this.state.editPlace ? true : false;

        this.setState({
            loadingInModal: true
        });

        if (!isEdit){
            axios.get('https://api.embedly.com/1/oembed?', {
                params: {
                  key: ':d22cf61a26344d2691b0c7f48541dfc2',
                  url: this.refs.placeURL.input.value
                }
            })
            .then(function (response) {

                this._fbAdd('places',{
                    user: {
                        name: this.state.user.displayName,
                        email: this.state.user.email,
                        uid: this.state.user.uid,
                        photoURL: this.state.user.photoURL
                    },
                    placeName: this.refs.placeName.input.value,
                    placeURL: this.refs.placeURL.input.value,
                    placeImage: response.data.thumbnail_url || null,
                    time: Date.now()
                });
                this.openCloseModal('close','placesModal');
                this.setState({
                    loadingInModal: false
                });
            }.bind(this))
            .catch(function (err) {
                console.warn('Error in handleSubmitPlace: ', err)
            });

        } else {
            axios.get('https://api.embedly.com/1/oembed?', {
                params: {
                  key: ':d22cf61a26344d2691b0c7f48541dfc2',
                  url: this.refs.placeURL.input.value
                }
            })
            .then(function (response) {
                this._fbUpdate('firebaseRefPlaces', this.state.editPlace, {
                    placeName: this.refs.placeName.input.value,
                    placeURL: this.refs.placeURL.input.value,
                    placeImage: response.data.thumbnail_url,
                    time: Date.now()
                });
                this.state.editPlace = false;
                this.openCloseModal('close','placesModal');
                this.setState({
                    loadingInModal: false
                });

            }.bind(this))
            .catch(function (err) {
                console.warn('Error in handleSubmitPlace: ', err)
            });
        }



    },

    openCloseModal: function(event, modalType) {
        event === 'open' ? this.setState({[modalType]: {open: true}}) : this.setState({
            [modalType]: {open: false},
            selectedPlace: 'Select a place'
        });
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
    handlePlaceChange: function(event, index, value){
        this.setState({
            selectedPlace: value
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
            label="Add"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmitPlace}
            icon={<OrderIcon />}
          />,
        ];
        return (
            <Grid>


                <ListPlaces
                    items={this.state.places}
                    onRemoveItem={ this.handleRemoveItem }
                    onEditItem={ this.handleEditItem }
                    user={this.state.user}
                    loggedIn={this.props.loggedIn}
                    isLoading={this.state.loadingPlaces}
                    noResults={this.state.noResultsPlaces}
                />

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

                    <form ref="orderForm" onSubmit={this.handleSubmitOrder}>
                        <Row>
                            { this.state.places.length > 0 &&
                                <Col xs={12}>
                                    <SelectField
                                        value={this.state.selectedPlace}
                                        ref="place"
                                        fullWidth={true}
                                        name="place"
                                        id="place"
                                        onChange={this.handlePlaceChange}
                                        required
                                    >
                                        <MenuItem key="0" value="Select a place" primaryText="Select a place" />
                                        {
                                            this.state.places.map( (item, index) => (
                                                <MenuItem key={index+1} value={item.placeName} primaryText={item.placeName} />
                                                )
                                            )
                                        }
                                    </SelectField>
                                </Col>
                            }
                            <Col xs={12}>
                                <TextField
                                    floatingLabelText="What do you want to order?"
                                    type="text"
                                    id="nom"
                                    required
                                    ref="nom"
                                    fullWidth={true}
                                    multiLine={true}
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
                    {
                        this.state.loadingInModal && <CircularProgress className="loadingModal" />
                    }

                    <form onSubmit={this.handleSubmitPlace}>
                        <Row>
                            <Col xs={12}>
                                <TextField
                                    floatingLabelText="Place name"
                                    type="text"
                                    id="placeName"
                                    required
                                    ref="placeName"
                                    fullWidth={true}
                                />
                            </Col>
                            <Col xs={12}>
                                <TextField
                                    floatingLabelText="Place URL"
                                    type="url"
                                    id="placeURL"
                                    required
                                    ref="placeURL"
                                    fullWidth={true}
                                />
                            </Col>
                            <FlatButton type="submit" style={{display: 'none'}}>Submit</FlatButton>
                        </Row>
                    </form>


                </Dialog>

                { this.props.loggedIn && <FloatingActionButton onTouchTap={this.openCloseModal.bind(null,'open', 'orderModal')} style={{position: 'fixed', bottom: '20px', right: '20px'}}
                secondary={true}
                >
                    <ContentAdd />
                </FloatingActionButton>}

                { !this.props.loggedIn && <RaisedButton
                    onTouchTap={this.signInWithGoogle} style={{position: 'fixed', bottom: '20px', right: '20px'}}
                    secondary={true}
                    label="Login"
                    icon={<PersonIcon />}
                />
                }

            </Grid>

        )
    }
});

module.exports = OrderContainer;
