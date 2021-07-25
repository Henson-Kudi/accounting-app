import React, {useRef, useEffect} from 'react'
import './DeleteBox.css'

function MessageBox({onClick, submit, message}) {

    const wrapperRef = useRef()

    useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside)

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    const handleClickOutside = (e)=>{
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            onClick()
        }
    }

    return (
        <div className='MessageBox DeleteBox'>
            <div className="deleteContainer" ref={wrapperRef}>
                <p className='deleteText'>Click <b>OK</b> to {message}</p>
                <div className="deleteOptions">
                    <button className="btn" onClick={onClick}>Cancel</button>
                    <button className="btn" onClick={()=>{
                        submit()
                        onClick()
                    }}>OK</button>
                </div>
            </div>
        </div>
    )
}

export default MessageBox
