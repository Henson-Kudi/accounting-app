import React, { useState, useEffect, useRef, useContext } from 'react'
import { baseURL } from './axios'
import './NewExpense.css'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import { useHistory } from 'react-router-dom'

function UpdateExpense({expenseInput, setExpenseInput, cancel, refetch}) {
    const {user} = useContext(UserContext)
    const wrapperRef = useRef()
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [showCategories, setShowCategories] = useState({
        top : '0',
        visibility : 'hidden'
    })

    const [loader, setLoader] = useState(false)

    const history = useHistory()

    const expCategories = [
        "Advertisement & Marketing", "Auto Expenses", "Bad Debts", "Bank Charges", "MoMo Charges", "Internet Expenses", "Janitorial Expenses", "Wages and Salaries", "Water and Electricity", "Office Supplies", "Other Expenses", "Discounts", "Rents", "Repairs and Maintenance", "Telephone Expenses", "Travel Expenses" 
    ]

    const handleChange =(e)=>{
        const {name, value} = e.target

        setExpenseInput(prev => ({
            ...prev,
            [name] : value
        }))
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside)
        } 
    }, [showCategories])

    const handleClickOutside = (e) => {
        const {current : wrap} = wrapperRef;

        if (wrap && !wrap.contains(e.target)) {
            setShowCategories({
                top : '0',
                visibility : 'hidden'
            })
        }
    }

    async function handleSave(e) {
        e.preventDefault()

        if (!expenseInput.supName || !expenseInput.expName || !expenseInput.expCategory) {
            setAlertMessage('Please Fill all fields')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 3000);
            return
        }

        if (Number(expenseInput.cashPayment) <= 0 && Number(expenseInput.bankPayment) <= 0 && Number(expenseInput.mobileMoneyPayment) <= 0 ) {
            setAlertMessage('Please add one means of payment.')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 3000);
            return
        }

        try {
            setLoader(true)
            const {data} = await baseURL.put(`/expenses/${expenseInput._id}`, expenseInput, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && cancel()
            }, 3000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
            refetch()
        }
    }

    return (
        <div className="AddProductForm AddExpenseForm UpdateExpense">
            <div className="addProductHeading">
                <h2>Update Expense</h2>
                <div className="cancelButton" onClick={cancel}><i className="fas fa-times"></i></div>
            </div>
            <form onSubmit={handleSave}>
                <div className="addProductContainer newExpenseContainer">
                    <div className="addExpenseControl">
                        <label htmlFor="date" className="addExpenselable">Date</label>
                        <input type="date" className="addExpenseInput" value={expenseInput?.date} onChange={handleChange} name="date" id="date" placeholder="Select Date" />
                    </div>

                    <div className="addExpenseControl">
                        <label htmlFor="supName" className="addExpenselable">Vendor</label>
                        <input type="text" className="addExpenseInput" value={expenseInput?.supName} onChange={handleChange} name="supName" id="supName" placeholder="Supplier of service" />
                    </div>

                    <div className="addExpenseControl">
                        <label htmlFor="expName" className="addExpenselable">Expense Name</label>
                        <input type="text" className="addExpenseInput" value={expenseInput?.expName} onChange={handleChange} name="expName" id="expName" placeholder="Add Expense Name" />
                    </div>

                    <div className="addExpenseControl">
                        <label htmlFor="expCategory" className="addExpenselable">Expense Category</label>
                        <div className="expenseAutoComplete">
                            <input type="text" className="addExpenseInput" value={expenseInput?.expCategory} onChange={handleChange} name="expCategory" id="expCategory" placeholder="Select Expense Category" onClick={()=>{
                                setShowCategories({
                                    top : '100%',
                                    visibility : 'visible'
                                })
                            }} autoComplete="off" />

                            <div className="expenseAutoCompleteContainer" style={showCategories} ref={wrapperRef}>
                                {
                                    expCategories.filter(item => {
                                        if(!expenseInput?.expCategory) return true;
                                        if(item?.toLowerCase()?.includes(expenseInput?.expCategory?.toLowerCase())) return true;
                                    }).map(item => (
                                        <p className="expAutoItem" onClick={()=>{
                                            setExpenseInput(prev => ({
                                                ...prev,
                                                expCategory : item
                                            }))
                                            setShowCategories({
                                                top : '0',
                                                visibility : 'hidden'
                                            })
                                        }}>{item}</p>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* <h3>Payments</h3> */}

                    <div className="addExpenseControl">
                        <label htmlFor="cashPayment" className="addExpenselable">Cash</label>
                        <input type="text" className="addExpenseInput addExpensePayment" value={expenseInput?.cashPayment} onChange={(e)=>{
                            if(isNaN(e.target.value)){
                                window.alert('Invalid value. Only Numbers allowed.');
                                return
                            }
                            handleChange(e)
                        }} name="cashPayment" id="cashPayment" placeholder="Cash Payment" />
                    </div>

                    <div className="addExpenseControl">
                        <label htmlFor="bankPayment" className="addExpenselable">Bank</label>
                        <input type="text" className="addExpenseInput addExpensePayment" value={expenseInput?.bankPayment} onChange={(e)=>{
                            if(isNaN(e.target.value)){
                                window.alert('Invalid value. Only Numbers allowed.');
                                return
                            }
                            handleChange(e)
                        }} name="bankPayment" id="bankPayment" placeholder="Bank Payment" />
                    </div>

                    <div className="addExpenseControl">
                        <label htmlFor="mobileMoneyPayment" className="addExpenselable">MoMo</label>
                        <input type="text" className="addExpenseInput addExpensePayment" value={expenseInput?.mobileMoneyPayment} onChange={(e)=>{
                            if(isNaN(e.target.value)){
                                window.alert('Invalid value. Only Numbers allowed.');
                                return
                            }
                            handleChange(e)
                        }} name="mobileMoneyPayment" id="mobileMoneyPayment" placeholder="MoMo Payment" />
                    </div>




                    <div className="buttons">
                        <button className="btn-can" onClick={cancel}>Cancel</button>
                        <button className="btn-sub" type='submit'>
                            Submit
                        </button>
                    </div>
                </div>
            </form>
            {
                loader && <Loader/>
            }
            <Alert
                message={alertMessage}
                cancelAlert={()=>{setAlert(false)}}
                alert={alert}
            />
        </div>
    )
}

export default UpdateExpense
