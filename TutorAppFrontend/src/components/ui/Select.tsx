import React, { useState } from 'react'

const Select = () => {


    const [open, setOpen] = useState(false);
    const [render, setRender] = useState(false);

    function toggle() {
        if (open) {
            // zamykanie
            setOpen(false);
            setTimeout(() => setRender(false), 180); // musi = czas collapse
        } else {
            // otwieranie
            setRender(true);
            requestAnimationFrame(() => setOpen(true));
        }
    }

    return (
        <div className=''>
            <div className='min-h-4 border-amber-200 border-2 p-1 rounded-md' onClick={toggle}>
                <p>Zaplanowano</p>
            </div>
            {render &&
                <div className={`border-amber-200 border-2 p-1 rounded-md  ${open ? "animate-expand mt-2" : "animate-collapse mt-2"}`}>
                    <p>Zaplanowano</p>
                    <p>Zaplanowano</p>
                    <p>Zaplanowano</p>
                    <p>Zaplanowano</p>
                    <p>Zaplanowano</p>
                    <p>Zaplanowano</p>
                </div>
            }
        </div>
    )
}

export default Select