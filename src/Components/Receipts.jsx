import React, { useState, useEffect, useRef } from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import Receipt from './Receipt'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import Alert from './Alert'

function Receipts() {
    const history = useHistory()
    const [newReceipt, setNewReceipt] = useState(false)
    const [loader, setLoader] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [data, setData] = useState([])
    const [filter, setFilter] = useState({})
    const handleChange = (e)=>{
        const {name, value} = e.target

        setFilter(prev =>(
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const fetchInvoices = async(source, unMounted)=>{
        try {
            setLoader(true)
            const res = await baseURL.get('/receipts', {
                cancelToken: source.token
            })
            setData(res.data)
            setLoader(false)
        } catch (error) {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        }
    }

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchInvoices(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const receipts = data

    const handlePush = (route)=>{
        history.push(route)
    }

    const refetchData = async()=>{
        await baseURL.get('/receipts')
    }


    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading">
                    <h1>Receipts</h1>
                    <button className="invoiceButton" onClick={()=>{setNewReceipt(true)}}>New Receipt</button>
                </div>

                <div className="invoiceFilters">
                    <div className="nameFilter">
                        <input type="text" name='nameFilter' value={filter.nameFilter} onChange={handleChange} className='filterInput' placeholder='Filter by customer name' />
                    </div>

                    <div className="amountFilter">
                        <input type="text" name='amountFilter' value={filter.amountFilter} onChange={handleChange} className='filterInput' placeholder='Filter by amount' />
                    </div>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Receipt Number</th>
                                <th>Date</th>
                                <th>Net Amount</th>
                                <th>Total Discounts</th>
                                <th>Total Other Additions</th>
                                <th>VAT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                receipts?.sort((a, b)=> new Date(b.receiptInput.date) - new Date(a.receiptInput.date)).filter(item => {
                                    if(!filter.nameFilter){
                                        if(!filter.amountFilter){
                                            return true
                                        }
                                    }
                                    if(!filter.amountFilter){
                                        if(!filter.nameFilter){
                                            return true
                                        }
                                    }
                                    
                                    if(item.customerDetails.name?.toLowerCase().includes(filter.nameFilter?.toLowerCase())){return true}
                                    if(item.netPayable?.toString().includes(filter.amountFilter)){return true}
                                }).map((receipt, i) => (
                                    <tr key={receipt._id} onClick={()=>{handlePush(`/receipts/${receipt._id}`)}} className='invoiceDetail'>
                                        <td>{receipt.customerDetails.name}</td>
                                        <td>{receipt.receiptInput.receiptNumber}</td>
                                        <td>{new Date(receipt.receiptInput.date).toLocaleDateString()}</td>
                                        <td>{(Number(receipt.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{Number(receipt.discountsAndVat.rebateValue) + Number(receipt.discountsAndVat.tradeDiscountValue) + Number(receipt.discountsAndVat.cashDiscountValue) }</td>
                                        <td>{receipt.otherAdditions?.map(item => item.amount).reduce((a, b) => a + b, 0)}</td>
                                        <td>{(Number(receipt.discountsAndVat.valueAddedTax).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    newReceipt && <Receipt
                    onClick={()=>{setNewReceipt(false)}}
                    refetch={refetchData}
                    />
                }
            </div>
            }
            {
                alert && 
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
            }
            {
                loader && <Loader/>
            }
            
        </div>
    )
}

export default Receipts
