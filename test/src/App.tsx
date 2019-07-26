import { Route, RouterView } from 'peppermint-router';
import * as React from 'react';
import { AboutPage, ErrorPage404, HomePage } from './pages';

export class App extends React.PureComponent {
    public render() {
        return (
            <RouterView>
                <Route path="/" component={HomePage} />
                <Route path="home" component={HomePage} />
                <Route path="about" component={AboutPage} />
                <Route path="404" component={ErrorPage404} />
            </RouterView>
        );
    }
}