import React from 'react';
import {AppContext, ParamContext, ControllerContext} from './Contexts';

// This is a reusable piece that could be used by any component that requires both contexts.
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
