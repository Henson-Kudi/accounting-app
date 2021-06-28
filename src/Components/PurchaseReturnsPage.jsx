import React, { useState, useEffect, useRef } from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import PurchaseReturns from './PurchaseReturns'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import Alert from './Alert'

function PurchaseReturnsPage() {
    const history = useHistory()
    const [newReturn, setNewReturn] = useState(false)
    const [loader, setLoader] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

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

    const fetchReturns = async(source, unMounted)=>{
        try {
            setLoader(true)
            const res = await baseURL.get('/purchaseReturns', {
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
        fetchReturns(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const returns = data

    const handlePush = (route)=>{
        history.push(route)
    }


    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading">
                    <h1>Purchase Returns</h1>
                    <button className="invoiceButton" onClick={()=>{setNewReturn(true)}}>New Purchase Returns</button>
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
                                <th>Supplier Name</th>
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
                                returns?.sort((a, b)=> new Date(b.returnInput.date) - new Date(a.returnInput.date)).filter(item => {
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
                                    
                                    if(item.supplierDetails.name?.toLowerCase().includes(filter.nameFilter?.toLowerCase())){return true}
                                    if(item.netPayable?.toString().includes(filter.amountFilter)){return true}
                                }).map((returns, i) => (
                                    <tr key={returns._id} onClick={()=>{handlePush(`/purchase-returns/${returns._id}`)}} className='invoiceDetail'>
                                        <td>{returns.supplierDetails.name}</td>
                                        <td>{returns.returnsInput.returnNumber}</td>
                                        <td>{new Date(returns.returnsInput.date).toLocaleDateString()}</td>
                                        <td>{(Number(returns.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{Number(returns.discountsAndVat.rebateValue) + Number(returns.discountsAndVat.tradeDiscountValue) + Number(returns.discountsAndVat.cashDiscountValue) }</td>
                                        <td>{returns.otherAdditions?.map(item => item.amount).reduce((a, b) => a + b, 0)}</td>
                                        <td>{(Number(returns.discountsAndVat.valueAddedTax).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    newReturn && <PurchaseReturns
                    onClick={()=>{setNewReturn(false)}}
                    refetch={()=>{
                        setAlertMessage('Purchases Return Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                    />
                }
            </div>
            }
            {
                loader && <Loader/>
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default PurchaseReturnsPage
