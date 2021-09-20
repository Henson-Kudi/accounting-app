import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {baseURL} from './axios'
import './Returns.css'
import CreditNote from './CreditNote'
import PurchaseReturns from './PurchaseReturns'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from './userContext'

function Returns() {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [fetching, setfetching] = useState(true)
    const [newCreditNot, setNewCreditNote] = useState(false)
    const [newPurchaseReturns, setNewPurchaseReturns] = useState(false)
    const [transactionOptions, setTransactionOptions] = useState(false)
    const [returns, setReturns] = useState(false)
    const {user} = useContext(UserContext)
    

    const [salesReturns, setSalesReturns] = useState([])
    const [purchaseReturns, setPurchaseReturns] = useState([])

    const getReturns = async(source, unMounted)=>{
        await baseURL.get('/returns', {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })
        .then(res =>{
            setfetching(false)
            setSalesReturns(res.data.salesReturns)
            setPurchaseReturns(res.data.purchaseReturns)
        })
        .catch(err =>{
            if (!unMounted) {
                if (axios.isCancel(err)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        })
    }

    useEffect(async() => {
        let source = axios.CancelToken.source();
        let unMounted = false;
        getReturns()
        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const wrapperRef = useRef(null)

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            setTransactionOptions(false);
        }
    }

    const totalSalesReturns = salesReturns.map(a => a.netPayable).reduce((a,b) => a + b, 0)
    const totalPurchaseReturns = purchaseReturns.map(a => a.netPayable).reduce((a,b) => a + b, 0)
    const creditNoteAdditions = salesReturns.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0))
    const purchaseReturnsAdditions = purchaseReturns.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0))


    return (
        <div className='Returns'>
            <div className="expenseTop salesTop homeAndPrint">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                </div>

                <div className="salesOptionsMiddle">
                    <h1>Returns Page</h1>
                </div>

                <div className="salesOptionsRight">
                    <div className='salesTransactions' ref={wrapperRef}>
                        <button onClick={() => { setTransactionOptions(!transactionOptions) }} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                        {
                            transactionOptions &&
                            <ul className='transactionOptions'>
                                <li className='transactionOption' onClick={() => { setNewCreditNote(true) }}>New Credit Note</li>
                                <li className='transactionOption' onClick={() => { setNewPurchaseReturns(true) }}>New Purchase Returns</li>
                            </ul>
                        }
                    </div>
                    <button className="button" onClick={()=>{window.print()}}>
                        Print Page
                    </button>
                </div>
            </div>

            <div className="liquidityOptions">
                <p className={returns ? 'selected' : 'option'} onClick={()=>{setReturns(true)}}>Purchase Returns</p>
                <p className={ !returns ? 'selected' : 'option'} onClick={()=>{setReturns(false)}}>Sales Returns</p>
            </div>

            <div className="totalReturns">
                {
                    returns ? <p> Total Purchase Returns: <b>{totalPurchaseReturns}</b></p> : <p> Total Sales Returns: <b>{totalSalesReturns}</b></p>
                }
                
            </div>
            
            <div className='returnTransContainer'>
                {
                            !returns &&
                            salesReturns.length > 0 ?
                            <table className="invoices buttonOptions">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th className='recentItem'>Date</th>

                                    <th className='recentItem'>Return Number</th>
                                    <th className='recentItem'>Gross Amount</th>
                                    <th className='recentItem'>Total Discounts</th>
                                    <th className='recentItem'>VAT</th>
                                    <th className='recentItem'>Other Additions</th>
                                    <th className='recentItem'>Net Payable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                salesReturns.map((note, index) => (
                                    <tr className='noteListbody'>
                                        <td className='recentItem'>{note.noteInput.date}</td>
                                        <td className='recentItem'>{note.noteInput.noteNumber}</td>
                                        <td className='recentItem'>{(note.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{(Number(note.discountsAndVat.rebateValue) + Number(note.discountsAndVat.tradeDiscountValue) + Number(note.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{(note.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{(creditNoteAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{((note.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table> : !returns && <h2 className='noData'>No Credit Notes (Sales Returns) To Display. Please Record Transactions</h2>
                        }

                        {
                            returns &&
                            purchaseReturns.length > 0 ?
                            <table className="invoices buttonOptions">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>

                                    <th className='recentItem'>Return Number</th>
                                    <th className='recentItem'>Gross Amount</th>
                                    <th className='recentItem'>Total Discounts</th>
                                    <th className='recentItem'>VAT</th>
                                    <th className='recentItem'>Other Additions</th>
                                    <th className='recentItem'>Net Payable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                purchaseReturns.map((returns, index) => (
                                    <tr className='returnsListbody'>
                                        <td className='recentItem'>{returns.returnsInput.date}</td>
                                        <td className='recentItem'>{returns.returnsInput.returnsNumber}</td>
                                        <td className='recentItem'>{(returns.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{(Number(returns.discountsAndVat.rebateValue) + Number(returns.discountsAndVat.tradeDiscountValue) + Number(returns.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{(returns.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{(purchaseReturnsAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='recentItem'>{((returns.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table> : returns && <h2 className='noData'>No Purchase Returns To Display. Please Record Transactions</h2>
                        }
           </div>

           {
               newCreditNot &&
               <CreditNote
                   onClick={()=>{setNewCreditNote(false)}}
                   refetch={() =>{
                        const source = axios.cancelToken.source()
                        const unMounted = false
                        setAlert(true);
                        setAlertMessage('Sales Returns Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                        }, 2000)
                        getReturns(source, unMounted)
                    }}
               />
           }
           {
               newPurchaseReturns &&
               <PurchaseReturns
                   onClick={()=>{setNewPurchaseReturns(false)}}
                   
               />
           }
           {
               fetching && <Loader/>
           }
        </div>
    )
}

export default Returns
