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
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import PlusOneIcon from 'material-ui/svg-icons/social/plus-one';


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

        if (props.user && props.user.uid === item.user.uid){
            edit = true;
        }
        return (
            <Col xs={12} key={ index }>
            <List>
                <ListItem
                    disabled={true}
                    leftAvatar={<Avatar src={ item.user.photoURL } title={ item.user.email.replace('@burza.hr','').replace('@gmail.com','') } />}

                    rightIconButton={
                        props.loggedIn ?
                        <IconMenu iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={props.onPlusOne.bind(null, item)} leftIcon={<PlusOneIcon />}>+1</MenuItem>
                            { edit && <MenuItem onTouchTap={props.onEditItem.bind(null, index, item['.key'], 'nom')} leftIcon={<EditIcon />}>Edit</MenuItem>}
                            { edit && <Divider />}
                            { edit && item.user && <MenuItem onTouchTap={props.onRemoveItem.bind(null, item['.key'], item.user.uid, 'nom')} leftIcon={<DeleteIcon />}>Delete</MenuItem>}
                        </IconMenu>
                        :
                        <div></div>
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
