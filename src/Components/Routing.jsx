import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import useAuth from '../customHooks/useAuth'
import NonProtectedRoutes from './NonProtectedRouts'
import ProtectedRoutes from './ProtectedRoutes'

function Routing() {
    const {user} = useAuth()
    const loggedIn = user?.auth
    return (
        <Router>
            {
                !loggedIn ? <NonProtectedRoutes /> : <ProtectedRoutes/>
            }
        </Router>
    )
}

export default Routing
