import React from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import Loader from './Loader'
import useFetch from '../customHooks/useFetch'

function CreditNotes() {
    const history = useHistory()

    const {data : invoices, loader} = useFetch('creditNotes', [])
    const {data:customerData} = useFetch('customers', {})
    
    const customers = customerData?.customers

    const handlePush = (route)=>{
        history.push(route)
    }
    

    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Sales Returns</h1>
                    <button className="invoiceButton" onClick={()=>{history.push('/credit-note/new-credit-note')}}>New Sales Return</button>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Return Number</th>
                                <th>Date</th>
                                <th>Invoice Ref</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody className='invoicesBody'>
                            {
                                invoices?.map(invoice => (
                                    <tr key={invoice._id} className='invoiceDetail'>
                                        <td onClick={()=>{handlePush(`/credit-notes/${invoice?._id}`)}}>{customers?.filter(item => item?._id === invoice?.customer?._id && item?.id === invoice?.customer?.id && item?.number === invoice?.customer?.number).map(item => item.displayName)}</td>
                                        <td onClick={()=>{handlePush(`/credit-notes/${invoice?._id}`)}}>Note #{invoice?.input?.number}</td>
                                        
                                        <td onClick={()=>{handlePush(`/credit-notes/${invoice._id}`)}}>{new Date(invoice?.input?.date).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice?.input?.invoiceRef?._id}`)}}>Invoice #{invoice.input?.invoiceRef?.number}</td>
                                        <td onClick={()=>{handlePush(`/credit-notes/${invoice._id}`)}}>{(Number(invoice?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        invoices?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                    }
                </div>
                
            </div>
            }
            {
                loader && <Loader/>
            }
        </div>
    )
}

export default CreditNotes
