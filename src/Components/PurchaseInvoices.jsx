import React, { useState, useEffect, useRef, useContext } from 'react'
import {useHistory} from 'react-router'
import {saveAs} from 'file-saver'
import './Invoices.css'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import useHandleChange from '../customHooks/useHandleChange'

function PurchaseInvoices() {
    const history = useHistory()
    const [receivePay, setReceivePay] = useState(false)
    const wrapperRef = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)
    const {change: filter, handleChange} = useHandleChange({})
    const [payData, setPayData] = useState({})

    const {change: inputValue, handleChange: handleSingleChange} = useHandleChange({
        amountToPay : '',
        meansOfPayment: 'cash'
    })

    const {data: invoices, loader, setLoader} = useFetch('purchaseInvoices', [])
    const {data:suppliers} = useFetch('suppliers', [])

    const overDueInvoices = []
    const dueInDaysInvoices = []
    const today = new Date()
    const thisYear = today.getFullYear()
    const thisMonth = today.getMonth()
    const thisDay = today.getDate()

    const totalCreditPurchases = invoices?.map(item => item.grossAmount).reduce((a, b) => Number(a) + Number(b), 0)

    const totalCreditors = invoices?.map(invoice => invoice?.balanceDue)?.reduce((a, b) => Number(a) + Number(b), 0)

    const averageDays = ((totalCreditors / totalCreditPurchases) * 360).toFixed(2) || 0

    invoices?.forEach(invoice =>{
        const futureDate = new Date(invoice?.input?.dueDate)
        const futureYear = futureDate.getFullYear()
        const futureMonth = futureDate.getMonth()
        const futureDay = futureDate.getDate()
        if (futureYear === thisYear) {
            if (futureMonth < thisMonth) {
                overDueInvoices.push(invoice)
            }
            if (futureMonth === thisMonth) {
                if (futureDay < thisDay) {
                    overDueInvoices.push(invoice)
                }
            }
        }
        if (futureMonth === thisMonth) {
            dueInDaysInvoices.push(invoice)
        }
    })

    const totalOverDueDebts = overDueInvoices?.map(invoice => invoice.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const totalDueInDays = dueInDaysInvoices?.map(invoice => invoice.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const handlePush = (route)=>() => history.push(route);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            setReceivePay(false);
        }
    }

    const template = [{
        ...payData,
        date: new Date().toDateString(),
        amountToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay),
        meansOfPayment: inputValue.meansOfPayment
    }]

    const makePaymentData = {
        source: 'make payment',
        userID : user.userID,
        submitTemplates: template,
        totalToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay),
        paymentNumber : new Date().valueOf(),
    }

    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Purchase Invoices</h1>
                    <button className="invoiceButton" onClick={()=>{history.push('/purchase-invoice/new-purchase-invoice')}}>New Purchase Invoice</button>
                </div>

                <div className="overDueInvoices">
                    <div className="overDue">
                        <p className='title'>Total Overdue</p>
                        <p>{(Number(totalOverDueDebts)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>

                    <div className="dueInDays">
                        <p className='title'>Due this Month</p>
                        <p>{(Number(totalDueInDays)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>

                    <div className="collectionDays">
                        <p className='title'>Average Collection Days</p>
                        <p>{averageDays} days</p>
                    </div>

                    <div className="totalDebt">
                        <p className='title'>Total Outstanding Debtors</p>
                        <p>{(Number(totalCreditors)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>
                </div>

                {/* <div className="invoiceFilters">
                    <div className="nameFilter">
                        <input type="text" name='nameFilter' value={filter.nameFilter} onChange={handleChange} className='filterInput' placeholder='Filter by customer name' />
                    </div>

                    <div className="amountFilter">
                        <input type="text" name='amountFilter' value={filter.amountFilter} onChange={handleChange} className='filterInput' placeholder='Filter by amount' />
                    </div>
                </div> */}

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Invoice Number</th>
                                <th>Due Date</th>
                                <th>Date</th>
                                <th>Net Amount</th>
                                <th>Total Paid</th>
                                <th>Balance Due</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody className='invoicesBody'>
                            {
                                invoices?.filter(item => item?.netPayable > item?.totalPaid).sort((a, b)=> new Date(b?.input?.date) - new Date(a?.input?.date))?.map(invoice => (
                                    <tr key={invoice._id} className='invoiceDetail' onClick={handlePush(`/purchase-invoices/${invoice?._id}`)}>
                                        <td>{suppliers?.filter(item => item?._id === invoice?.supplier?._id && item?.id === invoice?.supplier?.id && item?.number === invoice?.supplier?.number).map(item => item.displayName)}</td>
                                        <td>Invoice #{invoice?.input?.number}</td>
                                        <td>{new Date(invoice?.input?.dueDate).toLocaleDateString()}</td>
                                        <td>{new Date(invoice?.input?.date).toLocaleDateString()}</td>
                                        <td>{(Number(invoice.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{(Number(invoice.totalPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{(Number(invoice.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{Number(invoice.netPayable) > Number(invoice.totalPaid) ? 'Owing' : invoice.netPayable === invoice.totalPaid ? 'Paid' : 'Over Paid'}</td>
                                        <td className='sendInvoice'>
                                            <span onClick={(e) =>{
                                                e.stopPropagation()
                                                setPayData(invoice)
                                                setReceivePay(true)
                                            }}
                                            >
                                                <i class="fas fa-file-alt fa-sm"></i>
                                                <small style={{display: 'block'}}>Pay</small>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                
                {
                    receivePay && <div ref={wrapperRef}>
                    
                    <SinglePay
                        totalDebt = {!payData.netPayable ? '' : (Number(payData?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        totalPaid = {!payData.netPayable ? '' : (Number(payData?.totalPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        balance = {!payData.netPayable ? '' : (Number(payData?.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        data={payData}

                        input = {{
                            supplier : payData.supplier
                        }}

                        route = '/purchaseInvoices/payment'

                        setLoader = {setLoader}
                        setAlertMessage = {setAlertMessage}
                        setAlert = {setAlert}

                        cancel = {()=>{setReceivePay(false)}}
                    />
                    
                </div>}
            </div>
            }
            {
                loader && <Loader/>
            }
            {
                <Alert
                    alert={alert}
                    cancelAlert={()=>{setAlert(false)}}
                    message={alertMessage}
                />
            }
        </div>
    )
}

export default PurchaseInvoices
