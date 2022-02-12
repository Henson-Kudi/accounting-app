import React, {useContext } from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import Loader from './Loader'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'

function PurchaseOrders() {
    const history = useHistory()
    const {user} = useContext(UserContext)


    const {data: orders, loader} = useFetch('purchaseOrders', [])
    const {data:suppliers} = useFetch('suppliers', [])
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
                    <h1>Purchase Orders</h1>
                    <button className="invoiceButton" onClick={()=>{history.push('/purchase-order/new-purchase-order')}}>New Purchase Order</button>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Order Number</th>
                                <th>Date</th>
                                <th>Delivery Date</th>
                                <th>Net Amount</th>
                            </tr>
                        </thead>
                        <tbody className='invoicesBody'>
                            {
                                orders?.sort((a, b)=> new Date(b?.input?.date) - new Date(a?.input?.date)).map(order => (
                                    <tr key={order._id} className='invoiceDetail' onClick={()=>{handlePush(`/purchase-orders/${order?._id}`)}}>
                                        <td>{suppliers?.filter(item => item?._id === order?.supplier?._id && item?.id === order?.supplier?.id && item?.number === order?.supplier?.number).map(item => item.displayName)}</td>
                                        <td>Order #{order?.input?.number}</td>
                                        <td>{new Date(order?.input?.date).toLocaleDateString()}</td>
                                        <td>{new Date(order?.input?.dueDate).toLocaleDateString()}</td>
                                        <td>{(Number(order.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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

export default PurchaseOrders
