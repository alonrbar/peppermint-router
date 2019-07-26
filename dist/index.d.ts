import * as React from 'react';

export interface IMap<T> {
    [key: string]: T;
}

//
// HashRouter
//

export interface RouteInfo {
    path: string;
    params: RouteParams;
}

export interface BeforeNavigationEvent {
    prevRoute: RouteInfo;
    nextRoute: RouteInfo;
}

export type BeforeNavigationHandler = (e: BeforeNavigationEvent) => Promise<boolean>;

export interface BeforeUnloadEvent {
    currentRoute: RouteInfo;
}

export type BeforeUnloadHandler = (e: BeforeUnloadEvent) => string;

export type RouteAction = (params: RouteParams) => void;

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

    public readonly currentRoute: RouteInfo;

    public mapPath(path: string, action: RouteAction): void;

    public goTo(path: string): void;

    public goBack(): void;

    public listen(): void;
}

//
// RouterView
//

export interface RouterViewProps {
    routerRef?: (router: HashRouter) => void;
}

export class RouterView extends React.Component<RouterViewProps> { }

//
// Route
//

export interface RouteProps {
    path: string;
    component: React.ComponentType<any>;
}

export class Route extends React.Component<RouteProps> { }

//
// RouteFallback
//

export interface RouteFallbackProps {
    component: React.ComponentType<any>;
}

export class RouteFallback extends React.Component<RouteFallbackProps> { }

//
// PromptNavigation
//

export interface PromptNavigationRenderProps {
    isNavigating: boolean;
    confirm: VoidFunction;
    cancel: VoidFunction;
}

export type PromptNavigationRender = (props: PromptNavigationRenderProps) => React.ReactNode;

export interface PromptNavigationProps {
    enabled?: boolean;
    exitPrompt?: string;
    children?: PromptNavigationRender;
}

export const PromptNavigation: React.FunctionComponent<PromptNavigationProps>;