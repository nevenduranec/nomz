var React = require('react');
var ReactFireMixin = require('reactfire');
var ListNomz = require('./ListNomz');
var ReactDOM = require('react-dom');

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';

const customContentStyle = {
    width: '100%',
    maxWidth: 'none',
};

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
            items: [],
            nomzRef: today + '/nomz/',
            placesRef: today + '/places/',
            open: false
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
                this.bindAsArray(this.state.firebaseRefNomz, 'items');
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

    handlePlusOne: function(index, key) {
        this.refs.nom.value = this.state.items[index].nom;
        this.refs.nomPrice.value = this.state.items[index].nomPrice;
        this.refs.submit.click();
    },

    handleSubmitOrder: function(e){
        e.preventDefault();

        var isEdit = this.refs.edit.value.length > 0 ? true : false;

        if (!isEdit){
            this.firebaseRefs['items'].push({
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
    openCloseModal: function(event) {
        event === 'open' ? this.setState({open: true}) : this.setState({open: false});
    },
    render: function() {
        var actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.openCloseModal.bind(null,'close')}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.openCloseModal.bind(null,'close')}
          />,
        ];
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
            <div className="col s12">

                <ListNomz
                    items={this.state.items}
                    onRemoveItem={ this.handleRemoveItem }
                    onEditItem={ this.handleEditItem }
                    onPlusOne={ this.handlePlusOne }
                    user={this.state.user}
                    isLoading={this.state.loading}
                    noResults={this.state.noResults}
                />


                <Dialog
                title="Your order"
                open={this.state.open}
                actions={actions}
                contentStyle={customContentStyle}
                onRequestClose={this.openCloseModal.bind(null,'close')}
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

                <FloatingActionButton onTouchTap={this.openCloseModal.bind(null,'open')}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
            </MuiThemeProvider>
        )
    }
});

module.exports = OrderContainer;
