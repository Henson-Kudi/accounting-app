import React, {useContext} from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import NonProtectedRoutes from './NonProtectedRouts'
import ProtectedRoutes from './ProtectedRoutes'
import {UserContext} from './userContext'

function Routing() {
    const {user} = useContext(UserContext)
    const loggedIn = user.auth
    return (
        <Router>
            {
                !loggedIn ? <NonProtectedRoutes /> : <ProtectedRoutes/>
            }
        </Router>
    )
}

export default Routing
