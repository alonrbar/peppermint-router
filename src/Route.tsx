import * as React from 'react';
import { RouteParams } from './hashRouter';
import { RouterConsumer, RouterContext } from './RouterContext';

export interface RouteProps {
    path: string;
    component: React.ComponentType<any>;
}

export class Route extends React.PureComponent<RouteProps> {

    public render() {
        return (
            <RouterConsumer>
                {this.renderRoute}
            </RouterConsumer>
        );
    }

    private renderRoute = (context: RouterContext) => {

        console.warn('route render');

        this.registerRoute(context);

        if (this.props.path !== context.currentRoute.path)
            return null;

        console.warn('actual render');

        return (
            React.createElement(
                this.props.component,
                {
                    route: context.currentRoute
                }
            )
        );
    };

    private registerRoute(context: RouterContext) {
        context.router.mapPath(this.props.path, (params: RouteParams) => {
            context.setCurrentRoute({
                path: this.props.path,
                params
            });
        });
    }
}