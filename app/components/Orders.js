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
                    { edit && <span onClick={ _this.props.editItem.bind(null, index, item.user.uid) }>EDIT</span>}
                </li>
            );
        };
        return <ul>{ this.props.items.map(createItem) }</ul>;
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
                console.log(this.state.today)
                var firebaseRef = firebase.database().ref(this.state.today);
                this.bindAsArray(firebaseRef, 'items');
                this.state.user = user;
            }
        }.bind(this));

    },

    removeItem: function(key, uid) {
        if (this.state.user.uid === uid) {
            var firebaseRef = firebase.database().ref(this.state.today);
            firebaseRef.child(key).remove();
        }
    },

    editItem: function(index, uid) {
        this.refs.edit.value = 1;

        if (this.state.user.uid === uid) {
            console.log(this.state.items[index]);
        }
    },

    handleSubmitOrder: function(e){
        e.preventDefault();

        console.log(this.refs.edit.value)
        var isEdit = this.refs.edit.value == '1' ? true : false;

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

            this.refs.orderForm.reset();
        } else {
            console.log('EDIT');
        }

    },
    render: function() {
        return (
            <div>
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
