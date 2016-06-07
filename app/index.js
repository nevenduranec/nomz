var React = require('react');
var ReactDOM = require('react-dom');
var routes = require('./config/routes');
require('./assets/css/foundation.css');
require('./assets/css/font-awesome.css');
require('./assets/css/app.scss');

ReactDOM.render(
    routes,
    document.getElementById('app')
);
