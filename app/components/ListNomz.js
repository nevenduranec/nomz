var React = require('react');
var PropTypes = React.PropTypes;
var Timestamp = require('react-timeago').default;

function List (props) {
    var createItem = function(item, index) {
        var edit = false;
        if (props.user.uid === item.user.uid){
            edit = true;
        }
        return (
            <li className="collection-item avatar" data-key={ index }>
                <img src="" alt={ item.user.email.replace('@burza.hr','').replace('@gmail.com','') } className="circle" />
                <span className="collection-title">{ item.user.email.replace('@burza.hr','').replace('@gmail.com','') } - { item.nom }</span>
                <p>
                    { item.nomPrice } <br />
                    <Timestamp date={ item.time } />
                </p>
                { edit && <div className="secondary-content"><a href="#!" className="dropdown-button btn deep-orange accent-2 waves-effect waves-light" data-activates={ 'edit-dropdown-' + index }><i className="material-icons left">edit</i> Actions</a></div>}
                {
                    edit
                    &&
                    <ul id={ 'edit-dropdown-' + index } className="dropdown-content">
                        <li className="orange lighten-2"><span className="white-text" onClick={ props.onEditItem.bind(null, index, item['.key']) }><i className="material-icons left">edit</i>Edit</span></li>
                        <li className="divider"></li>
                        <li className="red"><span className="white-text" onClick={ props.onRemoveItem.bind(null, item['.key'], item.user.uid) }><i className="material-icons left">delete</i>Delete</span></li>
                    </ul>
                }
            </li>
        );
    };
    return <ul className="collection with-header"><li className="collection-header center-align"><h4>First Names</h4></li>{ props.items.map(createItem) }</ul>;
}

List.propTypes = {
    items: PropTypes.array.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    user: PropTypes.object
}

module.exports = List;
