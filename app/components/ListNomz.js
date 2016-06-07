var React = require('react');
var PropTypes = React.PropTypes

function List (props) {
    var createItem = function(item, index) {
        var edit = false;
        if (props.user.uid === item.user.uid){
            edit = true;
        }
        return (
            <li key={ index }>
                { item.user.email.replace('@burza.hr','') }
                { item.nom }
                { item.nomPrice }
                { edit && <span className="button-group small"><span className="button alert" onClick={ props.onRemoveItem.bind(null, item['.key'], item.user.uid) }><span className="fa fa-trash fa-lg"></span></span><span className="button success" onClick={ props.onEditItem.bind(null, index, item['.key']) }><span className="fa fa-pencil fa-lg"></span></span></span>}
            </li>
        );
    };
    return <ul className="column small-12 no-bullet">{ props.items.map(createItem) }</ul>;
}

List.propTypes = {
    items: PropTypes.array.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    user: PropTypes.object
}

module.exports = List;
