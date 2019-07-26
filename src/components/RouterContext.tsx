import * as React from 'react';
import { HashRouter, RouteParams } from '../logic';

export interface CurrentRoute {
    path: string;
    params: RouteParams;
}

export interface RouterContextValue {
    router: HashRouter;
    currentRoute: CurrentRoute;
    setCurrentRoute: (route: CurrentRoute) => void;
}

export const RouterContext = React.createContext<RouterContextValue>(undefined);