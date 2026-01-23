import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

type Props = {
    text: string
    show: boolean
    deleteFn: () => void
    closeSignal: () => void
}

const DeleteDialog = ({ show, text, deleteFn, closeSignal }: Props) => {

    const handdleDelete = () => {
        deleteFn()
        closeSignal()
    }

    return (
        <>
            {show &&
                < div className='fixed inset-0 z-50 flex justify-center items-center bg-white/80 m-0 text-black'>
                    <div className='md:w-100 md:h-70 w-70 h-50 bg-white rounded-2xl place-content-center shadow-xl border-2 border-gray-200 flex flex-col justify-center items-center gap-4'>
                        <div className='size-14 rounded-full bg-amber-200 flex justify-center items-center'>
                            <FontAwesomeIcon icon={faTriangleExclamation} size='lg' className='text-amber-400' />
                        </div>
                        <p className='font-semibold text-lg'>{text}</p>
                        <div className='grid grid-cols-2 gap-8'>
                            <button className='border-2 border-gray-900 px-4 py-1 rounded-md cursor-pointer'
                                onClick={closeSignal}
                            >
                                Cancel
                            </button>
                            <button className='bg-red-400/50 text-red-500 px-4 py-1 rounded-md cursor-pointer'
                                onClick={handdleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default DeleteDialog