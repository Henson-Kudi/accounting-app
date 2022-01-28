import React from 'react'
import { useHistory } from 'react-router-dom'
import Loader from './Loader'
import useFetch from '../customHooks/useFetch'

function CustomersPage() {

    const history = useHistory()
    const {data : {customers}, loader:fetching} = useFetch('customers',[])

    return (
        <div className="Invoices">
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Customers</h1>
                <button className="invoiceButton" onClick={()=>{history.push('customer/new-customer')}}>New Customer</button>
            </div>
            <div className="allDebtorsContainer">
                
                <table className='allDebtorsTable'>
                    <thead>
                        <tr className='customersHeading'>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Company Name</th>
                            <th>Address</th>
                            <th>Email Address</th>
                            <th>Telephone</th>
                            <th>Opening Balance</th>
                            <th>Total Debt</th>
                        </tr>
                    </thead>

                    <tbody className='tableBody'>
                        {
                            customers?.map(customer => (
                                <tr className='invoiceListbody invoiceDetail customerDetailRow' onClick={() =>{history.push(`/customers/${customer._id}`)}}>
                                    <td>{customer?.number}</td>
                                    <td>{customer?.displayName}</td>
                                    <td>{customer?.companyName}</td>
                                    <td>{customer?.billingAddress?.address}</td>
                                    <td onClick={(e)=>{
                                        window.open(`mailto:${customer?.email}`)
                                        e.stopPropagation()
                                    }} className='clientEmail'>{customer?.email}</td>
                                    <td>{customer?.billingAddress?.tel}</td>
                                    <td>{Number(customer?.openingBalance)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(customer?.totalDebt)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    
                                </tr>
                            ))
                        }
                    </tbody>

                </table>
            </div>
            {
                fetching && <Loader />
            }
        </div>
    )
}

export default CustomersPage
