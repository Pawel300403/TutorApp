import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
    text: string
    show: boolean
}

const SuccessDialog = ({ show, text }: Props) => {
    return (
        <>
            {show &&
                < div className='fixed inset-0 z-51 flex justify-center items-center bg-white/80'>
                    <div className='md:w-100 md:h-70 w-70 h-50 bg-white rounded-2xl place-content-center shadow-xl border-2 border-gray-200 flex flex-col justify-center items-center gap-4'>
                        <div className='size-14 rounded-full bg-emerald-200 flex justify-center items-center'>
                            <FontAwesomeIcon icon={faCheck} size='lg' className='text-emerald-600' />
                        </div>
                        <p className='font-semibold text-lg'>{text}</p>
                    </div>
                </div>
            }
        </>
    )
}

export default SuccessDialog