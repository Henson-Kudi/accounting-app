import React from 'react'
import {Switch, Route } from 'react-router-dom'
import Login from './Login'
import Success from './Success'
import RegisterUser from './RegisterUser'
import LandingPage from './LandingPage'
import NotFoundPage from './404Page'
import ForgotPassword from './ForgotPassword'
import ContactUs from './ContactUs'

function NonProtectedRouts() {
    return (
        <Switch>
            <Route path="/" exact>
                <LandingPage />
            </Route>

            <Route path="/login" exact>
                <Login />
            </Route>

            <Route path="/success" exact>
                <Success/>
            </Route>

            <Route path="/register" exact>
                <RegisterUser/>
            </Route>

            <Route path="/contact-us" exact>
                <ContactUs/>
            </Route>

            <Route path="/forgot-password" exact>
                <ForgotPassword/>
            </Route>

            <Route>
                <NotFoundPage/>
            </Route>
        </Switch>
    )
}

export default NonProtectedRouts
