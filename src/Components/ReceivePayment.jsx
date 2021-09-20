import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import './Quotation.css';
import { saveAs } from 'file-saver'
import { baseURL } from './axios'
import Loader from './Loader'
import NewCustomerForm from './NewCustomerForm'
import Alert from './Alert';
import {UserContext} from './userContext'


function ReceivePayment({ onClick, refetch }) {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [active, setActive] = useState(false);
    const [newCustomer, setNewCustomer] = useState(false);
    const [fetching, setfetching] = useState(true);

    const [value, setValue] = useState('')
    const [customers, setCustomers] = useState([])
    const [invoices, setInvoices] = useState([])
    const {user} = useContext(UserContext)

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()
    const year = date.getFullYear();
    const receiptDate = new Date(`${month}/${day}/${year}`).toDateString();

    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        billingAddress: {
            country: '',
            city: '',
            street: ''
        },
        contact: {
            telephone: '',
            mobile: '',
            fax: ''
        }
    });

    const wrapperRef = useRef(null)

    const [receivePaytInput, setReceivePaytInput] = useState({
        date: receiptDate,
    });

    const [template, setTemplate] = useState([])

    useEffect(async () => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get('/customers', {
            headers : {
                'auth-token' : user?.token
            }
        });
        const request2 = baseURL.get('/invoices', {
            headers : {
                'auth-token' : user?.token
            }
        })
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
            .then(res => {
                const [result1, result2] = res
                setCustomers(result1.data.customers)
                setInvoices(result2.data)
                setfetching(false)
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

        return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])


    useEffect(() => {
        customers.filter(cust => (
            cust.name === value
        )).map(value => (
            setCustomerDetails({ ...value })
        ))

    }, [value])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            setActive(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setReceivePaytInput(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }


    useEffect(() => {
        const invoiceTemplate = invoices.invoices?.filter(inv => (
            inv.customerDetails.name === value
        )).map(inv => (
            {
                ...inv,
                date: receiptDate,
                amountToPay: '',
                meansOfPayment: 'cash'
            }
        ))
        if (value !== '') {
            setTemplate(invoiceTemplate)
        }
    }, [value])

    const updateFieldChanged = (name, index) => (event) => {
        let newArr = template.map((item, i) => {
            if (index === i) {
                return { ...item, [name]: event.target.value };
            } else {
                return item;
            }
        });
        setTemplate(newArr);
    };


    const totalToPay = template.map(temp => temp.amountToPay).reduce((a, b) => Number(a) + Number(b), 0);

    const submitTemplates = template?.filter(item => (
        item.amountToPay !== ''
    ))

    const receivePaymentData = {
        userID : user.userID,
        source: 'receive payment',
        submitTemplates,
        paymentNumber : new Date().valueOf(),
        date: receiptDate,
        totalToPay
    }

    const sendReceipt = async()=>{
        await baseURL.post(`/sendPaymentReceipt/${receivePaymentData.paymentNumber}-${user.userID}`, {customerDetails}, {
            headers : {
                'auth-token' : user?.token
            }
        })
    }

    const saveAndClose = async()=>{
        onClick();
        refetch()
        setfetching(false)
    }

    const submit = async()=>{
        setTimeout(()=>{
            setfetching(true)
        }, 500)
            
        await baseURL.post('/receivePayment', receivePaymentData, {
            headers : {
                'auth-token' : user?.token
            }
        })
        .then(async(res) =>{
            const resposne = await res.data 
            await baseURL.get(`/receiptPaymentTemplates/${resposne.paymentNumber}-${user.userID}`, {
            responseType: 'blob',
            headers : {
                'auth-token' : user?.token
            }
        })
            .then(async(res) => {
                const response = await res.data
                const pdfBlob = new Blob([response], {type:'application/pdf'})
                saveAs(pdfBlob, `payment-receipt-number${receivePaymentData.paymentNumber}`)
            })
        })
    }

    const displayAlert = () => {
        setAlertMessage('Please select a customer and add at least one product')
        setAlert(true)
        setTimeout(()=>{
            setAlert(false)
        }, 3000)
    }
console.log(customerDetails.name);
    const handleSubmit = async ()=>{
        if (customerDetails.name !== '') {
            if (submitTemplates.length > 0) {
                await submit()
                .then(async(res) => {
                    await sendReceipt()
                    .then((res )=>{
                        saveAndClose()
                    })
                })
            } else {
                displayAlert()
            }
        } else {
            displayAlert()
        }
        
    }

    const handleSave = async ()=>{
        if (customerDetails.name !== '') {
            if (submitTemplates.length > 0) {
                await submit()
                .then(()=> {
                    saveAndClose()
                })
            } else {
                displayAlert()
            }
        } else {
            displayAlert()
        }
    }

    return (
        <div className="Quotation ReceivePayment" style={{width:'max-content', height: 'auto', left: '50%', transform: 'translate(-50%)', maxHeight: '100vh', overflowY: 'scroll'}}>
            <div className="close" onClick={onClick}>
                <i className="fas fa-times fa-lg"></i>
            </div>
            <h3>Receive Payment</h3>
            <div className="formContainer">
                <form action="" method="post">
                    <div className="quotationTop" style={{
                        width: '70%',
                        margin: '0 auto'
                    }}>
                        <div className="customerDetails" style={{
                        width: '70%',
                        margin: '0 auto'
                    }}>
                        <div ref={wrapperRef} className='customerName'>
                            <label htmlFor="customerName">Receiver: </label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => { setValue(e.target.value) }}
                                onClick={() => { setActive(!active) }}
                                name='customerName'
                                className='autoListItemInput'
                                id='customerName'
                                placeholder='Select Customer'
                            />

                            {
                                active && <div className="autoCompleteContainer" style={{textAlign: 'center', height: 'max-content', maxHeight: '20rem'}}>
                                    <button
                                        type="button"
                                        onClick={() => { setNewCustomer(true) }}
                                        className='selectCustomer' style={{marginBottom: '5px'}}>Add New Customer</button>
                                    {
                                        customers
                                            .filter(item => {
                                                if (!value) return true
                                                if (item.name?.toLowerCase().includes(value?.toLowerCase())) {
                                                    return true
                                                }
                                            })
                                            .map((item, i) => (
                                                <div
                                                    className='autoListItem'
                                                    onClick={() => { setValue(item.name); setActive(false); }}
                                                    key={i}
                                                    tabIndex='0'
                                                >
                                                    <p className='selectCustomer'>{item.name}</p>
                                                </div>
                                            ))
                                    }
                                </div>
                            }
                        </div>
                    </div>

                        {/* <div className="meansOfPayment">
                            <label htmlFor="meansOfPayment">Means of Payment</label>
                            <select name="meansOfPayment" id="meansOfPayment" value={receivePaytInput.meansOfPayment} onChange={handleChange} style={{ borderRadius: '5px', marginLeft: '0.3rem' }}>
                                <option value="Cash">Default (Cash)</option>
                                <option value="bank">Bank</option>
                                <option value="mobileMoney">Mobile Money</option>
                            </select>
                        </div> */}
                        <div className="date">
                            <label htmlFor="date">Date:</label>
                            <input type="text" name='date' value={receivePaytInput.date} id='date' readOnly={true} />
                        </div>

                        
                    </div>

                    
                    <div className="amount">
                        <h3 className='totalToPay'>Total: {totalToPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  </h3>
                    </div>

                    <div className="allDebtorsContainer" style={{
                        height: value === '' ? '0rem' : '30rem'
                    }}>
                        <table className="allDebtorsTable">
                            <thead>
                            {
                                value === '' ? null : <tr>
                                    <th>Invoice Number</th>
                                    <th>Net Amount</th>
                                    <th>Total Paid</th>
                                    <th>Balance Owing</th>
                                    <th>Amount To Pay</th>
                                    <th>Means Of Payment</th>
                                </tr>
                            }
                            </thead>

                            <tbody>
                                {
                                template?.filter(invoice => invoice.netPayable - invoice.totalPaid > 0).map((cust, index) => {
                                    return (
                                        <tr key={cust._id}>

                                            <td>{cust.invoiceInput.invoiceNumber}</td>

                                            <td>{(Number(cust.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                            <td>{(Number(cust.totalPaid || 0).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                            <td>{(Number(cust.balanceDue || 0).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>
                                                    <input type="number" name='amountToPay' value={cust.amountToPay} onChange={
                                                    updateFieldChanged('amountToPay', index)
                                                }/>
                                            </td>
                                            <td>
                                                <select name="meansOfPayment" value={cust.meansOfPayment} onChange={updateFieldChanged('meansOfPayment', index)} style={{ borderRadius: '5px', marginLeft: '0.3rem' }}>
                                                    <option value="Cash">Default (Cash)</option>
                                                    <option value="bank">Bank</option>
                                                    <option value="mobileMoney">Mobile Money</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                    </div>

                    <div className="totalToPay">
                        <h3 className='totalToPay'>Total: {totalToPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </h3>
                    </div>

                    <div className="saveOptions">
                        <button
                            onClick={onClick}
                            type="button" className='addRows btn'>
                            Cancel
                            </button>

                        <button
                            onClick={handleSave}
                            type="button" className='addRows btn'>
                            Save
                            </button>

                        <button
                            onClick={handleSubmit}
                            type="button" className='addRows btn'>
                            Save and Send
                            </button>
                    </div>

                </form>

            </div>
            {
                newCustomer && <NewCustomerForm onClick={() => { setNewCustomer(false) }}
                />
            }
            {
                fetching && <Loader />
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default ReceivePayment

