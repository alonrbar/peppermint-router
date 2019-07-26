import { Route, RouteFallback, RouterView } from 'peppermint-router';
import * as React from 'react';
import { AboutPage, ErrorPage404, HomePage } from './pages';

const styles = {
    menu: {
        display: 'inline-block',
        padding: 15,
        border: '1px solid #ddd',
        borderRadius: 15
    },
    link: {
        marginLeft: 5,
        marginRight: 5
    }
};

export class App extends React.PureComponent {
    public render() {
        return (
            <RouterView>

                <div style={styles.menu}>
                    <a href="#/" style={styles.link}>Root</a>
                    <a href="#/home" style={styles.link}>Home</a>
                    <a href="#/about" style={styles.link}>About</a>
                    <a href="#/something" style={styles.link}>Not exits</a>
                </div>

                <Route path="/" component={HomePage} />
                <Route path="home" component={HomePage} />
                <Route path="about" component={AboutPage} />
                <RouteFallback component={ErrorPage404} />

            </RouterView>
        );
    }
}