import * as React from 'react';
import { RouterView, Route } from 'peppermint-router';

export class App extends React.PureComponent {
    public render() {
        return (
            <RouterView>
                <Route path="/" component={null} />
                <Route path="home" component={null} />
                <Route path="about" component={null} />
                <Route path="404" component={null} />
            </RouterView>
        );
    }
}