var React = require('react');
var ReactFireMixin = require('reactfire');
var ListNomz = require('./ListNomz');

var OrderContainer = React.createClass({

    mixins: [ReactFireMixin],

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function(){
        var date = new Date(),
            today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

        return {
            items: [],
            today: today
        }
    },

    componentWillMount: function() {

        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                this.context.router.push({
                    pathname: '/'
                });
            } else {
                this.state.firebaseRef = firebase.database().ref(this.state.today);
                this.bindAsArray(this.state.firebaseRef, 'items');
                this.state.user = user;
            }
        }.bind(this));

    },

    componentDidUpdate: function() {
        $('.dropdown-button').dropdown({
            constrain_width: true,
            constrainwidth: true
        });
    },

    handleRemoveItem: function(key, uid) {
        if (this.state.user.uid === uid) {
            this.state.firebaseRef.child(key).remove();
        }
    },

    handleEditItem: function(index, key) {
        this.refs.edit.value = key;
        this.refs.nom.value = this.state.items[index].nom;
        this.refs.nomPrice.value = this.state.items[index].nomPrice;
        Materialize.updateTextFields();
    },

    handleSubmitOrder: function(e){
        e.preventDefault();

        var isEdit = this.refs.edit.value.length > 0 ? true : false;

        if (!isEdit){
            this.firebaseRefs['items'].push({
                user: {
                    name: this.state.user.displayName,
                    email: this.state.user.email,
                    uid: this.state.user.uid
                },
                nom: this.refs.nom.value,
                nomPrice: this.refs.nomPrice.value,
                time: Date.now()
            });
        } else {
            var child = this.state.firebaseRef.child(this.refs.edit.value);
            child.update({
                nom: this.refs.nom.value,
                nomPrice: this.refs.nomPrice.value,
                time: Date.now()
            });
        }

        this.refs.orderForm.reset();
        Materialize.updateTextFields();

    },
    signOut: function() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }, function(error) {
          // An error happened.
        });
    },
    render: function() {
        return (
            <div className="col s12">

                <ListNomz
                    items={this.state.items}
                    onRemoveItem={ this.handleRemoveItem }
                    onEditItem={ this.handleEditItem }
                    user={this.state.user}
                />

                <form ref="orderForm" onSubmit={this.handleSubmitOrder} className="row">
                    <input type="hidden" ref="edit" value="" />
                    <div className="input-field col s8">
                        <input
                            ref="nom"
                            type="text"
                            id="nom"
                            className="validate"
                            required
                        />
                        <label htmlFor="nom">What do you want to order?</label>
                    </div>
                    <div className="input-field col s2">
                        <input
                            ref="nomPrice"
                            type="number"
                            id="nomPrice"
                            className="validate"
                            required
                        />
                        <label htmlFor="nomPrice">How much does it cost?</label>
                    </div>
                    <div className="input-field col s2">
                        <button
                            className="btn blue lighten-1 waves-effect waves-light btn-large"
                            type="submit"
                        >
                            <i className="material-icons right">send</i> Order!
                        </button>
                    </div>
                </form>

                <button className="button" onClick={this.signOut}>Sign out</button>
            </div>
        )
    }
});

module.exports = OrderContainer;
