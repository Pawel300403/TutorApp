import { useState, type FormEvent } from 'react'
import Input from '../../../components/ui/Input'
import { useAuth } from '../../../providers/AuthProvider'
import { useNavigate } from 'react-router'

function LoginForm() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const loginSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await login({ username: username, password: password })
        navigate('/home')
    }

    return (
        <form className='flex flex-col gap-8 w-full px-4' onSubmit={loginSubmit}>
            <h1 className='text-xl font-medium'>Sign in to your account</h1>
            <Input label='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input label='Password' type='password' required value={password} onChange={e => setPassword(e.target.value)} />
            <input type='submit' value='Login' className='border-black border-2 rounded-md h-10 font-bold hover:bg-black hover:text-white transition ease-linear duration-300 cursor-pointer active:bg-black active:text-white' />
        </form>
    )
}

export default LoginForm