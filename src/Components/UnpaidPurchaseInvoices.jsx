import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch from '../customHooks/useFetch'
import Loader from './Loader'
import { UserContext } from './userContext'

function UnpaidPurchaseInvoices() {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const today = new Date()

    const {data : suppliers, loader} = useFetch('suppliers', [])
    const {data : purchaseInvoices} = useFetch('[purchaseInvoices]', [])

    const handlePush = (route)=>{
        history.push(route)
    }


    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={()=>{
                    window.print()
                }}></i>
            </div>
            <div className="reportInfos reportHeader">
                <h1>{user?.companyName}</h1>
                <p>Unpaid Purchase Invoices Summary Of The Year {new Date().getFullYear()}</p>
            </div>

            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Supplier Name</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            purchaseInvoices?.filter(inv => Number(inv?.balanceDue) > 0)?.map(invoice => (
                                <tr key={invoice._id} className='invoiceDetail' onClick={()=>{handlePush(`/purchase-invoices/${invoice?._id}`)}}>
                                    <td>Invoice #{invoice?.input?.number}</td>

                                    <td>{new Date(invoice?.input?.date).toLocaleDateString()}</td>

                                    <td>{new Date(invoice?.input?.dueDate).toLocaleDateString()}</td>

                                    <td>{suppliers?.filter(item => item?._id === invoice?.customer?._id && item?.id === invoice?.customer?.id && item?.number === invoice?.customer?.number).map(item => item.displayName)}</td>

                                    <td>{(Number(invoice.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                    <td className={new Date(invoice?.input?.dueDate).getTime() < today.getTime() ? 'OverDue' : 'NotDue'}>{new Date(invoice?.input?.dueDate).getTime() < today.getTime() ? 'Over Due' : 'Not Due'}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    purchaseInvoices?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader />
            }
        </div>
    )
}

export default UnpaidPurchaseInvoices
