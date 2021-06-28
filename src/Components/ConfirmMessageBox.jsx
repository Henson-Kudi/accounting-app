import React from 'react'
import './ConfirmMessageBox.css'

function ConfirmMessageBox({message, submit}) {
    return (
        <div className='ConfirmMessageBox'>
            <div className="messageContent">
                <p>{message}</p>
            </div>
            <div className="submitButton">
                <button className="btn" onClick={submit}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default ConfirmMessageBox
