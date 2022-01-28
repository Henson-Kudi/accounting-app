import React, {useEffect, useState, useRef, useContext} from 'react'
import { useHistory, Link } from 'react-router-dom';
import uuid from 'react-uuid'
import print from 'print-js'

import Loader from './Loader'
import './Invoice.css';
import {baseURL} from './axios'
import Alert from './Alert';
import {UserContext} from './userContext'
import useFetch from '../customHooks/useFetch'


function CreditNote() {
    const wrapperRef = useRef(null)
    const autoRef = useRef()
    const history = useHistory()
    const {user} = useContext(UserContext)
    const {data:customerData} = useFetch('customers', {})
    const {data:invoicesData} = useFetch('invoices', {})
    const {data:products} = useFetch('products', [])
    const {data:creditNotes, loader, setLoader} = useFetch('creditNotes', [])
    const customers = customerData?.customers
    const invoiceList = invoicesData?.invoices

    const [active, setActive] = useState(false);
    const [selectInvoice, setSelectInvoice] = useState(false);
    const selectInvoiceRef = useRef()
    const notesLength = creditNotes?.length
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [quoteInput, setQuoteInput] = useState({
        date: new Date(),
        customer: {},
        dueDate: function(){
            const today = new Date(this.date);
            const futureDate = new Date(today.setDate(today.getDate()+ Number(this.terms)))
            return futureDate.toLocaleDateString();
        }
    });

    const [custName, setCustName] = useState('')
    const [invoiceRef, setInvoiceRef] = useState('')

    const [productName, setProductName] = useState('')

    const changeProductName = (e)=>{
        setProductName(e.target.value)
    }

    const [addedProducts, setAddedProducts] = useState([{
        qty : '',
        discountType : '%'
    }])
    const [visibleAutoComplete, setVisibleAutoComplete] = useState(null)
    const [addProduct, setAddproduct] = useState(true)
    const [addedCharges, setAddedCharges] = useState([{
        name : 'Delivery Charges',
        amount : '0'
    }])

    useEffect(() => {
        customers?.filter(cust => (
            cust.displayName === custName
        )).map(cust => (
            setQuoteInput(prev => ({
                ...prev,
                customer : cust
            }))
        ))
        
    }, [custName])

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

    useEffect(() => {
        
        document.addEventListener('mousedown', clickOutside);

        return ()=>{
            document.removeEventListener('mousedown', clickOutside);
        }
    }, [])
    
    function clickOutside(e){
        const {current : wrap} = selectInvoiceRef;
        if(wrap && !wrap.contains(e.target)){
            setSelectInvoice(false);
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setQuoteInput(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }
    
    const updateProducts = (item, index)=>{
        const oldProducts = [...addedProducts]
        
        if(oldProducts[index]){
            const newProducts = oldProducts.splice(index, 1, {
                ...item,
                qty : oldProducts[index].qty,
                discountType : oldProducts[index].discountType
            })
            setAddedProducts(oldProducts)
            if(addedProducts.length === 10){
                return setAddproduct(addProduct)
            }
            setAddproduct(false)
        }else{
            setAddedProducts(prev => ([...prev, {
                ...item,
                qty : oldProducts[index].qty,
                discountType : oldProducts[index].discountType
            }]))
            if(addedProducts.length === 10){
                return setAddproduct(addProduct)
            }
            setAddproduct(false)
        }
    }

    const updateFieldChanged = (name, index) => (e) => {
        let newArr = addedProducts.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: e.target.value };
        } else {
            return item;
        }
        });
        setAddedProducts(newArr);
    };

    const otherAdditionsChange = (name, index) => (event) => {
        let newArr = addedCharges.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: event.target.value };
        } else {
            return item;
        }
        });
        setAddedCharges(newArr);
    };

    const showAddProductsList = (e, index)=>{
        e.target.parentElement.parentElement.parentElement.classList.add('activeToAddPro')
        setVisibleAutoComplete(index)
    }

    const removeAddProductClass = (e)=>{
        
        e.target.parentElement.parentElement.parentElement.parentElement.classList.remove('activeToAddPro')
        setVisibleAutoComplete(null)
    }

    const addNewProduct = ()=>{
        setAddedProducts(prev => ([...prev, {
            qty : '',
            discountType : '%'
        }]));
        setAddproduct(true)
    }

    const addNewCharge = ()=>{
        setAddedCharges(prev => ([...prev, {}]));
    }

    useEffect(() => {
        document.addEventListener('mousedown', handle_Click_Outside);

        return ()=>{
            document.removeEventListener('mousedown', handle_Click_Outside);
        }
    }, [])

    function handle_Click_Outside(e){
            const {current : wrap} = autoRef;
            if(wrap && !wrap.contains(e.target)){
                setVisibleAutoComplete(null)
            }
    }

    const grossAmount = addedProducts?.map(item => (
        item?.discountType === '%' ? Math.round(((Number(item?.qty) * Number(item?.sellingPrice)) - ((Number(item?.qty) * Number(item?.sellingPrice)) * (Number(item?.discount || 0)/100))) * (1 + (Number(item?.vatRate || 0)/100))) || 0 : Math.round(((Number(item?.qty) * Number(item?.sellingPrice)) - (Number(item?.discount || 0))) * (1 + (Number(item?.vatRate || 0)/100))) || 0)).reduce((acc, item) => (Number(acc) + Number(item)))

    const totalOtherCharges = addedCharges.map(item => (Number(item.amount) || 0)).reduce((acc, item) => (Number(acc) + Number(item)))

    const productsToSubmit = addedProducts.filter(item => item.qty !== '' && item.name !== '' && item.name !== undefined && item.name !== null)

    const noteNumber = notesLength > 0 ? Number(creditNotes[notesLength - 1]?.input?.number) + 1 : 1
    
    const invoiceData = {
        userID : user.userID,
        input : {
            ...quoteInput,
            noteId : uuid(),
            noteNumber
        },
        products : productsToSubmit,
        charges : addedCharges.filter(item => item.amount !== '0' && item.amount !== undefined && item.amount !== null && Number(item.amount) !== 0),
        grossAmount,
        netAmount : grossAmount + totalOtherCharges
    }

    const sendNote = async({data : note})=>{
        const {data} = await baseURL.post(`/creditNotes/sendCreditNote/${note._id}`, note, {
            headers : {
                'auth-token' : user?.token
            }
        })
        return data
    }

    const printer = async({data})=>{
        const {data: blob} = await baseURL.get(`/creditNotes/noteTemplates/${data._id}`, {
            responseType: 'blob',
            headers : {
                'auth-token' : user?.token
            }
        })
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(pdfBlob);

        print({
            printable : blobUrl,
            type: 'pdf',
            documentTitle: user?.userName,
            onPrintDialogClose : history.goBack,
        })
    }

    const submit = async()=>{
        if (!quoteInput.customer._id) {
            throw {
                message : 'Please add a customer'
            }
        }

        if (productsToSubmit.length <= 0) {
            throw {
                message : 'Please add at least one product'
            }
        }
        setLoader(true)
        const {data} = await baseURL.post('/creditNotes', invoiceData, {
            headers : {
                'auth-token' : user?.token
            }
        })
        return data
    }

    const handleSaveAndSend = async ()=>{
        try {
            const data = await submit()
            if (!data) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }
            const sentItem = await sendNote(data)

            if (!sentItem) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }

            setAlertMessage(sentItem.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                sentItem.status === 200 && history.goBack()
            }, 1000)

        } catch (error) {
            console.log(error);
            setAlertMessage(error.message ?? 'Failed to submit. Please try again later')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 1000)
        }finally{
            setLoader(false)
        }
    }

    const handleSave = async ()=>{
        try {
            const data  = await submit()

            if (!data) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && history.goBack()
            }, 1000)
        } catch (error) {
            setAlertMessage(error.message ?? 'Failed to submit. Please try again later')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 1000)
        }finally{
            setLoader(false)
        }
    }

    const handleSaveAndPrint = async ()=>{
        try {
            const data = await submit()
            if (!data) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }

            await printer(data)

        } catch (error) {
            setAlertMessage(error.message ?? 'Failed to submit. Please try again later')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 1000)
        }finally{
            setLoader(false)
        }
    }


    return (
        <div className="receipts NewInvoice">
            <div className="addProductHeading">
                <h2>Add A New Credit Note</h2>
                <div className="cancelButton" onClick={history.goBack}><i className="fas fa-times"></i></div>
            </div>
            <div className="formContainer">
                <form className='invoiceForm'>
                    <div className="invoiceFormTop" style={{justifyContent: 'space-between'}}>
                        <div className="date invoiceControl">
                            <label htmlFor="date">Date:</label>
                            <input type="date" name='date' value={quoteInput.date} id='date' className='invoiceSelectInput' onChange={handleChange} />
                        </div>
                        
                        <div className="invoiceNumber invoiceControl">
                            <span>
                                Note Number:
                            </span>
                            <span>
                                {notesLength > 0 ? Number(creditNotes[notesLength - 1]?.input?.number) + 1 : 1}
                            </span>
                        </div>
                    </div>

                    <div style={{display : 'flex', gap : '1rem', alignItems : 'center'}}>
                        <div ref={wrapperRef} className='customerName'>
                            <label htmlFor="customerName">Receiver: </label>
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
                                        if (item?.firstName?.toLowerCase().includes(custName?.toLowerCase()) || item?.lastName?.toLowerCase().includes(custName?.toLowerCase()) || (`${item?.designation} ${item?.firstName} ${item?.lastName}`)?.toLocaleLowerCase()?.includes(custName?.toLowerCase)) {
                                        return true
                                        }
                                    })
                                    .map((item, i) => (
                                        <div
                                            className='autoListItem'
                                            onClick={()=>{setCustName(item.displayName); setActive(false);}}
                                            key={i}
                                            tabIndex='0'
                                        >
                                            <p>{item.displayName}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                        </div>

                        <div ref={selectInvoiceRef} className='customerName'>
                            <label htmlFor="customerName">Inoice Ref: </label>
                            <input 
                                type="text"
                                value={invoiceRef} 
                                onChange={(e)=>{setInvoiceRef(e.target.value)}}
                                onClick={()=>{setSelectInvoice(!selectInvoice)}}
                                name='invoiceRef'
                                className='autoListItemInput'
                                id='invoiceRef'
                                placeholder='Select Invoice Number'
                            />

                            {
                                selectInvoice && 
                                <div className="autoCompleteContainer">
                                    {
                                        invoiceList?.filter(item => {
                                            if (!invoiceRef) return true
                                            if (item?.input?.number?.toLowerCase().includes(invoiceRef?.toLowerCase())) {
                                            return true
                                            }
                                        })
                                        .map((item, i) => (
                                            <div
                                                className='autoListItem'
                                                onClick={()=>{setInvoiceRef(item?.input?.number); setSelectInvoice(false); setQuoteInput(prev => ({...prev,invoiceRef : {
                                                    _id : item._id,
                                                    id : item.input.id,
                                                    number : item.input.number,
                                                }}))}}
                                                key={i}
                                                tabIndex='0'
                                            >
                                                <p>Invoice # {item?.input?.number}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    <div className="addInvoiceHeading">
                        <input name="invoiceHeading" id="additionalInfo" value={quoteInput.invoiceHeading} onChange={handleChange} placeholder='Add credit note heading here' className='invoiceHeading' />

                        <h3 className='netAmount'>Net Payable: {(grossAmount + totalOtherCharges).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                    </div>

                    <div className="invoiceAddProducts">
                        <table className='addProductsInvoiceTable' >
                            <thead className='addProductsInvoiceTableHead'>
                                <tr className='addProductRow addProductRowHead'>
                                    <th className='addProductData'>Product Name</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>Quantity</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>Unit Price</th>
                                    <th className='addProductData'>Discount</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>VAT Rate</th>
                                    <th
                                    className='invoiceAmountElem addProductData'>Amount</th>
                                </tr>
                            </thead>

                            <tbody className='addProductsInvoiceTableBody'>
                                
                                {addedProducts?.map((data, index) => (
                                    addedProducts[index] && <tr key={index} className='notActiveToAddPro addProductRow'>
                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    onClick={(e)=>{
                                                        showAddProductsList(e, index)
                                                    }}
                                                    className='addProductLabel'
                                                >
                                                    Product Name
                                                </label>
                                                <input
                                                    placeholder='Select Product'
                                                    type='text'
                                                    name="productName"
                                                    value={addedProducts[index]?.name}
                                                    onClick={(e)=>{
                                                        showAddProductsList(e, index)
                                                    }}
                                                    className='selectProduct invoiceAmountElem'
                                                />
                                            </div>
                                            {
                                                addedProducts[index]?.stockSummary?.closingStock && 
                                                <p className='availableProducts'>
                                                    <span>Available</span> <span>{`${addedProducts[index]?.stockSummary?.closingStock?.qty || 0} ${addedProducts[index]?.units || 'N/A'}`}</span>
                                                </p>
                                            }
                                        </td>

                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Quantity
                                                </label>
                                                <input
                                                    placeholder='Enter Quantity'
                                                    className='invoiceAmountElem'
                                                    type="text"
                                                    name="qty"
                                                    value={addedProducts[index]?.qty}
                                                    onChange={(e)=>{
                                                        if(isNaN(e.target.value)){
                                                            window.alert('Please only numbers allowed in this cell')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        updateFieldChanged("qty", index)(e)
                                                    }}
                                                />
                                            </div>
                                        </td>

                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Unit Price
                                                </label>
                                                <input
                                                    placeholder='Unit Price'
                                                    className='invoiceAmountElem'
                                                    type="text"
                                                    name="sellingPrice"
                                                    value={addedProducts[index]?.sellingPrice}
                                                    onChange={(e)=>{
                                                        if(isNaN(e.target.value)){
                                                            window.alert('Please only numbers allowed in this cell')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        updateFieldChanged("sellingPrice", index)(e)
                                                        
                                                    }}
                                                />
                                            </div>
                                        </td>
                                            

                                        <td className='addProductData'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Discount
                                                </label>
                                                <div className="addProductDiscount">
                                                    <input
                                                        placeholder={addedProducts[index]?.discountType === '%' ? 'Enter Discount Rate' : 'Enter Discount Value'}
                                                        type="text"
                                                        name="discount"
                                                        className='invoiceDiscountElem'
                                                        value={addedProducts[index]?.discount}
                                                        onChange={(e)=>{
                                                            if(isNaN(e.target.value)){
                                                                window.alert('Please only numbers allowed in this cell')
                                                                e.target.value = ''
                                                            }
                                                            if(addedProducts[index]?.discountType === '%'){
                                                                if(Number(e.target.value) > 100){
                                                                    window.alert('Discount rate cannot be more than 100')
                                                                    e.target.value = ''
                                                                    // return
                                                                }
                                                            }
                                                            updateFieldChanged("discount", index)(e)
                                                        }}
                                                    />
                                                    <select name="discountType"
                                                        className='selectDiscountType'
                                                        id="discountType"
                                                        value={addedProducts[index]?.discountType}
                                                        onChange={updateFieldChanged("discountType", index)}
                                                    >
                                                        <option value="%">%</option>
                                                        <option value="value">Value</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                        </td>

                                        <td className='addProductData addProductVAT'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    VAT Rate
                                                </label>
                                                <input
                                                    placeholder='Enter VAT Rate'
                                                    style={{width : '100%'}}
                                                    className='invoiceAmountElem'
                                                    type="text"
                                                    name="vatRate"
                                                    value={addedProducts[index]?.vatRate}
                                                    onChange={(e)=>{
                                                        if(isNaN(e.target.value)){
                                                            window.alert('Please only numbers allowed in this cell')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        if(Number(e.target.value) > 100){
                                                            window.alert('VAT rate cannot be more than 100%')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        updateFieldChanged("vatRate", index)(e)
                                                    }}
                                                />
                                            </div>
                                            
                                        </td>

                                        <td className='addProductData addProductAmount'>
                                            <div className="addProductDataControl">
                                                <label
                                                    className='addProductLabel'
                                                >
                                                    Amount
                                                </label>
                                                <input
                                                    style={{width : '100%'}}
                                                    className='invoiceAmountElem'
                                                    type="number"
                                                    name="amount"
                                                    value={addedProducts[index]?.discountType === '%' ? Math.round(((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.sellingPrice)) - ((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.sellingPrice)) * (Number(addedProducts[index]?.discount || 0)/100))) * (1 + (Number(addedProducts[index]?.vatRate || 0)/100))) : Math.round(((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.sellingPrice)) - (Number(addedProducts[index]?.discount || 0))) * (1 + (Number(addedProducts[index]?.vatRate || 0)/100)))}
                                                    readOnly={true}
                                                />
                                            </div>
                                            
                                        </td>
                                        <td className={visibleAutoComplete === index ? "autoCompleteContainer visibleAutoComplete" : "autoCompleteContainer"} ref={autoRef}>
                                            <input
                                                type='text'
                                                name="productName"
                                                value={productName}
                                                onChange={changeProductName}
                                                placeholder='Search Product'
                                                className='searchProductInput'
                                            />
                                            <button
                                                type="button"
                                                className='addNewCust addNewProduct'
                                            >
                                                <Link to='/products/new-product'>Add New Product</Link>
                                            </button>
                                            <div className='productItemCont'>
                                                {
                                                products?.filter(item => {
                                                    if (!productName || productName === '') return true
                                                    if (item.name?.toLowerCase().includes(productName?.toLowerCase())) {
                                                    return true
                                                }}).map((item, i) => (
                                                    <div
                                                        key={i}
                                                        tabIndex='0'
                                                        className='productItem'
                                                    >
                                                        <p
                                                            onClick={(e)=>{
                                                                updateProducts(item, index)
                                                                removeAddProductClass(e, null)
                                                            }}
                                                        >
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                            </div>
                                            
                                        </td>
                                    </tr>
                                ))}
                                <tr className='summation addProductData'>
                                    <td>
                                        <button
                                        onClick={addNewProduct}
                                        type="button" className='addRows btn'
                                        disabled={addProduct}
                                    >
                                        Add Row
                                    </button>
                                    </td>

                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='grossAmount'>Gross Amount:</td>
                                    <td className='grossAmount invoiceAmountElem'>{grossAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                    
                                </tr>

                                <tr className='summation addProductData'>
                                    <td>
                                    </td>

                                    <td></td>
                                    <td></td>
                                    <td className='otherChargesHead'>Other Charges <p className='chargedTo'>Charged to other income</p> {/* Valuefor other income should be negative */}
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {
                                    addedCharges?.map((item, i) => (
                                        addedCharges[i] && <tr className='otherCharges'>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className='otherChargeData'>
                                                <input type="text" name='name' value={addedCharges[i]?.name} onChange={otherAdditionsChange('name', i)} className='otherChargeInput' />
                                            </td>
                                            <td className='otherChargeData otherChargeInputAmountCont'>
                                                <input type="text" value={addedCharges[i]?.amount} onChange={(e)=>{
                                                    if(isNaN(e.target.value)){
                                                        window.alert('Please only numbers allowed in this cell');
                                                        e.target.value = ''
                                                        return
                                                    }
                                                    otherAdditionsChange('amount', i)(e)
                                                }} name='amount' className='otherChargeInputAmount' />
                                            </td>
                                            <td></td>
                                        </tr>
                                    ))
                                }
                                <tr className='addMoreChargesCont'>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='addMoreCharges'>
                                        <button onClick={addNewCharge} type="button" className='addRows btn'>Add More</button>
                                    </td>
                                    <td>Total</td>
                                    <td className='totalCharges'>{totalOtherCharges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>

                                <tr className='netAmountCont'>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td>Net Payable</td>
                                    <td ></td>
                                    <td className='netAmount'>{(grossAmount + totalOtherCharges).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            </tbody>
                        
                        
                        </table>
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

                                <button
                                    onClick={handleSaveAndSend}
                                    type="button" className='saveOption btn'>
                                    Save and Send
                                </button>

                                <button
                                    onClick={handleSaveAndPrint}
                                    type="button" className='saveOption btn'>
                                    Save and Print
                                </button>
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

export default CreditNote
