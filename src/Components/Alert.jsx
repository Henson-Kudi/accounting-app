import React, { useState } from 'react'
import './Alert.css'

function Alert({alert, message, cancelAlert}) {
    
    return (
        <div className={alert ? 'Alert displayAlert' : 'Alert'}>
            <p className='content'>
                <span>{message}</span>
                <span><i className="fas fa-times" onClick={cancelAlert}></i></span>
            </p>
        </div>
    )
}

export default Alert
