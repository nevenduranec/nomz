var React = require('react');
var ReactDOM = require('react-dom');
var routes = require('./config/routes');
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

require('./assets/css/app.scss');


ReactDOM.render(
    routes,
    document.getElementById('app')
);
