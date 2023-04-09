import React from 'react';
import {AppContext, ParamContext, ControllerContext} from './Contexts';

/**
 * This is a React component that provides combined context to child components.
 *
 * The component accepts no parameters, but relies on the following context providers:
 *
 *   - {@link ControllerContext} provides access to controller functions.
 *   - {@link ParamContext} provides access to parameter values.
 *
 * The component wraps its children in an {@link AppContext} provider, which provides both
 * the controller functions and parameter values to child components.
 */
const ProvideCombinedContext = props => {
  return (
    <ControllerContext.Consumer>
      {controllers => (
        <ParamContext.Consumer>
          {params => (
            <AppContext.Provider value={{controllers, params}}>
              {props.children}
            </AppContext.Provider>
          )}
        </ParamContext.Consumer>
      )}
    </ControllerContext.Consumer>
  );
};

export default ProvideCombinedContext;
