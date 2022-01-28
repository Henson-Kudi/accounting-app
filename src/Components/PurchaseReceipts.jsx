import React from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import useFetch from '../customHooks/useFetch'

function Receipts() {
    const history = useHistory()
    const {data: receipts, refetchData} = useFetch('purchaseReceipts', [])
    const {data:suppliers} = useFetch('suppliers', [])


    const handlePush = (route)=>{
        history.push(route)
    }


    return (
        <div className='Invoices'> 
            <div className='Invoices'>
                <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Purchase Receipts</h1>
                    <button className="invoiceButton" onClick={()=>{handlePush('/purchase-receipt/new-purchase-receipt')}}>New Purchase Receipt</button>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Supplier Name</th>
                                <th>Receipt Number</th>
                                <th>Net Payable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                receipts?.sort((a, b)=> new Date(b.input.date) - new Date(a.input.date))?.map((receipt, i) => (
                                    <tr key={receipt._id} onClick={()=>{handlePush(`/purchase-receipts/${receipt._id}`)}} className='invoiceDetail'>
                                        <td>{new Date(receipt.input?.date).toLocaleDateString()}</td>

                                        <td>{
                                            suppliers?.filter(sup => sup._id === receipt?.supplier?._id && sup.id === receipt?.supplier?.id && sup.number === receipt.supplier.number).map(supplier => supplier?.displayName)
                                        }</td>

                                        <td>Receipt #{receipt.input?.number}</td>

                                        <td>{(Number(receipt?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    )
}

export default Receipts
