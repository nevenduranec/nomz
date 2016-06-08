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
                { item.user.photoURL && <img src={ item.user.photoURL } alt={ item.user.email.replace('@burza.hr','').replace('@gmail.com','') } className="circle" /> }
                <span className="collection-title">{ item.user.email.replace('@burza.hr','').replace('@gmail.com','') } - { item.nom }</span>
                <p>
                    { item.nomPrice } <br />
                    <Timestamp date={ item.time } />
                </p>
                <div className="secondary-content"><a href="#!" className="dropdown-button btn-floating deep-orange accent-2 waves-effect waves-light" data-activates={ 'edit-dropdown-' + index }><i className="material-icons left">edit</i></a></div>

                <ul id={ 'edit-dropdown-' + index } className="dropdown-content">
                    <li className="green lighten-2"><span className="white-text" onClick={ props.onPlusOne.bind(null, index, item['.key']) }><i className="material-icons left">playlist_add</i>+1</span></li>
                    { edit && <li className="orange lighten-2"><span className="white-text" onClick={ props.onEditItem.bind(null, index, item['.key']) }><i className="material-icons left">edit</i>Edit</span></li> }
                    { edit && <li className="red"><span className="white-text" onClick={ props.onRemoveItem.bind(null, item['.key'], item.user.uid) }><i className="material-icons left">delete</i>Delete</span></li> }
                </ul>

            </li>
        );
    };


    return props.isLoading === true ?
        <div className="col s12 center-align">
            <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-blue">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div>
                    <div className="gap-patch">
                        <div className="circle"></div>
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            </div>
        </div>
    :
    <ul className="collection with-header"><li className="collection-header center-align"><h1>Todays orders</h1></li>{ props.items.map(createItem) }</ul>


}

List.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onPlusOne: PropTypes.func.isRequired,
    user: PropTypes.object
}

module.exports = List;
