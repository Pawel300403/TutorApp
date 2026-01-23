import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='min-h-screen w-screen flex flex-col items-center justify-center'>
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout