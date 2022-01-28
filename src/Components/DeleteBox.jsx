import React, {useRef, useEffect, Children} from 'react'
import './DeleteBox.css'

function DeleteBox({onClick, handleDelete, children}) {

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

    const handleKeyPressDelete = (e)=>{
        e.preventDefault();
        if (e.key === 'Enter') {
            alert('Deleting')
        }
    }

    return (
        <div className='DeleteBox'>
            <div className="deleteContainer" ref={wrapperRef}>
                <p className='deleteText'>Click <b>OK</b> to confirm <span>delete</span></p>
                <div className='additionalText'>
                    {children}
                </div>
                <div className="deleteOptions">
                    <button className="btn msgBoxDelete msgBoxCancel" onClick={onClick}>Cancel</button>
                    <button
                        className="btn msgBoxDelete msgBoxConfirm"
                        onClick={()=>{
                            handleDelete()
                            onClick()
                        }}
                    >OK</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteBox
