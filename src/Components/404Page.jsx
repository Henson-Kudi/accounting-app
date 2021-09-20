import React from 'react'
import './Success.css'

function NotFoundPage() {

    return (
        <div className="cardContainer">
            <div class="card">
                <div style={{
                    borderRadius:'200px', height:'200px', width:'200px', background: '#F8FAF5', margin:'0 auto'
                }}>
                    <i class="checkmark">x</i>
                </div>
                <h1 class="successTitle">Oooppsss</h1> 
                <p className='successDescription'>Sorry Page Not Found</p>
            </div>
        </div>
    )
}

export default NotFoundPage
