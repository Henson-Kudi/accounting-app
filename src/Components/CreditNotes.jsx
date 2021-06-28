import React, { useState, useEffect, useRef } from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import CreditNote from './CreditNote'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import Alert from './Alert'

function CreditNotes() {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const history = useHistory()
    const [newCreditNote, setNewCreditNote] = useState(false)
    const [loader, setLoader] = useState(false)

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

    const fetchCreditNotes = async(source, unMounted)=>{
        try {
            setLoader(true)
            const res = await baseURL.get('/creditNotes', {
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
        fetchCreditNotes(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const creditNotes = data

    const handlePush = (route)=>{
        history.push(route)
    }


    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading">
                    <h1>Sales Returns</h1>
                    <button className="invoiceButton" onClick={()=>{setNewCreditNote(true)}}>New Sales Returns</button>
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
                                <th>Return Number</th>
                                <th>Date</th>
                                <th>Net Amount</th>
                                <th>Total Discounts</th>
                                <th>Total Other Additions</th>
                                <th>VAT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                creditNotes?.sort((a, b)=> new Date(b.noteInput.date) - new Date(a.noteInput.date)).filter(item => {
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
                                }).map((creditNote, i) => (
                                    <tr key={creditNote._id} onClick={()=>{handlePush(`/credit-notes/${creditNote._id}`)}} className='invoiceDetail'>
                                        <td>{creditNote.customerDetails.name}</td>
                                        <td>{creditNote.noteInput.noteNumber}</td>
                                        <td>{new Date(creditNote.noteInput.date).toLocaleDateString()}</td>
                                        <td>{(Number(creditNote.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{Number(creditNote.discountsAndVat.rebateValue) + Number(creditNote.discountsAndVat.tradeDiscountValue) + Number(creditNote.discountsAndVat.cashDiscountValue) }</td>
                                        <td>{creditNote.otherAdditions?.map(item => item.amount).reduce((a, b) => a + b, 0)}</td>
                                        <td>{(Number(creditNote.discountsAndVat.valueAddedTax).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    newCreditNote && <CreditNote
                    onClick={()=>{setNewCreditNote(false)}}
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Sales Returns Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                        }, 2000)
                    }}
                    />
                }
            </div>
            }
            {
                loader && <Loader/>
            }
            {
                alert &&
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
            }
        </div>
    )
}

export default CreditNotes
