import React, {useRef, useEffect} from 'react'
import './UpdateExpense.css'

function UpdateExpense({date, expName, receiver, category, meansOfPayment, amount, handleChange,onClick, handleUpdate}) {

    const wrapperRef = useRef()

    const handleClickOutSide = (e)=>{
        const {current: wrap} = wrapperRef
        if (wrap && !wrap.contains(e.target)) {
            onClick()
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutSide)
        return () => {
            document.removeEventListener('mousedown', handleClickOutSide)
        }
    }, [])

    return (
        <div className='UpdateExpense'>
        
            <div className="updateExpenseInput" ref={wrapperRef}>
            <h3>Update Expense</h3>
                <div className="dateUpdate">
                    <label htmlFor="date">Date</label>
                    <input type="date" name="date" id="date" value={date} onChange={handleChange} className='date' />
                </div>

                <div className="expNameUpdate">
                    <label htmlFor="expName">Expense Name</label>
                    <input type="text" name="expName" id="expName" value={expName} onChange={handleChange} className='expName'/>
                </div>

                <div className="receiverUpdate">
                    <label htmlFor="receiver">Receiver</label>
                    <input type="text" name="receiver" id="receiver" value={receiver} onChange={handleChange} className='receiver' />
                </div>

                <div className="categoryUpdate">
                    <label htmlFor="category">Category</label>
                    <select className='category' name="category" id="category" value={category} onChange={handleChange} >
                        <option value="administration">Administration</option>
                        <option value="distribution">Distribution</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="meansUpdate">
                    <label htmlFor="meansOfPayment">Means of Payment</label>
                    <select className='meansOfPayment' name="meansOfPayment" id="meansOfPayment" value={meansOfPayment} onChange={handleChange}>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                        <option value="mobileMoney">Mobile Money</option>
                    </select>
                </div>

                <div className="amountUpdate">
                    <label htmlFor="amount">Amount</label>
                    <input type="text" name="amount" id="amount" value={amount} onChange={handleChange} />
                </div>
                <div className="updateButtons">
                <button className='btn' onClick={onClick}>
                    Cancel
                </button>
                <button className='btn' onClick={handleUpdate}>
                    Update
                </button>
            </div>
            </div>
        </div>
    )
}

export default UpdateExpense
