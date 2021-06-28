import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { baseURL } from './axios'
import Loader from './Loader'
import NewSupplierForm from './NewSupplierForm'
import Alert from './Alert'

function SuppliersPage() {

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const [newSupplier, setNewSupplier] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [suppliers, setSuppliers] = useState([])
    const history = useHistory()

    useEffect(() => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        
        getData(source, unMounted)

        return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const getData = async(source, unMounted)=>{
        const request1 = baseURL.get('/purchases')
        const request2 = baseURL.get('/suppliers')
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
            .then(res => {
                const [result1, result2] = res
                setSuppliers(result2.data.suppliers)
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
            setNewSupplier(false);
        }
    }


    return (
        <div className='Sales'>
            <div className="Invoices">
                <div className="invoicesHeading">
                    <h1>Suppliers</h1>
                    <button className="invoiceButton" onClick={()=>{setNewSupplier(true)}}>New Supplier</button>
                </div>
                <div className="allDebtorsContainer">
                    {
                        suppliers.length === 0 ? <div style={{marginTop: '1rem'}}>
                            <h3>No Data to display. Please Add Suppliers</h3>
                            <button className="btn" onClick={() =>{setNewSupplier(true) }}>Add Supplier</button>
                        </div> :
                            <h3 style={{textAlign:'left'}}>All Suppliers</h3>
                    }
                    <table className='allDebtorsTable'>
                        <thead>
                            {
                                suppliers.length === 0 ? '' :
                                    <tr className='invoiceListHead'>
                                        <th>Supplier Name</th>
                                        <th>Email Address</th>
                                        <th>City </th>
                                        <th>Telephone</th>
                                    </tr>
                            }
                        </thead>

                        <tbody className='tableBody'>
                            {
                                suppliers?.map(supplier => (
                                    <tr className='invoiceListbody invoiceDetail' onClick={() =>{history.push(`/suppliers/${supplier.name}`)}}>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.email}</td>
                                        <td>{supplier.city}</td>
                                        <td>{supplier.telephone?.replace(/\B(?=(\d{3})+(?!\d))/g, "-")}</td>
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
                newSupplier && <div ref={wrapperRef}>
                    <NewSupplierForm
                    onClick={() => {
                        setNewSupplier(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Supplier Added Successfully')
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
                message={alertMessage}
            />

        </div>
    )
}

export default SuppliersPage
