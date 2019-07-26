'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var React = require('react');

const RouterContext =
/*#__PURE__*/
React.createContext(undefined);

class Route extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderRoute", context => {
      this.registerRoute(context);
      if (this.props.path !== context.currentRoute.path) return null;
      return React.createElement(this.props.component, {
        route: context.currentRoute
      });
    });
  }

  render() {
    return React.createElement(RouterContext.Consumer, null, this.renderRoute);
  }

  registerRoute(context) {
    context.router.mapPath(this.props.path, params => {
      context.setCurrentRoute({
        path: this.props.path,
        params
      });
    });
  }

}

class RouteFallback extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderRoute", context => {
      this.registerRoute(context);
      if (context.currentRoute.path !== null) return null;
      return React.createElement(this.props.component, {
        route: context.currentRoute
      });
    });
  }

  render() {
    return React.createElement(RouterContext.Consumer, null, this.renderRoute);
  }

  registerRoute(context) {
    context.router.fallback = () => context.setCurrentRoute({
      path: null,
      params: null
    });
  }

}

function removeStart(str, ...toRemove) {
  return removeSide(str, /^(\s*[\r\n]*)*/, String.prototype.startsWith, (s, tr) => s.substring(tr.length), ...toRemove);
}
function removeEnd(str, ...toRemove) {
  return removeSide(str, /(\s*[\r\n]*)*$/, String.prototype.endsWith, (s, tr) => s.substring(0, s.length - tr.length), ...toRemove);
}

function removeSide(str, whitespaceReplacePattern, shouldRemove, remove, ...toRemove) {
  // input validation
  if (typeof str !== "string") {
    throw new Error(`Missing arguement '${"str"}'.`);
  }

  if (!toRemove.every(tr => typeof tr === 'string')) {
    throw new Error(`Invalid argument '${toRemove}'. Only strings expected.`);
  } // default behavior: trim white spaces


  if (!toRemove.length) {
    return str.replace(whitespaceReplacePattern, "");
  } // trim specified patterns


  let result = str.substring(0);
  let keepRunning = true;

  while (result.length && keepRunning) {
    keepRunning = false;

    for (const trimStr of toRemove) {
      if (!shouldRemove.call(result, trimStr)) continue;
      result = remove(result, trimStr);
      keepRunning = true;
    }
  }

  return result;
}

class HashRouter {
  constructor() {
    _defineProperty(this, "fallback", void 0);

    _defineProperty(this, "_onBeforeNavigation", void 0);

    _defineProperty(this, "_onBeforeUnload", void 0);

    _defineProperty(this, "_currentRoute", {});

    _defineProperty(this, "routes", {});

    _defineProperty(this, "handleHashChanged", async () => {
      let path = location.hash; // normalize path

      path = this.normalizePath(path); // don't re-navigate to the same page

      if (path === this._currentRoute.path) return; // find the route to active

      const matchResult = this.match(path);
      const nextRoute = {
        path,
        params: matchResult && matchResult.params || {}
      }; // invoke beforeNavigation handler

      if (this.onBeforeNavigation) {
        const continueNavigation = await this.onBeforeNavigation({
          prevRoute: this.currentRoute,
          nextRoute
        });

        if (continueNavigation === false) {
          // restore location hash
          window.history.replaceState(null, null, this._currentRoute.path);
          this.goTo(this._currentRoute.path);
          return;
        }
      } // activate route


      this._currentRoute = nextRoute;

      if (matchResult) {
        matchResult.route.action(matchResult.params);
        return;
      } // route fallback


      if (this.fallback) {
        this.fallback();
      }
    });
  }

  /**
   * Triggered when a navigation inside the application takes place.  
   * Return `false` to cancel navigation.
   */
  get onBeforeNavigation() {
    return this._onBeforeNavigation;
  }

  set onBeforeNavigation(value) {
    // prevent accidental overwrites
    if (value && this._onBeforeNavigation) {
      throw new Error(`${"onBeforeNavigation"} handler already exists. Remove the old one before assigning a new handler.`);
    }

    this._onBeforeNavigation = value;
  }
  /**
   * Triggered when a navigation to another site takes place.
   * Return a message to show to the user.  
   */


  get onBeforeUnload() {
    return this._onBeforeUnload;
  }

  set onBeforeUnload(value) {
    // prevent accidental overwrites
    if (value && this._onBeforeUnload) {
      throw new Error(`${"onBeforeUnload"} handler already exists. Remove the old one before assigning a new handler.`);
    }

    this._onBeforeUnload = value;
  }

  get currentRoute() {
    return this._currentRoute;
  } //
  // private members
  //


  //
  // public methods
  //
  mapPath(path, action) {
    path = this.normalizePath(path);
    this.routes[path] = {
      path,
      action
    };
  }

  goTo(path) {
    path = this.normalizePath(path);
    location.hash = '#/' + path;
  }

  goBack() {
    window.history.back();
  }

  listen() {
    // register unload handler
    window.addEventListener('beforeunload', e => {
      const promptMessage = this.onBeforeUnload ? this.onBeforeUnload({
        currentRoute: this.currentRoute
      }) : undefined;

      if (promptMessage) {
        e.returnValue = promptMessage;
      }

      return promptMessage;
    }); // listen to hash changes

    window.addEventListener('hashchange', this.handleHashChanged); // handle initial route

    if (location.hash === '') {
      location.hash = '#/';
    } else {
      this.handleHashChanged();
    }
  } //
  // private methods
  //


  match(pathToMatch) {
    for (const routePath of Object.keys(this.routes)) {
      const route = this.routes[routePath]; // handle route parameters

      const params = {};
      const routeToMatchParts = pathToMatch.split('/');

      if (routePath.search(/:/) > 0) {
        const routeParts = routePath.split('/');

        for (let i = 0; i < routeParts.length; i++) {
          // skip non-param parts
          const paramPart = routeParts[i];
          if (!paramPart || paramPart[0] !== ':') continue; // stop if done processing

          if (i >= routeToMatchParts.length) break; // store the parameter

          const paramName = paramPart.slice(1);
          const paramValue = routeToMatchParts[i];
          params[paramName] = paramValue; // normalize the path to match

          routeToMatchParts[i] = paramPart;
        }
      } // check if match


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

  normalizePath(path) {
    path = path || '';
    path = removeStart(path, '#', '/');
    path = removeEnd(path, '/');
    return path;
  }

}

class RouterViewState {
  constructor() {
    _defineProperty(this, "currentRoute", {
      path: undefined,
      params: undefined
    });
  }

}

class RouterView extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "router", new HashRouter());

    _defineProperty(this, "setCurrentRoute", currentRoute => {
      this.setState({
        currentRoute
      });
    });

    this.state = new RouterViewState();
  }

  componentDidMount() {
    this.router.listen();
  }

  render() {
    if (this.props.routerRef) {
      this.props.routerRef(this.router);
    }

    return React.createElement(RouterContext.Provider, {
      value: {
        router: this.router,
        currentRoute: this.state.currentRoute,
        setCurrentRoute: this.setCurrentRoute
      }
    }, this.props.children);
  }

}

exports.HashRouter = HashRouter;
exports.Route = Route;
exports.RouteFallback = RouteFallback;
exports.RouterContext = RouterContext;
exports.RouterView = RouterView;
//# sourceMappingURL=peppermint-router.cjs.js.map
