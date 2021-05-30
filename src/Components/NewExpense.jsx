import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { baseURL } from './axios'
import {expStructure} from './data'
import './NewExpense.css'
import Loader from './Loader'



function NewExpense({onClick}) {

    const [expenseInput, setExpenseInput] = useState({})
    const [data, setData] = useState(expStructure)
    const [height, setHeight] = useState(17);
    const realVal = height > 36 ? "100%" : `${height}rem`;
    const [fetching, setfetching] = useState(false)
    const wrapperRef = useRef()

    const handleChange = (e) => {
        const {name, value} = e.target
        setExpenseInput((prevValue)=>{
            return {
                ...prevValue,
                [name] : value
            }
        })
    }


    const updateFieldChanged = (name, index) => (event) => {
        let newArr = data.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: event.target.value };
        } else {
            return item;
        }
        });
        setData(newArr);
    };

    const elements = data.filter(ele => ele.expName !== '' && ele.receiver !== '' && ele.category !== '' && ele.meansOfPayment !== '' && ele.amount !== '')

    const expData = {
        elements,
        date: expenseInput.date
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            onClick()
        }
    }

    const handleSubmit = ()=>{
        setfetching(true)
        baseURL.post('/expenses', expData)
        .then(res => {
            onClick()
            console.log(res);
            setfetching(false)
        })
        .catch(err => console.log(err))
    }


    return (
        <div className="NewExpense" ref={wrapperRef}>
            <div className="close">
                <i className="fas fa-times fa-lg" onClick={onClick}></i>
            </div>
            <div className="mainContainer">
                <div className="expTop">
                    <div className="date">
                        <label htmlFor="date">Date: </label>
                    <input type="date" name="date" id="date" value={expenseInput.date} onChange={handleChange}/>
                    </div>

                    <div className="receiveer">
                    </div>
                </div>

                <div style={{
                            height: `${realVal}`,
                            overflow: "hidden"
                            }}
                            className='expenseTable'
                >
                    <table>
                    <thead>
                        <tr className='invoiceListHead'>
                            <th>Expense Name</th>
                            <th>Receiver</th>
                            <th>Category</th>
                            <th>Means of Payment</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((d,i) =>(
                                <tr className='invoiceLisBody' key={i}>
                                    <td>
                                        <input type="text" name='expName' value={d.expName} onChange={updateFieldChanged("expName", i)} />
                                    </td>
                                    <td>
                                        <input type="text" name="receiver" onChange={updateFieldChanged('receiver', i)}/>
                                    </td>
                                    <td>
                                        <select name="category" value={d.category} onChange={updateFieldChanged("category", i)}>
                                            <option value=""></option>
                                            <option value="administration">Administration</option>
                                            <option value="distribution">Selling and Distribution</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </td>

                                    <td>
                                        <select name="meansOfPayment" value={d.meansOfPayment} onChange={updateFieldChanged("meansOfPayment", i)}>
                                            <option value=""></option>
                                            <option value="cash">Cash</option>
                                            <option value="bank">Bank</option>
                                            <option value="mobile money">Mobile Money</option>
                                        </select>
                                    </td>

                                    <td>
                                        <input type="text" name="amount" value={d.amount} onChange={updateFieldChanged("amount", i)}/>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                </div>
                        
                <div className="expButtons">
                    <button
                            onClick={() => {
                            setHeight((prev) => {
                                return prev + 8;
                            });
                            if(realVal ==='100%'){
                                alert('Cannot add more rows.')
                            }
                            }}
                            type="button" className='addRows btn'>
                            Add Rows
                        </button>
                        <div className="saveOptions">
                            <button
                                onClick={onClick}
                                type="button" className='addRows btn'>
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                type="button" className='addRows btn'>
                                Save
                            </button>

                            <button
                                onClick={handleSubmit}
                                type="button" className='addRows btn'>
                                Save and Send
                            </button>
                        </div>
                </div>
            </div>
            {
                fetching && <Loader/>
            }
        </div>
    )
}

export default NewExpense
