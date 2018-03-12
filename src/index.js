import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { AppRouter } from './routers/AppRouter';
import { Provider } from 'react-redux';
import { saveState } from './storage/localStorage'

const store = configureStore();

store.subscribe(() => {
    saveState(store.getState());
})

const template = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
)

ReactDOM.render(template, document.getElementById('root'));
registerServiceWorker();
