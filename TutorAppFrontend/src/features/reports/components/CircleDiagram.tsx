import React from 'react'

type Props = {
    title: string,
    value: number,
    max: number,
    size: number,
    thickness: number
}

const CircleDiagram = ({ title, value, max, size, thickness }: Props) => {

    const circumference = 2 * Math.PI * (100 / 2 - thickness)

    return (
        <div className='ring-4 ring-gray-100/80 p-3 rounded-xl flex flex-col items-center h-full'>
            <p className='font-semibold mb-3 w-full'>{title}</p>
            <div className="relative flex items-center justify-center w-min aspect-square">
                <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">

                    <circle
                        cx="50"
                        cy="50"
                        r={100 / 2 - thickness}
                        stroke="oklch(82.7% 0.119 306.383)"
                        strokeWidth={thickness}
                        fill="none"
                    />

                    <circle
                        cx="50"
                        cy="50"
                        r={100 / 2 - thickness}
                        stroke="currentColor"
                        strokeWidth={thickness}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - value / max)}
                        strokeLinecap="round"
                        className="text-purple-500 transition-all duration-500"
                    />
                </svg>
                <span className="absolute">
                    <p className='text-2xl text-center font-bold text-purple-500'>{value}zł</p>
                    <p className='text-sm font-semibold text-gray-400 text-center'>Target: {max}zł</p>
                </span>
            </div>
        </div>
    )
}

export default CircleDiagram