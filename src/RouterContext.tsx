import * as React from 'react';
import { HashRouter, RouteParams } from './hashRouter';

export interface CurrentRoute {
    path: string;
    params: RouteParams;
}

export interface RouterContext {
    router: HashRouter;
    currentRoute: CurrentRoute;
    setCurrentRoute: (route: CurrentRoute) => void;
}

export const { Provider: RouterProvider, Consumer: RouterConsumer } = React.createContext<RouterContext>(undefined);