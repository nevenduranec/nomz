var React = require('react');
var ReactDOM = require('react-dom');
var routes = require('./config/routes');
require('./css/foundation.min.css');

ReactDOM.render(
    routes,
    document.getElementById('app')
);
