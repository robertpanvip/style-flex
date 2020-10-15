import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './demo/app';
render(<AppContainer><App /></AppContainer>, document.getElementById('app'));
/*if (module.hot) {
    module.hot.accept('./demo/app', () => {
        const App = require('./demo/app').default;
        render(<AppContainer><App /></AppContainer>, document.getElementById('app'));
    });
}*/
