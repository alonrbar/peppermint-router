import * as React from 'react';
import { HashRouter } from './hashRouter';
import { RouterProvider, CurrentRoute } from './RouterContext';

export interface RouterViewProps {
    routerRef?: (router: HashRouter) => void;
}

class RouterViewState {
    public currentRoute: CurrentRoute = {
        path: undefined,
        params: undefined
    };
}

export class RouterView extends React.PureComponent<RouterViewProps, RouterViewState> {

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
            <RouterProvider
                value={{
                    router: this.router,
                    currentRoute: this.state.currentRoute,
                    setCurrentRoute: this.setCurrentRoute
                }}
            >
                {this.props.children}
            </RouterProvider>
        );
    }

    private setCurrentRoute = (currentRoute: CurrentRoute) => {
        this.setState({
            currentRoute
        });
    };
}