import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import useFetch from '../customHooks/useFetch'
import Loader from './Loader'
import {UserContext} from '../customHooks/userContext'

function UnpaidInvoices() {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const today = new Date()

    const {data : {customers}, loader} = useFetch('customers', {})
    const {data : {invoices}} = useFetch('invoices', {})

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
                <div className="companyLogo" style={{
                    backgroundImage : `url(${user?.logoURL})`
                }}></div>
                <div>
                    <h1>{user?.companyName}</h1>
                    <p>Unpaid Invoices Summary Of The Year {new Date().getFullYear()}</p>
                </div>
            </div>
            

            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Customer Name</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            invoices?.filter(inv => Number(inv?.balanceDue) > 0)?.map(invoice => (
                                <tr key={invoice._id} className='invoiceDetail' onClick={()=>{handlePush(`/invoices/${invoice?._id}`)}}>
                                    <td>Invoice #{invoice?.input?.number}</td>

                                    <td>{new Date(invoice?.input?.date).toLocaleDateString()}</td>

                                    <td>{new Date(invoice?.input?.dueDate).toLocaleDateString()}</td>

                                    <td>{customers?.filter(item => item?._id === invoice?.customer?._id && item?.id === invoice?.customer?.id && item?.number === invoice?.customer?.number).map(item => item.displayName)}</td>

                                    <td>{(Number(invoice.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                    <td className={new Date(invoice?.input?.dueDate).getTime() < today.getTime() ? 'OverDue' : 'NotDue'}>{new Date(invoice?.input?.dueDate).getTime() < today.getTime() ? 'Over Due' : 'Not Due'}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    invoices?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader />
            }
        </div>
    )
}

export default UnpaidInvoices
