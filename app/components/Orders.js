var React = require('react');
var ReactFireMixin = require('reactfire');
var ListNomz = require('./ListNomz');
var ReactDOM = require('react-dom');

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';

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
            noResults: false,
            loading: true,
            itemsz: [], //tODO
            nomzRef: today + '/nomz/',
            placesRef: today + '/places/',
            orderModal: {
                open: false
            }
        }
    },

    componentWillMount: function() {

        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                this.context.router.push({
                    pathname: '/'
                });
            } else {
                this.state.firebaseRefNomz = firebase.database().ref(this.state.nomzRef);
                this.bindAsArray(this.state.firebaseRefNomz, 'itemsz');
                this.state.user = user;
                this.state.loggedIn = true;
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

    handleRemoveItem: function(key, uid, type) {
        if (this.state.user.uid === uid) {
            this.state.firebaseRefNomz.child(key).remove();
        }
    },

    handleEditItem: function(index, key, type) {
        this.refs.edit.value = key;
        this.refs.nom.value = this.state.items[index].nom;
        this.refs.nomPrice.value = this.state.items[index].nomPrice;
    },

    handlePlusOne: function(item) {
        this.firebasePush({
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

        var isEdit = this.refs.edit.value.length > 0 ? true : false;

        if (!isEdit){
            this.firebasePush({
                user: {
                    name: this.state.user.displayName,
                    email: this.state.user.email,
                    uid: this.state.user.uid,
                    photoURL: this.state.user.photoURL
                },
                nom: this.refs.nom.value,
                nomPrice: this.refs.nomPrice.value,
                time: Date.now()
            });
        } else {
            var child = this.state.firebaseRefNomz.child(this.refs.edit.value);
            child.update({
                nom: this.refs.nom.value,
                nomPrice: this.refs.nomPrice.value,
                time: Date.now()
            });
        }

        this.refs.orderForm.reset();


    },
    openCloseModal: function(event, modalType) {
        event === 'open' ? this.setState({[modalType]: {open: true}}) : this.setState({[modalType]: {open: false}});
    },
    firebasePush: function(obj) {
        this.firebaseRefs['itemsz'].push(obj);
    },
    render: function() {
        var actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.openCloseModal.bind(null,'close', 'orderModal')}
          />,
          <FlatButton
            label="Order"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.openCloseModal.bind(null,'close', 'orderModal')}
          />,
        ];
        return (

            <Grid>


                <ListNomz
                    items={this.state.itemsz}
                    onRemoveItem={ this.handleRemoveItem }
                    onEditItem={ this.handleEditItem }
                    onPlusOne={ this.handlePlusOne }
                    user={this.state.user}
                    isLoading={this.state.loading}
                    noResults={this.state.noResults}
                />



                <Dialog
                title="Your order"
                open={this.state.orderModal.open}
                actions={actions}
                onRequestClose={this.openCloseModal.bind(null,'close', 'orderModal')}
                >
                    <form ref="orderForm" onSubmit={this.handleSubmitOrder} className="row">
                        <input type="hidden" ref="edit" value="" />
                        <div className="input-field col s12 m5 l7">
                            <input
                                ref="nom"
                                type="text"
                                id="nom"
                                className="validate"
                                required
                            />
                            <label htmlFor="nom">What do you want to order?</label>
                        </div>
                        <div className="input-field col s12 m4 l3">
                            <input
                                ref="nomPrice"
                                type="number"
                                id="nomPrice"
                                className="validate"
                                required
                            />
                            <label htmlFor="nomPrice">How much does it cost?</label>
                        </div>
                        <div className="input-field col s12 m3 l2">
                            <button
                                className="btn blue lighten-1 waves-effect waves-light btn-large"
                                type="submit"
                                ref="submit"
                            >
                                <i className="material-icons right">send</i> Order!
                            </button>
                        </div>
                    </form>
                </Dialog>

                <FloatingActionButton onTouchTap={this.openCloseModal.bind(null,'open', 'orderModal')}>
                    <ContentAdd />
                </FloatingActionButton>

            </Grid>

        )
    }
});

module.exports = OrderContainer;
