import * as React from 'react';
import { HashRouter, RouteInfo } from '../logic';
import { RouterContext } from './RouterContext';

export interface RouterViewProps {
    routerRef?: (router: HashRouter) => void;
}

class RouterViewState {
    public currentRoute: RouteInfo = {
        path: undefined,
        params: undefined
    };
}

export class RouterView extends React.Component<RouterViewProps, RouterViewState> {

    private router = new HashRouter();

    constructor(props: RouterViewProps) {
        super(props);
        this.state = new RouterViewState();
    }

    public componentDidMount() {
        this.router.listen();
    }

    public render() {

        if (this.props.routerRef) {
            this.props.routerRef(this.router);
        }

        return (
            <RouterContext.Provider
                value={{
                    router: this.router,
                    currentRoute: this.state.currentRoute,
                    setCurrentRoute: this.setCurrentRoute
                }}
            >
                {this.props.children}
            </RouterContext.Provider>
        );
    }

    private setCurrentRoute = (currentRoute: RouteInfo) => {
        this.setState({ currentRoute });
    };
}