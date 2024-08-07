# peppermint-router

Lightweight hash router for React

[![package size](https://img.shields.io/bundlephobia/minzip/peppermint-router?label=minified%20gzipped)](https://bundlephobia.com/result?p=peppermint-router)
[![npm version](https://img.shields.io/npm/v/peppermint-router.svg?label=version)](https://www.npmjs.com/package/peppermint-router)
[![license](https://img.shields.io/npm/l/peppermint-router.svg)](https://www.npmjs.com/package/peppermint-router)

## The gist

```jsx
<RouterView>
    <Route path="/" component={HomePage} />
    <Route path="home" component={HomePage} />
    <Route path="about" component={AboutPage} />
    <RouteFallback component={NotFound} />
</RouterView>
```

## Prompt navigation

```jsx
<PromptNavigation
    enabled={true}
    exitPrompt="Leave the application?"
>
    {({ isNavigating, confirm, cancel }) => (
        isNavigating && (
            <div>
                <span>Move to another page?</span>
                <button onClick={confirm}>Confirm</button>
                <button onClick={cancel}>Cancel</button>
            </div>
        )
    )}
</PromptNavigation>
```

## Why?

- Extremely compact - less than 2kb gzipped!
- Does not require special `<Link>` tags and other boilerplate.
- `<PromptNavigation>` component with custom prompt out of the box.

## Why not?

- Only hash routes
- No SSR support
- No React Native support

## Changelog

The change log can be found [here](https://github.com/alonrbar/peppermint-router/blob/master/CHANGELOG.md).