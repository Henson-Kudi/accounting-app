import React, {useState} from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import Receipt from './Receipt'
import useFetch from '../customHooks/useFetch'

function Receipts() {
    const history = useHistory()
    const [newReceipt, setNewReceipt] = useState(false)
    const {data: receipts, refetchData} = useFetch('receipts', [])
    const {data:customerData} = useFetch('customers', {})
    const customers = customerData?.customers

    const handlePush = (route)=>{
        history.push(route)
    }


    return (
        <div className='Invoices'> 
            <div className='Invoices'>
                <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Receipts</h1>
                    <button className="invoiceButton" onClick={()=>{setNewReceipt(true)}}>New Receipt</button>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer Name</th>
                                <th>Receipt Number</th>
                                <th>Net Payable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                receipts?.sort((a, b)=> new Date(b.input.date) - new Date(a.input.date))?.map((receipt, i) => (
                                    <tr key={receipt._id} onClick={()=>{handlePush(`/receipts/${receipt._id}`)}} className='invoiceDetail'>
                                        <td>{new Date(receipt.input?.date).toLocaleDateString()}</td>

                                        <td>{
                                            customers?.filter(cust => cust._id === receipt?.customer?._id && cust.id === receipt?.customer?.id && cust.number === receipt.customer.number).map(customer => customer?.displayName)
                                        }</td>

                                        <td>Receipt #{receipt.input?.number}</td>

                                        <td>{(Number(receipt?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
            
        </div>
    )
}

export default Receipts
