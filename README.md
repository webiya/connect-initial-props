# connect-initial-props
A decorator for Next.js and React-Redux apps to connect `getInitialProps` to `state` and `dispatch`.

[![npm version](https://badge.fury.io/js/connect-initial-props.svg)](https://www.npmjs.com/package/connect-initial-props)

## Why?
When using `react-redux` on a Next.js project, the static `getInitialProps` method is executed before `react-redux`'s had been able to map `state` and `dispatch` to `props`.

The result is that accessing the dispatching actions or later accessing the state in `getInitialProps` is complicated.

Using this decorator you will be able to access mapped `state` and `dispatch actions` just as you would access them in a non-static method.

## Installation    
 ```sh 
 $ npm install connect-initial-props --save
 ```
 or
  ```sh 
 $ yarn add connect-initial-props
 ```

## Usage Example

### With `connect-initial-props`'s help:
```JavaScript
@connectInitialProps(mapStateToProps, mapDispatchToProps)
static async getInitialProps(ctx, props) {
  const { res } = ctx;
  const { page, getItems } = props;

  // async call to load items from api
  await getItems({ page });

  // props got updated with up-to-date state after async request
  const { totalPages } = props;

  if (page <= 1 || page > totalPages) {
    res.redirect(301, '/?page=1');
    return {};
  }
}
```

### Without `connect-initial-props`:

```JavaScript
static async getInitialProps(ctx) {
  const { store, query, res } = ctx;
  await store.dispatch(getItems({ page }));

  const { totalPages } = mapStateToProps(store.getState());

  if (page <= 1 || page > totalPages) {
    res.redirect(301, '/?page=1');
    return {};
  }

  return { page };
}
```

---

## Full Component Example

```JavaScript
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import connectInitialProps from 'connect-initial-props';
import { createStructuredSelector } from 'reselect';
import { selectItems, selectTotalPages } from './selectors';
import { getItems } from './slice';

const mapStateToProps = createStructuredSelector({
  items: selectItems,
  totalPages: selectTotalPages
});

const mapDispatchToProps = { getItems };

@connect(mapStateToProps, mapDispatchToProps)
class Example extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    totalPages: PropTypes.number.isRequired
  };
```
```diff
+ @connectInitialProps(mapStateToProps, mapDispatchToProps)
-  static async getInitialProps(ctx) {
+  static async getInitialProps(ctx, props) {

     // We don't need store nor query anyore
-    const { store, query, res } = ctx;
+    const { res } = ctx;

+    const { page, getItems } = props;

     // No need to dispatch manually
-    await store.dispatch(getItems({ page }));
+    await getItems({ page });

     // No need provide store's state manually
-    const { totalPages } = mapStateToProps(store.getState());
+    const { totalPages } = props;

    if (page <= 1 || page > totalPages) {
      res.redirect(301, '/?page=1');
      return {};
    }
  }
```
```JavaScript
  render() {
    const { page, totalPages, items } = this.props;

    return (
      <>
        <h1>
          Page {page} of {totalPages}
        </h1>
        {items.map(item => (
          <Item {...item} />
        ))}
      </>
    );
  }
}
```
