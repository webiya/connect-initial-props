const connectInitialProps = (mapStateToProps = null, mapDispatchToProps = null) => (target, name, descriptor) => {
  const originalGetInitialProps = descriptor.value;

  descriptor.value = async ctx => {
    const { query, store } = ctx;
    const { dispatch, getState } = store;
    const preliminaryProps = { ...query };

    const getStateProps = () => (!mapStateToProps ? {} : mapStateToProps(getState(), preliminaryProps));

    const stateToProps = Object.fromEntries(
      Object.keys(getStateProps()).map(name => [
        name,
        {
          enumerable: true,
          get() {
            return getStateProps()[name];
          }
        }
      ])
    );

    const dispatchToProps =
      (mapDispatchToProps &&
        Object.fromEntries(
          Object.entries(mapDispatchToProps).map(([name, action]) => [name, (...args) => dispatch(action(...args))])
        )) ||
      {};

    const props = {
      ...preliminaryProps,
      ...dispatchToProps
    };

    Object.defineProperties(props, stateToProps);

    return {
      ...preliminaryProps,
      ...(await originalGetInitialProps(ctx, props))
    };
  };

  return descriptor;
};

export default connectInitialProps;
