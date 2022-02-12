import React from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import Loader from './Loader'
import useFetch from '../customHooks/useFetch'

function PurchaseReturns() {
    const history = useHistory()

    const {data : returns, loader} = useFetch('purchaseReturns', [])
    const {data:suppliers} = useFetch('suppliers', [])

    const handlePush = (route)=>{
        history.push(route)
    }


    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Purchase Returns</h1>
                    <button className="invoiceButton" onClick={()=>{history.push('/purchase-return/new-purchase-return')}}>New Purchase Return</button>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Return Number</th>
                                <th>Date</th>
                                <th>Invoice Ref</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody className='invoicesBody'>
                            {
                                returns?.map(pReturn => (
                                    <tr key={pReturn._id} className='invoiceDetail'>
                                        <td onClick={()=>{handlePush(`/purchase-returns/${pReturn?._id}`)}}>{suppliers?.filter(item => item?._id === pReturn?.supplier?._id && item?.id === pReturn?.supplier?.id && item?.number === pReturn?.supplier?.number).map(item => item.displayName)}</td>
                                        <td onClick={()=>{handlePush(`/purchase-returns/${pReturn?._id}`)}}>P.Return #{pReturn?.input?.number}</td>
                                        
                                        <td onClick={()=>{handlePush(`/purchase-returns/${pReturn._id}`)}}>{new Date(pReturn?.input?.date).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${pReturn?.input?.invoiceRef?._id}`)}}>{ pReturn.input?.invoiceRef?.number && 'Invoice #'} {pReturn.input?.invoiceRef?.number}</td>
                                        <td onClick={()=>{handlePush(`/purchase-returns/${pReturn._id}`)}}>{(Number(pReturn?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                
            </div>
            }
            {
                loader && <Loader/>
            }
        </div>
    )
}

export default PurchaseReturns
