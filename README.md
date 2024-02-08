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

[Try it in Codesandbox](https://codesandbox.io/p/sandbox/react-new?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clsd4l6nj00063b6htmux78zg%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clsd4l6ni00023b6hnloghrul%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clsd4l6ni00033b6h3g3hrmht%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clsd4l6ni00053b6hygtau3qn%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clsd4l6ni00023b6hnloghrul%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clsd4l6ni00013b6hcpo54fs5%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fsrc%252Findex.js%2522%257D%255D%252C%2522id%2522%253A%2522clsd4l6ni00023b6hnloghrul%2522%252C%2522activeTabId%2522%253A%2522clsd4l6ni00013b6hcpo54fs5%2522%257D%252C%2522clsd4l6ni00053b6hygtau3qn%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clsd4l6ni00043b6hwr5absnw%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522id%2522%253A%2522clsd4l6ni00053b6hygtau3qn%2522%252C%2522activeTabId%2522%253A%2522clsd4l6ni00043b6hwr5absnw%2522%257D%252C%2522clsd4l6ni00033b6h3g3hrmht%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clsd4l6ni00033b6h3g3hrmht%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

## Installation

To install `react-susflow`, run:

```bash
npm i react-susflow
yarn add react-susflow
pnpm i react-susflow
```

## Quick Start

To use `react-susflow` in your React project, first import the `sus` function:

```javascript
import { sus } from 'react-susflow';
```

Next, wrap your asynchronous function with `sus` to create a resource:

```javascript
// Note: only the promised functions are wrapable
const fetchData = async (param1, param2) => {
  const response = await fetch(`https://api.example.com/data?param1=${param1}&param2=${param2}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const resource = sus(fetchData);
```

Finally, use this resource in your component with React Suspense:

```javascript
import React, {Suspense} from 'react';

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataDisplay/>
    </Suspense>
  );
}

function DataDisplay() {
  const data = resource.read('param1.value', 'param2.value');
  return <div>{JSON.stringify(data)}</div>;
}
```

## API Reference

### `sus(asyncFunction)`

- **Parameters**
  - `asyncFunction`: An asynchronous function that returns a Promise.
- **Returns**
  - An object containing a `read` method for initiating the asynchronous operation and returning its result.

### `read()`

- **Description**
  - This method triggers the asynchronous function wrapped by `sus`, and returns its result. During data loading, `read`
    throws a Promise, which is caught by React Suspense and displays the fallback content.

## Frequently Asked Questions (FAQ)

This section can provide answers to some common questions, such as how to handle errors, how to reload data, etc.

## Contribution

Contributions to `react-susflow` are welcome! Please check out our GitHub repository for more information.

## License

`react-susflow` is released under the MIT license.