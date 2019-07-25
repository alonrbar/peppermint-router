import { IMap } from './types';
import { removeStart, removeEnd } from './utils';

// originally based on PathJS: https://github.com/mtrpcic/pathjs

export type RouteParams = IMap<string>;

export type RouteAction = (params: RouteParams) => void;

export type BeforeNavigationHandler = (nextPath: string) => Promise<boolean>;

export type BeforeUnloadHandler = () => string;

interface Route {
    path: string;
    action: RouteAction;
}

interface RouteMatchResult {
    route: Route;
    params: RouteParams;
}

export class HashRouter {

    //
    // public members
    //

    public fallback: VoidFunction;
    /**
     * Triggered when a navigation inside the application takes place.  
     * Return `false` to cancel navigation.
     */
    public get onBeforeNavigation(): BeforeNavigationHandler {
        return this._onBeforeNavigation;
    }
    public set onBeforeNavigation(value: BeforeNavigationHandler) {

        // prevent accidental overwrites
        if (value && this._onBeforeNavigation) {
            throw new Error(
                `${nameof(this.onBeforeNavigation)} handler already exists. Remove the old one before assigning a new handler.`
            );
        }

        this._onBeforeNavigation = value;
    }
    /**
     * Triggered when a navigation to another site takes place.
     * Return a message to show to the user.  
     */
    public get onBeforeUnload(): BeforeUnloadHandler {
        return this._onBeforeUnload;
    }
    public set onBeforeUnload(value: BeforeUnloadHandler) {

        // prevent accidental overwrites
        if (value && this._onBeforeUnload) {
            throw new Error(
                `${nameof(this.onBeforeUnload)} handler already exists. Remove the old one before assigning a new handler.`
            );
        }

        this._onBeforeUnload = value;
    }

    //
    // private members
    //

    private _onBeforeNavigation: BeforeNavigationHandler;
    private _onBeforeUnload: BeforeUnloadHandler;
    private currentRoute: string;
    private readonly routes: IMap<Route> = {};

    //
    // public methods
    //

    public mapPath(path: string, action: RouteAction) {
        path = this.normalizePath(path);
        this.routes[path] = { path, action };
    }

    public goTo(path: string) {
        path = this.normalizePath(path);
        location.hash = '#/' + path;
    }

    public goBack() {
        window.history.back();
    }

    public listen() {

        // register unload handler
        window.addEventListener('beforeunload', e => {
            const promptMessage = (this.onBeforeUnload ? this.onBeforeUnload() : undefined);
            if (promptMessage) {
                e.returnValue = promptMessage;
            }
            return promptMessage;
        });

        // listen to hash changes
        window.addEventListener('hashchange', this.handleHashChanged);

        // handle initial route
        if (location.hash === '') {
            location.hash = '#/';

        } else {
            this.handleHashChanged();
        }
    }

    //
    // private methods
    //

    private handleHashChanged = async (): Promise<void> => {
        let path = location.hash;

        // normalize path
        path = this.normalizePath(path);

        // don't re-navigate to the same page
        if (path === this.currentRoute)
            return;

        // find the route to active
        const matchResult = this.match(path);

        // invoke beforeNavigation handler
        if (this.onBeforeNavigation) {
            const nextPath = matchResult && matchResult.route.path;
            const stopNavigation = (await this.onBeforeNavigation(nextPath) === false);
            if (stopNavigation) {

                // restore location hash
                window.history.replaceState(null, null, this.currentRoute);
                this.goTo(this.currentRoute);
                return;
            }
        }

        // activate route
        this.currentRoute = path;
        if (matchResult) {
            matchResult.route.action(matchResult.params);
            return;
        }

        // route fallback
        if (this.fallback) {
            this.fallback();
        }
    };

    private match(pathToMatch: string): RouteMatchResult {

        for (const routePath of Object.keys(this.routes)) {

            const route = this.routes[routePath];

            // handle route parameters
            const params: IMap<string> = {};
            const routeToMatchParts = pathToMatch.split('/');
            if (routePath.search(/:/) > 0) {

                const routeParts = routePath.split('/');

                for (let i = 0; i < routeParts.length; i++) {

                    // skip non-param parts
                    const paramPart = routeParts[i];
                    if (!paramPart || paramPart[0] !== ':')
                        continue;

                    // stop if done processing
                    if (i >= routeToMatchParts.length)
                        break;

                    // store the parameter
                    const paramName = paramPart.slice(1);
                    const paramValue = routeToMatchParts[i];
                    params[paramName] = paramValue;

                    // normalize the path to match
                    routeToMatchParts[i] = paramPart;
                }
            }

            // check if match
            const normalizedPathToMatch = routeToMatchParts.join('/');
            if (routePath === normalizedPathToMatch) {
                return {
                    route,
                    params
                };
            }
        }

        return null;
    }

    private normalizePath(path: string): string {
        path = (path || '');
        path = removeStart(path, '#', '/');
        path = removeEnd(path, '/');
        return path;
    }
}