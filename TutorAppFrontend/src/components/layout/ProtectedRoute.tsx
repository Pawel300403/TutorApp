import React, { useEffect } from 'react'
import { useAuth } from '../../providers/AuthProvider'
import { Outlet, useNavigate } from 'react-router'

function ProtectedRoute() {

    const { authenticated, initializing } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!authenticated && !initializing)
            navigate('/')
    }, [authenticated])

    return (
        <Outlet />
    )
}

export default ProtectedRoute