import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import './Quotation.css';
// import { saveAs } from 'file-saver'
import { baseURL } from './axios'
import Loader from './Loader'
import NewSupplierForm from './NewSupplierForm'
import Alert from './Alert';


function ReceivePayment({ onClick, refetch }) {
    const [active, setActive] = useState(false);
    const [newSupplier, setNewSupplier] = useState(false);
    const [fetching, setfetching] = useState(true);
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [value, setValue] = useState('')
    const [suppliers, setSuppliers] = useState([])
    const [purchaseInvoices, setPurchaseInvoices] = useState([])
    const [creditors, setCreditors] = useState([])

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()
    const year = date.getFullYear();
    const receiptDate = new Date(`${month}/${day}/${year}`).toDateString();

    const [supplierDetails, setSupplierDetails] = useState({
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

    const [makePaymentInput, setMakePaymentInput] = useState({
        date: receiptDate,
        meansOfPayment: 'cash'
    });

    const [template, setTemplate] = useState([])

    useEffect(async () => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get('/suppliers')
        const request2 = baseURL.get('/purchaseInvoices')
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
            .then(res => {
                const [response1, response2] = res;
                setSuppliers(response1.data.suppliers)
                setPurchaseInvoices(response2.data)
                setCreditors(response1.data.creditors)
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
        suppliers.filter(sup => (
            sup.name === value
        )).map(value => (
            setSupplierDetails({ ...value })
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

        setMakePaymentInput(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }


    useEffect(() => {
        const invoiceTemplate = creditors?.filter(inv => (
            inv.supplierName === value
        )).map(inv => (
            {
                ...inv,
                amountToPay: ''
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

    const makePaymentData = {
        source: 'make payment',
        supplierDetails,
        makePaymentInput,
        template,
        totalToPay
    }


    const handleSubmit = async () => {
        if (totalToPay === 0) {
            setAlertMessage('Please add an amount to pay')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        } else {
            setTimeout(() => {
                setfetching(true)
            }, 500)

            baseURL.post('/receivePayment', makePaymentData)
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
        <div className="Quotation" style={{width:'max-content', height: 'auto', left: '50%', transform: 'translate(-50%)', maxHeight: '100vh', overflowY: 'scroll'}}>
            <div className="close" onClick={onClick}>
                <i className="fas fa-times fa-lg"></i>
            </div>
            <h3>Make Payment To Supplier</h3>
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
                            <label htmlFor="customerName">To: </label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => { setValue(e.target.value) }}
                                onClick={() => { setActive(!active) }}
                                name='supplierName'
                                className='autoListItemInput'
                                id='supplierName'
                                placeholder='Select Supplier'
                            />

                            {
                                active && <div className="autoCompleteContainer" style={{textAlign: 'center', height: 'max-content', maxHeight: '20rem'}}>
                                    <button
                                        type="button"
                                        onClick={() => { setNewSupplier(true) }}
                                    >Add New Supplier</button>
                                    {
                                        suppliers
                                            .filter(item => {
                                                if (!value) return true
                                                if (item.name.toLowerCase().includes(value.toLowerCase())) {
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
                                                    <p>{item.name}</p>
                                                </div>
                                            ))
                                    }
                                </div>
                            }
                        </div>
                        {/* <div className="customerEmail">
                            <p><b>Email: </b>{supplierDetails?.email}</p>
                        </div> */}
                    </div>

                        <div className="date">
                            <label htmlFor="date">Date:</label>
                            <input type="text" name='date' value={makePaymentInput.date} id='date' contentEditable={false} readOnly={true} />
                        </div>

                        {/* <div className="meansOfPayment">
                            <label htmlFor="meansOfPayment">Means of Payment</label>
                            <select name="meansOfPayment" id="meansOfPayment" value={makePaymentInput.meansOfPayment} onChange={handleChange} style={{ borderRadius: '5px', marginLeft: '0.3rem' }}>
                                <option value="Cash">Default (Cash)</option>
                                <option value="bank">Bank</option>
                                <option value="mobileMoney">Mobile Money</option>
                            </select>
                        </div> */}
                    </div>

                    
                    <div className="amount" style={{
                        width: '70%',
                        textAlign: 'right',
                        margin: '0 auto',
                        backgroundColor: 'rgba(211, 211, 211, 0.5)'
                    }}>
                        <h3 className='totalToPay'>Total: {totalToPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  </h3>
                    </div>

                    <div>

                        {
                            value === '' ? null : <div className="allDebtorsContainer" style={{height: value === '' ? '0rem' : '30rem'}}>
                                <table className='allDebtorsTable'>
                                    <thead>
                                        <tr className='invoiceListHead'>
                                            <th>Total Debt</th>
                                            <th>Total Paid</th>
                                            <th>Balance Owed To</th>
                                            <th>Amount To Pay</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            template.map((sup, index) => {
                                                return (
                                                    <tr className='invoiceListbody' key={index}>
                                                        <td>{(Number(sup.totalDebt)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                        <td>{(Number(sup.totalPaid)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                        <td>{(Number(sup.balanceDue)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                        <td>
                                                            <input type="number" name='amountToPay' id='amountToPay' value={makePaymentInput.invoiceNumber} onChange={
                                                            updateFieldChanged('amountToPay', index)
                                                            }  />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>

                                </table>
                            </div>
                        }

                    </div>

                    <div className="totalToPay" style={{
                        width: '70%',
                        textAlign: 'right',
                        margin: '0 auto',
                        backgroundColor: 'rgba(211, 211, 211, 0.5)'
                    }}>
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
                            }}
                            type="button" className='addRows btn'>
                            Save
                            </button>
                    </div>

                </form>

            </div>
            {
                newSupplier && <NewSupplierForm onClick={() => { setNewSupplier(false) }}
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

