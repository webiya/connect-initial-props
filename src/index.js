import mapDispatchToPropsFactories from 'react-redux/lib/connect/mapDispatchToProps';
import mapStateToPropsFactories from 'react-redux/lib/connect/mapStateToProps';

// @see https://github.com/reduxjs/react-redux/blob/0c048f0646/src/connect/connect.js#L25-L38
const match = (arg, factories, name) =>
  factories.map(factory => factory(arg)).find(x => x) ||
  (() => {
    throw new Error(`Invalid value of type ${typeof arg} for ${name} argument.`);
  });

const connectInitialProps = (mapStateToProps = null, mapDispatchToProps = null) => (target, name, descriptor) => {
  const originalGetInitialProps = descriptor.value;

  descriptor.value = async args => {
    // Support both pages and _app.js
    const { ctx = args } = args;

    const { query, store } = ctx;
    const { dispatch, getState } = store;
    const preliminaryProps = { ...query };

    // prettier-ignore
    const initMapStateToProps = match(
      mapStateToProps,
      mapStateToPropsFactories,
      'mapStateToProps'
    )(dispatch, {});

    const initMapDispatchToProps = match(
      mapDispatchToProps,
      mapDispatchToPropsFactories,
      'mapDispatchToProps'
    )(dispatch);

    const getStateProps = () => initMapStateToProps(getState(), preliminaryProps);

    const stateProps = Object.fromEntries(
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

    const props = {
      ...preliminaryProps,
      ...initMapDispatchToProps()
    };

    Object.defineProperties(props, stateProps);

    return {
      ...preliminaryProps,
      ...(await originalGetInitialProps(args, props))
    };
  };

  return descriptor;
};

export default connectInitialProps;
