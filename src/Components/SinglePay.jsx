import React from 'react'
import './SinglePay.css'

function SinglePay({totalDebt, totalPaid, balance, inputValue, handleChange, cancel, submit}) {
    return (
        <div className="SinglePay">
        <p><b>Receive Payment from Customer</b></p>
            <div className="overViewDetails">
                <div className='Element'>
                    <p className="ElementName">Total Debt</p>
                    <p className="ElementValue">{totalDebt}</p>
                </div>
                <div className='Element'>
                    <p className="ElementName">Total Paid</p>
                    <p className="ElementValue">{totalPaid}</p>
                </div>
                <div className='Element'>
                    <p className="ElementName">Balance</p>
                    <p className="ElementValue">{balance}</p>
                </div>
            </div>
            <div className="amountToPay">
                <input type="number" name='amountToPay' id='amountToPay' value={inputValue.amountToPay} onChange={handleChange} placeholder='Enter amount to pay' />
                <select name="meansOfPayment" id="meansOfPayment" value={inputValue.meansOfPayment} onChange={handleChange}>
                    <option value="cash">Cash (Default)</option>
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

export default SinglePay
