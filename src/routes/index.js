import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';
import Search from '../components/Search';
import NoMatch from '../components/NoMatch';

const PrivateRoute = ({
    component: Component,
    ...rest,
}) => (
        <Route {...rest} render={
            props => (
                JSON.parse(localStorage.getItem("userLoggedIn"))
                    ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to={{
                            pathname: '/',
                            state: { from: props.location }
                        }} />
                    )
            )} />
    )

const routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login} />
            <PrivateRoute path='/search' component={Search} />
            <Route path="*" component={NoMatch} />
        </Switch>
    </BrowserRouter>
)

export default routes;