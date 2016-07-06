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
import RaisedButton from 'material-ui/RaisedButton';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ContentAddIcon from 'material-ui/svg-icons/content/add';

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
        var edit = false,
            placeImage = '';

        if (props.user.uid === item.user.uid){
            edit = true;
        }

        return (
            <Col xs={6} key={ index } className="Place">
                <Card>
                    <CardHeader
                        title={ item.user.name ? item.user.name : item.user.email.replace('@burza.hr','').replace('@gmail.com','') }
                        avatar={ item.user.photoURL }
                        subtitle={ <Timestamp date={ item.time } /> }
                    />
                    <CardMedia className="Place-image">
                        <a className="Place-link" href={'http://' + item.placeURL.replace('http://','')}><img src={item.placeImage} /></a>
                    </CardMedia>
                    <CardTitle title={<a className="Place-link" href={'http://' + item.placeURL.replace('http://','')}>{item.placeName}</a>} />
                    <CardActions style={{padding: 0}}>
                        { edit && <IconMenu iconButtonElement={iconButtonElement} style={{position: 'absolute', bottom: '7px', right: 0}}>
                            <MenuItem onTouchTap={props.onEditItem.bind(null, index, item['.key'], 'place')} leftIcon={<EditIcon />}>Edit</MenuItem>
                            <Divider />
                            <MenuItem onTouchTap={props.onRemoveItem.bind(null, item['.key'], item.user.uid, 'place')} leftIcon={<DeleteIcon />}>Delete</MenuItem>
                        </IconMenu>}
                    </CardActions>
                </Card>
            </Col>
        );
    };


    if (props.isLoading === true) {
        return <Row center="xs"><CircularProgress size={2} /></Row>
    } else {
        if (props.noResults){
            return (
                <div>
                    <Row center="xs"><h1>No places yet :/</h1></Row>
                    <Row center="xs">
                        <RaisedButton
                            onTouchTap={props.onAddPlace}
                            primary={true}
                            label="Add place"
                            icon={<ContentAddIcon />} />
                    </Row>
                </div>
            )
        } else {
             return <span><Row center="xs"><Col xs={12}><h1>Today's menu</h1></Col></Row><Row className="fb-center">{ props.items.map(createItem) }</Row></span>
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
