import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import useHandleChange from '../customHooks/useHandleChange'
import './SinglePay.css'
import {baseURL} from './axios'
import {UserContext} from '../customHooks/userContext'

function SinglePay({totalDebt, totalPaid, data, balance, cancel, setLoader, route, setAlertMessage, input, setAlert}) {

    const history = useHistory()

    const {user} = useContext(UserContext)

    const {change : inputValue, handleChange} = useHandleChange({
        cashPayment : '',
        bankPayment : '',
        mobileMoneyPayment : '',
    })

    const submitData = {
        input,
        invoices : [{
            ...data,
            ...inputValue
        }]
    }
    

    const handleSubmit = async()=>{
        if (!Number(inputValue.cashPayment) > 0 && !Number(inputValue.bankPayment) > 0 && !Number(inputValue.mobileMoneyPayment) > 0) {
            window.alert("Please enter at least one payment.")
            return
        }
        try {
            cancel()
            setLoader(true)

            const {data} = await baseURL.post(route, submitData, {
                headers: {
                    'auth-token' : user.token
                }
            });

            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            })
            data.status === 200 && window.location.reload()
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }



    return (
        <div className="SinglePay">
            <h3 className="SinglePayHeading">Receive Payment from Customer</h3>
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

            {/* <p><b>Enter Payments Below</b></p> */}

            <div className="amountToPay">
                <div className="invoiceSinglePayControl">
                    <label htmlFor="cashPayment" className="singlePayLabel">Cash Payment</label>
                    <input type="text" name='cashPayment' id='cashPayment' value={inputValue.cashPayment} onChange={(e)=>{
                        if(isNaN(e.target.value)){
                            window.alert('Please input valid characters. Only Numbers allowed')
                            e.target.value = ''
                            return
                        }
                        handleChange(e)
                    }} placeholder='Enter cash payment' className='captureValue' />
                </div>

                <div className="invoiceSinglePayControl">
                    <label htmlFor="bankPayment" className="singlePayLabel">Bank Payment</label>
                    <input type="text" name='bankPayment' id='bankPayment' value={inputValue.bankPayment} onChange={(e)=>{
                        if(isNaN(e.target.value)){
                            window.alert('Please input valid characters. Only Numbers allowed')
                            e.target.value = ''
                            return
                        }
                        handleChange(e)
                    }} placeholder='Enter bank payment' className='captureValue' />
                </div>

                <div className="invoiceSinglePayControl">
                    <label htmlFor="mobileMoneyPayment" className="singlePayLabel">MoMo Payment</label>
                    <input type="text" name='mobileMoneyPayment' id='mobileMoneyPayment' value={inputValue.mobileMoneyPayment} onChange={(e)=>{
                        if(isNaN(e.target.value)){
                            window.alert('Please input valid characters. Only Numbers allowed')
                            e.target.value = ''
                            return
                        }
                        handleChange(e)
                    }} placeholder='Enter MoMo payment' className='captureValue' />
                </div>

            </div>
            <div className="optionButtons">
                <button className="singlePayBtn" onClick={cancel}>Cancel</button>
                <button className="singlePayBtn" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default SinglePay
