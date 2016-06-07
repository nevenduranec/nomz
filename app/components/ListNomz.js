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
            <tr key={ index }>
                <td>{ item.user.email.replace('@burza.hr','').replace('@gmail.com','') }</td>
                <td className="full">{ item.nom }</td>
                <td>{ item.nomPrice }</td>
                <td className="time"><Timestamp date={ item.time } /></td>
                { edit && <td><span className="button-group small"><span className="button alert" onClick={ props.onRemoveItem.bind(null, item['.key'], item.user.uid) }><span className="fa fa-trash fa-lg"></span></span><span className="button success" onClick={ props.onEditItem.bind(null, index, item['.key']) }><span className="fa fa-pencil fa-lg"></span></span></span></td>}
            </tr>
        );
    };
    return <table className="hover stack"><thead><tr><th>Name</th><th>Nom</th><th>Price</th><th>Time</th><th>Actions</th></tr></thead><tbody>{ props.items.map(createItem) }</tbody></table>;
}

List.propTypes = {
    items: PropTypes.array.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    user: PropTypes.object
}

module.exports = List;
