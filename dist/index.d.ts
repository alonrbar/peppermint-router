import * as React from 'react';

export interface IMap<T> {
    [key: string]: T;
}

//
// HashRouter
//

export type RouteParams = IMap<string>;

export type RouteAction = (params: RouteParams) => void;

export type BeforeNavigationHandler = (nextPath: string) => Promise<boolean>;

export type BeforeUnloadHandler = () => string;

export class HashRouter {

    public fallback: VoidFunction;
    /**
     * Triggered when a navigation inside the application takes place.  
     * Return `false` to cancel navigation.
     */
    public onBeforeNavigation: BeforeNavigationHandler;
    /**
     * Triggered when a navigation to another site takes place.
     * Return a message to show to the user.  
     */
    public onBeforeUnload: BeforeUnloadHandler;

    public mapPath(path: string, action: RouteAction): void;

    public goTo(path: string): void;

    public goBack(): void;

    public listen(): void;
}

//
// RouterView
//

export interface RouterViewProps {
}

export class RouterView extends React.PureComponent<RouterViewProps> { }

//
// Route
//

export interface RouteProps {
    path: string;
    component: React.ComponentType<any>;
}

export class Route extends React.PureComponent<RouteProps> { }