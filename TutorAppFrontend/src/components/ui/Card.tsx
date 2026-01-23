import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faUser } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router'

interface CardProps {
    id?: number,
    name?: string
}

const Card = ({ name, id }: CardProps) => {

    const navigate = useNavigate()

    return (
        <div className='border-2 min-h-12 border-gray-300 rounded-md flex items-center p-4 hover:scale-101 duration-300 active:bg-gray-200 cursor-pointer' onClick={() => navigate(`client/${id}`)}>
            <FontAwesomeIcon icon={faUser} size='xl' />
            <p className='mx-4 font-bold text-gray-400'>{name}</p>
        </div>
    )
}

export default Card