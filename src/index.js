import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WrappedApp from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<WrappedApp />, document.getElementById('root'));
registerServiceWorker();
