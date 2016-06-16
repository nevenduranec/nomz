var React = require('react');
var PropTypes = React.PropTypes;
var Timestamp = require('react-timeago').default;
const {Grid, Row, Col} = require('react-flexbox-grid');

import CircularProgress from 'material-ui/CircularProgress';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';


const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="Actions"
        tooltipPosition="bottom-right"
    >
        <MoreVertIcon color={grey400} />
    </IconButton>
);

function ListPlaces (props) {

    var createItem = function(item, index) {
        var edit = false;

        if (props.user.uid === item.user.uid){
            edit = true;
        }
        return (
            <Col xs={12} key={ index }>
            <Card>
                <CardHeader
                    title={ item.user.email.replace('@burza.hr','').replace('@gmail.com','') }
                    avatar={ item.user.photoURL }
                />
                <CardMedia>
                    <iframe src={item.placeURL} width="100%" height="500px" frameborder="0" allowfullscreen></iframe>
                </CardMedia>
                <CardTitle title={ item.placeName } subtitle={ <Timestamp date={ item.time } /> } />
                <CardActions>
                    <IconMenu iconButtonElement={iconButtonElement}>
                        <MenuItem onTouchTap={props.onEditItem.bind(null, index, item['.key'], 'place')} leftIcon={<EditIcon />}>Edit</MenuItem>
                        <Divider />
                        <MenuItem onTouchTap={props.onRemoveItem.bind(null, item['.key'], item.user.uid, 'place')} leftIcon={<DeleteIcon />}>Delete</MenuItem>
                    </IconMenu>
                </CardActions>
            </Card>
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

ListPlaces.propTypes = {
    noResults: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    user: PropTypes.object
}

module.exports = ListPlaces;
