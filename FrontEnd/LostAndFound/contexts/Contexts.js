import React from 'react';

export const AppContext = React.createContext({
  controllerContext: null,
  paramContext: null,
});
export const ControllerContext = React.createContext({
  loginController: null,
  postsController: null,
  nav: null,
});
export const ParamContext = React.createContext({
  initialParams: null,
});
