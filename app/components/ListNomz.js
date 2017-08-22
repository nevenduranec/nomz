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
import TimeIcon from 'material-ui/svg-icons/Image/timelapse';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import PlusOneIcon from 'material-ui/svg-icons/social/plus-one';
import PriceIcon from 'material-ui/svg-icons/editor/monetization-on';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import PersonIcon from 'material-ui/svg-icons/social/person';

import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';

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

    var total = 0,
        createItem = function(item, index) {
            var edit = false,
                editPlace = false,
                row = false;

            if (props.user && props.user.uid === item.user.uid){
                edit = true;
            }

            if (item.place !== 'Select a place'){
                editPlace = true;
            }

            if (index % 3 === 0){
                row = true;
            }

            total += parseInt(item.nomPrice);

            return (
                <Col xs={12} md={6} lg={4} key={ index }>
                <List className="Nomz-item">

                    <ListItem
                        disabled={true}
                        leftAvatar={<Avatar className="Nomz-avatar" src={ item.user.photoURL } title={ item.user.email.replace('@trikoder.net','').replace('@gmail.com','') } />}

                        rightIconButton={
                            props.loggedIn && edit ?
                                <IconMenu iconButtonElement={iconButtonElement}>
                                    <MenuItem onTouchTap={props.onEditItem.bind(null, index, item['.key'], 'nom')} leftIcon={<EditIcon />}>Edit</MenuItem>
                                    <Divider />
                                    { item.user && <MenuItem onTouchTap={props.onRemoveItem.bind(null, item['.key'], item.user.uid, 'nom')} leftIcon={<DeleteIcon />}>Delete</MenuItem>}
                                </IconMenu>
                            :
                            props.loggedIn ? <IconButton
                                    onTouchTap={props.onPlusOne.bind(null, item)}
                                    touch={true}
                                    tooltip="I want this too!"
                                    tooltipPosition="bottom-right"
                                >
                                    <PlusOneIcon color={grey400} />
                                </IconButton>
                            :
                                <div></div>
                        }

                        primaryText={<div><span className="Nomz-user">{ item.user.name ? item.user.name : item.user.email.replace('@trikoder.net','').replace('@gmail.com','') }</span><h2 className="Nomz-title">{ item.nom }</h2></div>}
                        secondaryText={
                        <div className="Nomz-info">
                            <span className="Nomz-place">
                            { item.place !== 'Select a place' ? <PlaceIcon /> : '' }{ item.place !== 'Select a place' ? item.place : '' }</span>
                            <span className="Nomz-price"><PriceIcon /> { item.nomPrice } kn</span>
                            <span className="Nomz-time"><TimeIcon /> <Timestamp date={ item.time } /></span>
                        </div>
                        }
                        secondaryTextLines={2}
                    />

                </List>
                </Col>
            );
        };


    if (props.isLoading === true) {
        return <Row center="xs"><CircularProgress size={2} /></Row>
    } else {
        if (props.noResults){
            return <Row center="xs"><h1>No orders yet :/</h1></Row>
        } else {
            return <span>
                <Row center="xs"><Col xs={12}><h1>Orders</h1></Col></Row>
                <Paper zDepth={1} rounded={false} style={{'padding': '0 5px'}}>
                    <Row className="fb-stretch fb-center">{ props.items.map(createItem) }</Row>
                </Paper>
                <Row end="xs"><h2>Total: { total } kn</h2></Row>
            </span>
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
