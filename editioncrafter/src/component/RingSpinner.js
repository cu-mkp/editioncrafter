import React, { useEffect, useState } from 'react'

// create an inline spinner (uses Pure CSS Loaders: https://loading.io/css/)
export function InlineRingSpinner(foregroundColor) {
    // color can be 'light' or 'dark'
    return <div className="inline-ring-spinner"><div className={foregroundColor}></div><div></div><div></div><div></div></div>
}

export function BigRingSpinner(props) {
    const { delay = 0, color = 'dark' } = props;
    const [show, setShow] = useState(delay === 0);

    useEffect(() => {
        if (delay > 0) {
            setTimeout(() => {
                setShow(true)
            }, delay);
        }
    }, []);

    return show ? <div className={`big-ring-spinner ${color}`}><div></div><div></div><div></div><div></div></div> : <div></div>
}