var React = require('react');
var PropTypes = React.PropTypes;
var Timestamp = require('react-timeago').default;
const {Grid, Row, Col} = require('react-flexbox-grid');

import CircularProgress from 'material-ui/CircularProgress';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="Actions"
        tooltipPosition="bottom-right"
    >
        <MoreVertIcon color={grey400} />
    </IconButton>
);


function ListNomz (props) {

    var createItem = function(item, index) {
        var edit = false;

        if (props.user.uid === item.user.uid){
            edit = true;
        }
        return (
            <Col xs={12} key={ index }>
            <List>
                <ListItem
                    disabled={true}
                    leftAvatar={<Avatar src={ item.user.photoURL } title={ item.user.email.replace('@burza.hr','').replace('@gmail.com','') } />}
                    rightIconButton={
                        <IconMenu iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={props.onPlusOne.bind(null, item)}>+1</MenuItem>
                            <MenuItem>Forward</MenuItem>
                            <MenuItem>Delete</MenuItem>
                        </IconMenu>
                    }
                    primaryText={<h1>{ item.nom }</h1>}
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>{ item.nomPrice }</span><br />
                            <Timestamp date={ item.time } />
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
            </List>
            </Col>
        );
        // return (
        //         <div className="secondary-content"><a href="#!" className="dropdown-button btn-floating deep-orange accent-2 waves-effect waves-light" data-activates={ 'edit-dropdown-' + index }><i className="material-icons left">edit</i></a></div>

        //             <li className="green lighten-2"><span className="white-text" onClick={ props.onPlusOne.bind(null, index, item['.key']) }><i className="material-icons left">playlist_add</i>+1</span></li>
        //             { edit && <li className="orange lighten-2"><span className="white-text" onClick={ props.onEditItem.bind(null, index, item['.key']) }><i className="material-icons left">edit</i>Edit</span></li> }
        //             { edit && <li className="red"><span className="white-text" onClick={ props.onRemoveItem.bind(null, item['.key'], item.user.uid) }><i className="material-icons left">delete</i>Delete</span></li> }

        // );
    };


    if (props.isLoading === true) {
        return <CircularProgress size={2} />
    } else {
        if (props.noResults){
            return <Row>No results for today</Row>
        } else {
             return <Row><h1>Todays orders</h1>{ props.items.map(createItem) }</Row>
        }
    }




}

ListNomz.propTypes = {
    noResults: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onPlusOne: PropTypes.func.isRequired,
    user: PropTypes.object
}

module.exports = ListNomz;
