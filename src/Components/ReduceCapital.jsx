import React from 'react'
import './SinglePay.css'

function ReduceCapital({inputValue, handleChange, cancel, submit}) {
    return (
        <div className="SinglePay">
        <p><b>Reduce Shareholder Capital</b></p>
            <div className="amountToPay">
                <input type="number" name='amountToPay' id='amountToPay' value={inputValue.amountToPay} onChange={handleChange} placeholder='Enter amount to pay' />
                <select name="meansOfPayment" id="meansOfPayment" value={inputValue.meansOfPayment} onChange={handleChange}>
                    <option value="">Select Means of Payment</option>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="mobileMoney">Mobile Money</option>
                </select>
            </div>
            <div className="optionButtons">
                <button className="btn" onClick={cancel}>Cancel</button>
                <button className="btn" onClick={submit}>Submit</button>
            </div>
        </div>
    )
}

export default ReduceCapital
