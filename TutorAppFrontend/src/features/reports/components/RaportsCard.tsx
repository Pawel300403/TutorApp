import { faCircleCheck, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    title: string,
    value: number,
    icon: IconDefinition,
    iconStyle: string
}

const RaportsCard = ({ title, value, icon, iconStyle }: Props) => {
    return (
        <div className='ring-4 ring-gray-100/80 p-3 rounded-xl space-y-1  h-min'>
            <div className='pb-3 flex items-center space-x-4 border-b-3 border-gray-100'>
                <FontAwesomeIcon icon={icon} className={iconStyle} />
                <a className='font-semibold'>{title}</a>
            </div>
            <p className='text-purple-500 font-semibold text-3xl text-center'>{value}</p>
        </div>
    )
}

export default RaportsCard