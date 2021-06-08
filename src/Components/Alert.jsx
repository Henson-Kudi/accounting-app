import React, { useState } from 'react'
import './Alert.css'

function Alert({alert, message}) {
    
    return (
        <div className={alert ? 'Alert displayAlert' : 'Alert'}>
            <p className='content'>{message}</p>
        </div>
    )
}

export default Alert
