import * as React from 'react';
import { RouteParams } from './hashRouter';
import { RouterContext, RouterContextValue } from './RouterContext';

export interface RouteProps {
    path: string;
    component: React.ComponentType<any>;
}

export class Route extends React.Component<RouteProps> {

    public render() {
        return (
            <RouterContext.Consumer>
                {this.renderRoute}
            </RouterContext.Consumer>
        );
    }

    private renderRoute = (context: RouterContextValue) => {

        this.registerRoute(context);

        if (this.props.path !== context.currentRoute.path)
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
        context.router.mapPath(this.props.path, (params: RouteParams) => {
            context.setCurrentRoute({
                path: this.props.path,
                params
            });
        });
    }
}