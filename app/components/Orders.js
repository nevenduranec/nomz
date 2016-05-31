var React = require('react');
var ReactFireMixin = require('reactfire');

var ListNomz = React.createClass({
    render: function() {
        var _this = this;
        var createItem = function(item, index) {
            var edit = false;
            if (_this.props.user.uid === item.user.uid){
                edit = true;
            }
            return (
                <li key={ index }>
                    { item.user.email }
                    { item.nom }
                    { item.nomPrice }
                    { edit && <span onClick={ _this.props.removeItem.bind(null, item['.key'], item.user.uid) }>DELETE</span>}
                    { edit && <span onClick={ _this.props.editItem.bind(null, index, item['.key']) }>EDIT</span>}
                </li>
            );
        };
        return <ul className="column small-12 no-bullet">{ this.props.items.map(createItem) }</ul>;
    }
});


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

    removeItem: function(key, uid) {
        if (this.state.user.uid === uid) {
            this.state.firebaseRef.child(key).remove();
        }
    },

    editItem: function(index, key) {
        this.refs.edit.value = key;
        this.refs.nom.value = this.state.items[index].nom;
        this.refs.nomPrice.value = this.state.items[index].nomPrice;
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
                nomPrice: this.refs.nomPrice.value
            });
        } else {
            var child = this.state.firebaseRef.child(this.refs.edit.value);
            child.update({
                nom: this.refs.nom.value,
                nomPrice: this.refs.nomPrice.value
            });
        }

        this.refs.orderForm.reset();

    },
    render: function() {
        return (
            <div className="column small-12">
                <ListNomz items={this.state.items} removeItem={ this.removeItem } editItem={ this.editItem } user={this.state.user} />
                <div className="column small-12">
                    <form ref="orderForm" onSubmit={this.handleSubmitOrder}>
                        <input type="hidden" ref="edit" value="0" />
                        <label>
                            <input
                                ref="nom"
                                placeholder="What do you want to order?"
                                type="text"
                            />
                        </label>
                        <label>
                            <input
                                ref="nomPrice"
                                placeholder="How much does it cost?"
                                type="text"
                            />
                        </label>
                        <button
                            className="button"
                            type="submit"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        )
    }
});

module.exports = OrderContainer;
