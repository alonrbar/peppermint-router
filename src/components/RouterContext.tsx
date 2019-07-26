import * as React from 'react';
import { HashRouter, RouteInfo } from '../logic';

export interface RouterContextValue {
    router: HashRouter;
    currentRoute: RouteInfo;
    setCurrentRoute: (route: RouteInfo) => void;
}

export const RouterContext = React.createContext<RouterContextValue>(undefined);