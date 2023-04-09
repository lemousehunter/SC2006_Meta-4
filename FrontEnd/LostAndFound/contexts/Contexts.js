import React from 'react';

/**
 * A React context that provides access to the controller and parameter contexts.
 */
export const AppContext = React.createContext({
  controllerContext: null,
  paramContext: null,
});

/**
 * A React context that provides access to the login and posts controllers and the navigation component.
 */
export const ControllerContext = React.createContext({
  loginController: null,
  postsController: null,
  nav: null,
});

/**
 * A React context that provides access to the initial parameters.
 */
export const ParamContext = React.createContext({
  initialParams: null,
});
