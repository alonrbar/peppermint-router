import * as React from 'react';
import { RouterContext, RouterContextValue } from './RouterContext';

export interface RouteFallbackProps {
    component: React.ComponentType<any>;
}

export class RouteFallback extends React.Component<RouteFallbackProps> {

    public render() {
        return (
            <RouterContext.Consumer>
                {this.renderRoute}
            </RouterContext.Consumer>
        );
    }

    private renderRoute = (context: RouterContextValue) => {

        this.registerRoute(context);

        if (context.currentRoute.path !== null)
            return null;

        return (
            React.createElement(
                this.props.component,
                {
                    route: context.currentRoute
                }
            )
        );
    };

    private registerRoute(context: RouterContextValue) {
        context.router.fallback = () => context.setCurrentRoute({
            path: null,
            params: null
        });
    }
}