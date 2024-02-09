# react-susflow

[![npm package][npm-img]][npm-url] [![Build Status][build-img]][build-url] [![Downloads][downloads-img]][downloads-url] [![Issues][issues-img]][issues-url]

[build-img]: https://github.com/ohkuku/react-susflow/actions/workflows/release.yml/badge.svg

[build-url]: https://github.com/ohkuku/react-susflow/actions/workflows/release.yml

[downloads-img]: https://img.shields.io/npm/dt/react-susflow

[downloads-url]: https://www.npmtrends.com/ohkuku/react-susflow

[npm-img]: https://img.shields.io/npm/v/ohkuku/react-susflow

[npm-url]: https://www.npmjs.com/package/react-susflow

[issues-img]: https://img.shields.io/github/issues/ohkuku/react-susflow

[issues-url]: https://github.com/ohkuku/react-susflow/issues

## Introduction

`react-susflow` is a library designed to simplify asynchronous data fetching and integration with React Suspense. By
utilizing the `sus` function, developers can effortlessly make their asynchronous operations work seamlessly with React
Suspense, enhancing the loading experience and error handling.

[Try it in Codesandbox](https://codesandbox.io/p/sandbox/5kj4x3?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clsd4l6nj00063b6htmux78zg%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clsd4l6ni00023b6hnloghrul%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clsd4l6ni00033b6h3g3hrmht%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clsd4l6ni00053b6hygtau3qn%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clsd4l6ni00023b6hnloghrul%2522%253A%257B%2522id%2522%253A%2522clsd4l6ni00023b6hnloghrul%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clsd4l6ni00053b6hygtau3qn%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clsd4l6ni00043b6hwr5absnw%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522id%2522%253A%2522clsd4l6ni00053b6hygtau3qn%2522%252C%2522activeTabId%2522%253A%2522clsd4l6ni00043b6hwr5absnw%2522%257D%252C%2522clsd4l6ni00033b6h3g3hrmht%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clsd4l6ni00033b6h3g3hrmht%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

## Installation

To install `react-susflow`, run:

```bash
npm i react-susflow
yarn add react-susflow
pnpm i react-susflow
```

## Quick Start

The `react-susflow` library introduces caching capabilities to optimize asynchronous data fetching. Below is a quick
guide on utilizing these new features within a React application:

```javascript
import {Suspense} from "react";
import {sus} from 'react-susflow';

// Define an asynchronous function for data fetching
const fetchData = async (param) => {
  const response = await fetch(`https://api.example.com/data?param=${param}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Wrap the async function with `sus`, specifying cache options
const resource = sus(fetchData, {
  cache: {
    enable: true, // Enable caching
    ttl: 300000 // Cache TTL set to 5 minutes, default to 1 minute
  }
});

const SusComponent = () => {
  const value = resource.read("world!");
  return <>{JSON.stringify(value)}</>;
};

const SusComponent2 = () => {
  const value = resource.read("china!", {useCache: false}); // useCache is set default to true
  return <>{JSON.stringify(value)}</>;
};

// App component with two Suspense wrappers for each resource usage
export default function App() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <SusComponent/>
      </Suspense>
      <Suspense fallback={<>Loading...</>}>
        <SusComponent2/>
      </Suspense>
    </>
  );
}
```

This example demonstrates the use of `react-susflow` with caching enabled, showing how to selectively bypass the cache
for certain reads using the `useCache: false` option.

## API Reference

### `sus(asyncFunction, options?)`

Creates a resource from an asynchronous function, optionally configuring caching.

- **Parameters:**
  - `asyncFunction`: An async function that returns a Promise.
  - `options` (optional): Configuration for caching.
    - `cache`:
      - `enable` (optional): Boolean to enable or disable caching.
      - `ttl` (optional): Time-to-live for cache entries in milliseconds.

- **Returns:** An object with a `read` method for fetching data, either from the cache or by executing the asynchronous
  function.

### `read(...params, readOptions?)`

Triggers the asynchronous operation, optionally utilizing the cache based on `readOptions`.

- **Parameters:**
  - `...params`: Arguments to pass to the asynchronous function.
  - `readOptions` (optional): Options for reading data.
    - `useCache` (optional): Boolean to specify whether to use the cache. Setting this to `false` forces a fresh fetch, bypassing
      the cache.

By providing a flexible caching mechanism and the ability to control cache usage on a per-read basis, `react-susflow`
enhances data fetching strategies in React applications, offering improved performance and user experience.

## Frequently Asked Questions (FAQ)

This section can provide answers to some common questions, such as how to handle errors, how to reload data, etc.

## Contribution

Contributions to `react-susflow` are welcome! Please check out our GitHub repository for more information.

## License

`react-susflow` is released under the MIT license.
