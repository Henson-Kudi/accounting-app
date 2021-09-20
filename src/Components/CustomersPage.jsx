import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { baseURL } from './axios'
import Loader from './Loader'
import NewCustomerForm from './NewCustomerForm'
import Alert from './Alert'
import {UserContext} from './userContext'

function CustomersPage() {

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [newCustomer, setNewCustomer] = useState(false)
    const [fetching, setFetching] = useState(true)
    const history = useHistory()

    const [salesData, setSalesData] = useState([])
    const [customers, setCustomers] = useState([])
    const {user} = useContext(UserContext)

    useEffect(async () => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        getData(source, unMounted)

        return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const getData = async(source, unMounted)=>{
        const request1 = baseURL.get('/sales', {
            headers:{
                'auth-token': user?.token,
                'content-type': 'application/json',
                accept: '*/*',
            }
        })
        const request2 = baseURL.get('/customers', {
            headers:{
                'auth-token': user?.token
            }
        })
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
            .then(res => {
                const [result1, result2] = res
                const sales = result1.data.sales
                setSalesData(result1.data.sales)
                setCustomers(result2.data.customers)
                setFetching(false)
            })
            .catch(err => {
                if (!unMounted) {
                    if (axios.isCancel(err)) {
                        console.log('Request Cancelled');
                    } else {
                        console.log('Something went wrong');
                    }
                }
            })
    }
    const wrapperRef = useRef(null)
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            setNewCustomer(false);
        }
    }


    return (
        <div className='Sales'>
            <div className="Invoices">
                <div className="invoicesHeading">
                    <h1>Customers</h1>
                    <button className="invoiceButton" onClick={()=>{setNewCustomer(true)}}>New Customer</button>
                </div>
                <div className="allDebtorsContainer">
                    {
                        customers.length === 0 ? <div style={{marginTop: '1rem'}}>
                            <h3>No Data to display. Please Add Customers</h3>
                            <button className="btn" onClick={() =>{setNewCustomer(true) }}>Add Customer</button>
                        </div> :
                            <h3 style={{textAlign:'left'}}>All Customers</h3>
                    }
                    <table className='allDebtorsTable'>
                        <thead>
                            {
                                customers.length === 0 ? '' :
                                    <tr className='invoiceListHead'>
                                        <th>Customer Name</th>
                                        <th>Email Address</th>
                                        <th>City </th>
                                        <th>Telephone</th>
                                    </tr>
                            }
                        </thead>

                        <tbody className='tableBody'>
                            {
                                customers?.map(customer => (
                                    <tr className='invoiceListbody invoiceDetail' onClick={() =>{history.push(`/customers/${customer.name}`)}}>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.city}</td>
                                        <td>{customer.telephone?.replace(/\B(?=(\d{3})+(?!\d))/g, "-")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>
            </div>

            {
                fetching && <Loader />
            }

            {
                newCustomer && <div ref={wrapperRef}>
                    <NewCustomerForm
                    onClick={() => {
                        setNewCustomer(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Customer Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                    />
                </div>
            }
            <Alert
                alert={alert}
                alertMessage={alertMessage}
            />

        </div>
    )
}

export default CustomersPage
