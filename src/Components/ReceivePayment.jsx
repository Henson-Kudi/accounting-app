import React, { useEffect, useState, useRef, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import './Invoice.css';
import { baseURL } from './axios'
import Loader from './Loader'
import Alert from './Alert';
import {UserContext} from './userContext'
import useFetch from '../customHooks/useFetch';



function ReceivePayment({ onClick, refetch }) {
    const history = useHistory()
    const wrapperRef = useRef()
    const [alert, setAlert] = useState(false)
    const [active, setActive] = useState(false);
    const [alertMessage, setAlertMessage] = useState('')
    const [custName, setCustName] = useState('')

    const [quoteInput, setQuoteInput] = useState({
        date: new Date(),
        customer: {},
    });

    const [customerInvoices, setCustomerInvoices] = useState([])
    

    const {data: {customers}, loader, setLoader } = useFetch('customers', [])
    const {data : {invoices} }  = useFetch('invoices', [])
    const {user} = useContext(UserContext)


    const handleChange = (e) => {
        const { name, value } = e.target

        setQuoteInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(()=>{
        filterInvoices()
    }, [custName])

    const filterInvoices = ()=>{
        const filteredInvoices = invoices?.filter(invoice => (invoice?.customer._id === quoteInput?.customer?._id && invoice?.customer?.id === quoteInput?.customer?.id && invoice?.customer.number === quoteInput?.customer?.number && Number(invoice?.balanceDue) > 0))
        setCustomerInvoices(filteredInvoices ?? []);
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            setActive(false);
        }
    }

    const updateFieldChanged = (name, index) => (e) => {
        let newArr = customerInvoices?.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: e.target.value };
        } else {
            return item;
        }
        });
        setCustomerInvoices(newArr);
    };

    const calcNet = (index)=> Number(customerInvoices[index]?.cashPayment || 0) + Number(customerInvoices[index]?.bankPayment || 0) + Number(customerInvoices[index]?.mobileMoneyPayment || 0)

    const invoicesToSubmit = customerInvoices?.filter(invoice => Number(invoice?.cashPayment) > 0 || Number(invoice?.mobileMoneyPayment) > 0 || Number(invoice?.bankPayment) > 0)

    const paymentData = {
        input : {...quoteInput},
        invoices : invoicesToSubmit
    }

    const handleSave = async ()=>{
        if (invoicesToSubmit.length === 0) {
            setAlertMessage("Cannot send an empty list. Add at least one invoice.")
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 3000)
            return
        }

        try {
            setLoader(true)
            const {data} = await baseURL.post('/invoices/payment', paymentData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && history.goBack()
            }, 3000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    return (
        <div className="Quotations NewInvoice">
            <div className="addProductHeading">
                <h2>Receive Customer Payment</h2>
                <div className="cancelButton" onClick={history.goBack}><i className="fas fa-times"></i></div>
            </div>
            <div className="formContainer">
                <form className="invoiceForm">
                    <div className="invoiceFormTop">
                        <div className="date invoiceControl">
                            <label htmlFor="date">Date:</label>
                            <input type="date" name='date' value={quoteInput.date} id='date' className='invoiceSelectInput' onChange={handleChange} />
                        </div>
                    </div>

                    <div ref={wrapperRef} className='customerName'>
                        <label htmlFor="customerName">Select Customer: </label>
                        <input 
                            type="text"
                            value={custName} 
                            onChange={(e)=>{setCustName(e.target.value)}}
                            onClick={()=>{setActive(!active)}}
                            name='customerName'
                            className='autoListItemInput'
                            id='customerName'
                            placeholder='Select Customer'
                        />

                        {
                            active && 
                            <div className="autoCompleteContainer">
                                <button
                                    type="button"
                                    onClick={()=>{history.push('/customer/new-customer')}}
                                    className='addNewCust'
                                >
                                    Add New Customer
                                </button>
                                {
                                    customers?.filter(item => {
                                        if (!custName) return true
                                        if (item?.displayName?.toLowerCase().includes(custName?.toLowerCase())) {
                                        return true
                                        }
                                    })?.map((item, i) => (
                                        <div
                                            className='autoListItem'
                                            onClick={()=>{
                                                setCustName(item.displayName);
                                                setQuoteInput(prev => ({
                                                    ...prev,
                                                    customer : item
                                                }))
                                                setActive(false);
                                            }}
                                            key={item.id}
                                            tabIndex='0'
                                        >
                                            <p>{item.displayName}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                    <div className="invoiceAddProducts">
                    {
                        invoicesToSubmit.length > 0 && <div className="invoicesToSubmit">
                            <p>The following invoices will be submited:</p>
                            <div className="invoicesToSubmitList">
                                {
                                    invoicesToSubmit?.map(inv => (
                                        <span className="invoiceToSubmit">Inv #{inv?.input?.number}</span>
                                    ))
                                }
                            </div>
                        </div>
                    }
                        <table className='addProductsInvoiceTable' >
                            <thead className='addProductsInvoiceTableHead'>
                                <tr className='addProductRow addProductRowHead'>
                                    <th className='addProductData'>Invoice #</th>
                                    <th className='invoiceAmountElem addProductData'>Net Amount</th>
                                    {/* <th className='invoiceAmountElem addProductData'>Total Paid</th> */}
                                    <th
                                    className='invoiceAmountElem addProductData'>Balance Owing</th>
                                    <th className='addProductData'>Cash Payment</th>
                                    <th className='invoiceAmountElem addProductData'>Bank Payment</th>
                                    <th className='invoiceAmountElem addProductData'>MoMo Payment</th>
                                    <th className='invoiceAmountElem addProductData'>Total to pay</th>
                                </tr>
                            </thead>
                            <tbody className="addProductsInvoiceTableBody">
                                {
                                    customerInvoices?.map((invoice, i) => (
                                        <tr className="notActiveToAddPro addProductRow" style={{textAlign: 'center'}}>
                                            <td className="addProductData">Inv # {invoice?.input?.number}</td>
                                            <td className="addProductData">
                                                <div className="addProductDataControl">
                                                    <span className="addProductLabel">Amount:  </span>
                                                    <span className="noSmallScreen">{Number(invoice?.netPayable)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                </div>
                                            </td>
                                            <td className="addProductData">
                                                <div className="addProductDataControl">
                                                    <span className="addProductLabel">Debt: </span>
                                                    <span>{Number(invoice?.balanceDue)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                </div>
                                            </td>
                                            <td className="addProductData">
                                                <div className="addProductDataControl">
                                                    <label htmlFor="cashPayment" className="addProductLabel">Cash Payment</label>
                                                    <input type="text"
                                                        name="cashPayment" 
                                                        id="cashPayment"
                                                        placeholder="Enter Cash Payment"
                                                        value={customerInvoices[i]?.cashPayment}
                                                        onChange={(e)=>{
                                                            if(isNaN(e.target.value)){
                                                                window.alert("Please enter a valid number")
                                                                e.target.value = ''
                                                                return
                                                            }
                                                            updateFieldChanged('cashPayment', i)(e)
                                                        }}
                                                        className='invoiceAmountElem'
                                                    />
                                                </div>
                                            </td>
                                            <td className="addProductData">
                                                <div className="addProductDataControl">
                                                    <label htmlFor="bankPayment" className="addProductLabel">Bank Payment</label>
                                                    <input type="text"
                                                        name="bankPayment" 
                                                        id="bankPayment"
                                                        placeholder="Enter Bank Payment"
                                                        value={customerInvoices[i]?.bankPayment}
                                                        onChange={(e)=>{
                                                            if(isNaN(e.target.value)){
                                                                window.alert("Please enter a valid number")
                                                                e.target.value = ''
                                                                return
                                                            }
                                                            updateFieldChanged('bankPayment', i)(e)
                                                        }}
                                                        className='invoiceAmountElem'
                                                    />
                                                </div>
                                            </td>
                                            <td className="addProductData">
                                                <div className="addProductDataControl">
                                                    <label htmlFor="mobileMoneyPayment" className="addProductLabel">Momo Payment</label>
                                                    <input type="text"
                                                        name="mobileMoneyPayment" 
                                                        id="mobileMoneyPayment"
                                                        placeholder="Enter Momo Payment"
                                                        value={customerInvoices[i]?.mobileMoneyPayment}
                                                        onChange={(e)=>{
                                                            if(isNaN(e.target.value)){
                                                                window.alert("Please enter a valid number")
                                                                e.target.value = ''
                                                                return
                                                            }
                                                            updateFieldChanged('mobileMoneyPayment', i)(e)
                                                        }}
                                                        className='invoiceAmountElem'
                                                    />
                                                </div>
                                            </td>
                                            <td className="addProductData">
                                                <span className="noSmallScreen">
                                                    {calcNet(i)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            customerInvoices?.length === 0 && <div className="noInvoices" style={{textAlign: 'center'}}>No unpaid invoices with this customer</div> 
                        }
                    </div>
                    <div className="saveOptions">
                            <div><button
                                onClick={history.goBack}
                                type="button" className='saveOption btn'>
                                Cancel
                            </button></div>

                            <div>
                                <button
                                    onClick={handleSave}
                                    type="button" className='saveOption btn'>
                                    Save
                                </button>

                                {/* <button
                                    onClick={handleSaveAndSend}
                                    type="button" className='saveOption btn'>
                                    Save and Send
                                </button> */}

                                {/* <button
                                    onClick={handleSaveAndPrint}
                                    type="button" className='saveOption btn'>
                                    Save and Print
                                </button> */}
                            </div>
                    </div>
                </form>
            </div>
            {
                loader && <Loader />
            }
            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
        </div>
    )
}

export default ReceivePayment

