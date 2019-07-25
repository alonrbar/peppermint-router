import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, RouterView } from 'peppermint-router';

/* eslint-disable no-console */

console.log('Starting router');

const router = new HashRouter();
router.mapPath('/', () => console.log('Root path'));
router.mapPath('home', () => console.log('I am home'));
router.mapPath('about', () => console.log('This is me'));
router.fallback = () => console.log('404 - Not Found');
router.listen();

const root = document.getElementById('application-root');
ReactDOM.render(<RouterView />, root);