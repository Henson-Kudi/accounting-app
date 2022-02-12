import React, { useEffect, useState, useRef, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import './Invoice.css';
import { baseURL } from './axios'
import Loader from './Loader'
import Alert from './Alert';
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch';



function MakePayment({ onClick, refetch }) {
    const history = useHistory()
    const wrapperRef = useRef()
    const [alert, setAlert] = useState(false)
    const [active, setActive] = useState(false);
    const [alertMessage, setAlertMessage] = useState('')
    const [supName, setSupName] = useState('')

    const [quoteInput, setQuoteInput] = useState({
        date: new Date(),
        supplier: {},
    });

    const [suppllierInvoices, setSupplierInvoices] = useState([])
    

    const {data: suppliers, loader, setLoader } = useFetch('suppliers', [])
    const {data : invoices }  = useFetch('purchaseInvoices', [])
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
    }, [supName])

    const filterInvoices = ()=>{
        const filteredInvoices = invoices?.filter(invoice => (invoice?.supplier._id === quoteInput?.supplier?._id && invoice?.supplier?.id === quoteInput?.supplier?.id && invoice?.supplier.number === quoteInput?.supplier?.number && Number(invoice?.balanceDue) > 0))
        setSupplierInvoices(filteredInvoices ?? []);
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
        let newArr = suppllierInvoices?.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: e.target.value };
        } else {
            return item;
        }
        });
        setSupplierInvoices(newArr);
    };

    const calcNet = (index)=> Number(suppllierInvoices[index]?.cashPayment || 0) + Number(suppllierInvoices[index]?.bankPayment || 0) + Number(suppllierInvoices[index]?.mobileMoneyPayment || 0)

    const invoicesToSubmit = suppllierInvoices?.filter(invoice => Number(invoice?.cashPayment) > 0 || Number(invoice?.mobileMoneyPayment) > 0 || Number(invoice?.bankPayment) > 0)




    const paymentData = {
        input : {...quoteInput},
        invoices : invoicesToSubmit
    }

    const sendReceipt = async()=>{
        
    }

    const saveAndClose = async()=>{
        
    }

    const submit = async()=>{
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
            const {data} = await baseURL.post('/purchaseInvoices/payment', paymentData, {
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

    const displayAlert = () => {
        setAlertMessage('Please select a supplier and add at least one product')
        setAlert(true)
        setTimeout(()=>{
            setAlert(false)
        }, 3000)
    }

    const handleSubmit = async ()=>{
        
        
    }

    const handleSave = async ()=>{
        await submit()
    }

    return (
        <div className="Quotations NewInvoice">
            <div className="addProductHeading">
                <h2>Make Payment to Supplier</h2>
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
                        <label htmlFor="customerName">Select Supplier: </label>
                        <input 
                            type="text"
                            value={supName} 
                            onChange={(e)=>{setSupName(e.target.value)}}
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
                                    onClick={()=>{history.push('/supplier/new-supplier')}}
                                    className='addNewCust'
                                >
                                    Add New Supplier
                                </button>
                                {
                                    suppliers?.filter(item => {
                                        if (!supName) return true
                                        if (item?.displayName?.toLowerCase()?.includes(supName?.toLowerCase())) {
                                        return true
                                        }
                                    })?.map((item, i) => (
                                        <div
                                            className='autoListItem'
                                            onClick={()=>{
                                                setSupName(item.displayName);
                                                setQuoteInput(prev => ({
                                                    ...prev,
                                                    supplier : item
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
                                    suppllierInvoices?.map((invoice, i) => (
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
                                                        value={suppllierInvoices[i]?.cashPayment}
                                                        onChange={updateFieldChanged('cashPayment', i)}
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
                                                        value={suppllierInvoices[i]?.bankPayment}
                                                        onChange={updateFieldChanged('bankPayment', i)}
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
                                                        value={suppllierInvoices[i]?.mobileMoneyPayment}
                                                        onChange={updateFieldChanged('mobileMoneyPayment', i)}
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
                            suppllierInvoices?.length === 0 && <div className="noInvoices" style={{textAlign: 'center'}}>No unpaid invoices with this supplier</div> 
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

export default MakePayment

