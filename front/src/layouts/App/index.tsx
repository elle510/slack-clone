import loadable from '@loadable/component';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Workspace = loadable(async () => await import('@layouts/Workspace'));
const LogIn = loadable(async () => await import('@pages/LogIn'));
const SignUp = loadable(async () => await import('@pages/SignUp'));

const App: React.FC = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route path="/login" component={LogIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/workspace/:workspace" component={Workspace} />
  </Switch>
);

export default App;
