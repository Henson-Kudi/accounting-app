import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import './Quotation.css';
// import { saveAs } from 'file-saver'
import { baseURL } from './axios'
import Loader from './Loader'
import NewCustomerForm from './NewCustomerForm'
import Alert from './Alert';


function ReceivePayment({ onClick, refetch }) {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [active, setActive] = useState(false);
    const [newCustomer, setNewCustomer] = useState(false);
    const [fetching, setfetching] = useState(true);

    const [value, setValue] = useState('')
    const [customers, setCustomers] = useState([])
    const [invoices, setInvoices] = useState([])

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
        const request1 = baseURL.get('/customers');
        const request2 = baseURL.get('/invoices')
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

    const receivePaymentData = {
        source: 'receive payment',
        // customerDetails,
        // receivePaytInput,
        template,
        totalToPay
    }


    const handleSubmit = async () => {
        if (totalToPay === 0) {
            setAlertMessage('Please add at least one item to pay')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        } else {
            setTimeout(() => {
                setfetching(true)
            }, 500)

            baseURL.post('/receivePayment', receivePaymentData)
                // .then(() => axios.get(`/payments/${receivePaytInput.paymentNumber}`, {responseType: 'blob'}))
                // .then(res => {

                //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
                //     saveAs(pdfBlob, `paymentNumber${receivePaytInput.paymentNumber}`)
                //     axios.post(`/sendInvoice/${receivePaytInput.paymentNumber}`, {customerDetails})

                .then(() => {
                    onClick();
                    refetch()
                    setfetching(false)
                })
            // })
        }

    }

    return (
        <div className="Quotation">
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
                        <div className="date">
                            <label htmlFor="date">Date:</label>
                            <input type="text" name='date' value={receivePaytInput.date} id='date' contentEditable={false} readOnly={true} />
                        </div>

                        <div className="meansOfPayment">
                            <label htmlFor="meansOfPayment">Means of Payment</label>
                            <select name="meansOfPayment" id="meansOfPayment" value={receivePaytInput.meansOfPayment} onChange={handleChange} style={{ borderRadius: '5px', marginLeft: '0.3rem' }}>
                                <option value="Cash">Default (Cash)</option>
                                <option value="bank">Bank</option>
                                <option value="mobileMoney">Mobile Money</option>
                            </select>
                        </div>
                    </div>

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
                                active && <div className="autoCompleteContainer">
                                    <button
                                        type="button"
                                        onClick={() => { setNewCustomer(true) }}
                                        className='selectCustomer'>Add New Customer</button>
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
                        <div className="customerEmail">
                            <p><b>Email: </b>{customerDetails?.email}</p>
                        </div>
                    </div>
                    <div className="amount">
                        <h3 className='totalToPay'>Total: {totalToPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  </h3>
                    </div>

                    <div className="allDebtorsContainer">
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
                                    const value = cust.amountToPay
                                    return (
                                        <tr key={cust._id}>

                                            <td>{cust.invoiceInput.invoiceNumber}</td>

                                            <td>{(Number(cust.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                            <td>{(Number(cust.totalPaid || 0).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                            <td>{(Number(cust.balanceDue || 0).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>
                                                    <input type="number" name='amountToPay' id='amountToPay' value={cust.amountToPay} onChange={
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
                            onClick={() => {
                                handleSubmit()
                                console.log('Save Button Clicked')
                            }}
                            type="button" className='addRows btn'>
                            Save
                            </button>

                        <button
                            onClick={() => {
                                handleSubmit()
                                console.log('Save and send Button Clicked')
                            }}
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

