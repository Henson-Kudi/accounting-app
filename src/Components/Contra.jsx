import React, {useState, useEffect, useRef, useContext} from 'react'
import { baseURL } from './axios'
import './Contra.css'
import {UserContext} from './userContext'

function Contra({cancel, setAlert, setAlertMessage, setLoader, refetchData}) {
    const {user} = useContext(UserContext)

    const [data, setData] = useState({
        sendingAccount: 'cash',
        receivingAccount: 'bank'
    })
    const wrapper_Ref = useRef(null)

    const handleChange = (e) => {
        const {name, value} = e.target
        setData(prevValue => (
            {
                ...prevValue,
                [name] : value
            }
        ))
    }

    const handleSubmit = async()=>{
        const submitData = {
            sendingAccount: data.sendingAccount,
            receivingAccount: data.receivingAccount,
            amount: Number(data.amount)
        }

        if (data.sendingAccount === data.receivingAccount) {
            window.alert('Transfer from account must be different from transfer to account')
            return
        }

        if (!data.amount) {
            window.alert('Please add amount to transfer')
            return
        }
        try {
            setLoader(true)
            const {data} = await baseURL.post('/contra-transaction', submitData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 2000)
            cancel()
        } catch (error) {
            setAlertMessage(error.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 2000)
        }finally{
            refetchData()
            setLoader(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handle_Click_Outside);

        return ()=>{
            document.removeEventListener('mousedown', handle_Click_Outside);
        }
    }, [])

    function handle_Click_Outside(e){
        const {current : wrap} = wrapper_Ref;
        if(wrap && !wrap.contains(e.target)){
            cancel()
        }
    }


    return (
        <div className='Contra' ref={wrapper_Ref}>
            <div className="senderAndReceiverAccounts">
                <div className="sendingAccount">
                    <label htmlFor="sendingAccount">Transfer from:</label>
                    <select name='sendingAccount' value={data.sendingAccount} onChange={handleChange} id='sendingAccount'>
                        <option value="cash">Cash Account</option>
                        <option value="bank">Bank Account</option>
                        <option value="mobileMoney">Mobile Money Account</option>
                    </select>
                </div>

                <div className="receivingAccount">
                <label htmlFor="receivingAccount">Transfer To:</label>
                    <select name='receivingAccount' value={data.receivingAccount} onChange={handleChange} id='receivingAccount'>
                        <option value="bank">Bank Account</option>
                        <option value="cash">Cash Account</option>
                        <option value="mobileMoney">Mobile Money Account</option>
                    </select>
                </div>
            </div>

            <div className="amountToTransfer">
                <label htmlFor="amount">Amount to Transfer</label>
                <input type="number" name='amount' value={data.amount} onChange={handleChange} id='amount' />
            </div>

            <div className="submitOptions">
                <button className="btn" onClick={cancel}>Cancel</button>
                <button className="btn" onClick={handleSubmit}>Submit</button>
            </div>
            
        </div>
    )
}

export default Contra
