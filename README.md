# connect-initial-props
A decorator for Next.js and React-Redux apps to connect `getInitialProps` to `state` and `dispatch`.

## Why?
When using `react-redux` on a Next.js project, the static `getInitialProps` method is executed before `react-redux`'s had been able to map `state` and `dispatch` to `props`.

The result is that accessing the dispatching actions or later accessing the state in `getInitialProps` is complicated.

Using this decorator you will be able to access mapped `state` and `dispatch actions` just as you would access them in a non-static method.

## Example

### Without `connect-initial-props`:

```
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

### With `connect-initial-props`'s help:
```
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
