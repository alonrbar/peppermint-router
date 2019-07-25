'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));

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

    _defineProperty(this, "currentRoute", void 0);

    _defineProperty(this, "routes", {});

    _defineProperty(this, "handleHashChanged", async () => {
      let path = location.hash; // normalize path

      path = this.normalizePath(path); // don't re-navigate to the same page

      if (path === this.currentRoute) return; // find the route to active

      const matchResult = this.match(path); // invoke beforeNavigation handler

      if (this.onBeforeNavigation) {
        const nextPath = matchResult && matchResult.route.path;
        const stopNavigation = (await this.onBeforeNavigation(nextPath)) === false;

        if (stopNavigation) {
          // restore location hash
          window.history.replaceState(null, null, this.currentRoute);
          this.goTo(this.currentRoute);
          return;
        }
      } // activate route


      this.currentRoute = path;

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
      const promptMessage = this.onBeforeUnload ? this.onBeforeUnload() : undefined;
      e.returnValue = promptMessage;
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

exports.HashRouter = HashRouter;
//# sourceMappingURL=peppermint-router.cjs.js.map
