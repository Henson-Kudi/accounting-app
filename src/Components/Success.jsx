import React from 'react'
import './Success.css'

function Success() {

    return (
        <div className="cardContainer">
            <div class="card">
                <div style={{
                    borderRadius:'200px', height:'200px', width:'200px', background: '#F8FAF5', margin:'0 auto'
                }}>
                    <i class="checkmark">✓</i>
                </div>
                <h1 className='successTitle'>Success</h1> 
                <p className='successDescription'>Check your email to confirm your password</p>
            </div>
        </div>
    )
}

export default Success
