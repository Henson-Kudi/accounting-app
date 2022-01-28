import React, {useEffect, useState, useRef, useContext} from 'react'
import { useHistory, Link } from 'react-router-dom';
import './Invoice.css';
import {baseURL} from './axios'
import Loader from './Loader'
import Alert from './Alert';
import {UserContext} from './userContext'
import useFetch from '../customHooks/useFetch'
import uuid from 'react-uuid';


function CashPurchase() {
    const wrapperRef = useRef(null)
    const supRef = useRef(null)
    const selectOrderRef = useRef(null)
    const autoRef = useRef()
    const history = useHistory()
    const {user} = useContext(UserContext)
    const {data:products} = useFetch('products', [])
    const {data:receipts, loader, setLoader} = useFetch('purchaseReceipts', [])
    const {data:suppliers} = useFetch('suppliers', [])
    const {data:orders} = useFetch('purchaseOrders', [])

    const [selectOrder, setSelectOrder] = useState(false);
    const receiptsLength = receipts?.length
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [selectSup, setSelectSup] = useState(false);
    const [supName, setSupName] = useState()
    const [orderNum, setOrderNum] = useState()


    const [quoteInput, setQuoteInput] = useState({
        date: new Date(),
        terms : '15',
        supplier: {},
        dueDate: function(){
            const today = new Date(this.date);
            const futureDate = new Date(today.setDate(today.getDate()+ Number(this.terms)))
            return futureDate.toLocaleDateString();
        }
    });

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
        document.addEventListener('mousedown', clickOutside);

        return ()=>{
            document.removeEventListener('mousedown', clickOutside);
        }
    }, [])
    
    function clickOutside(e){
        const {current : wrap} = supRef;
        if(wrap && !wrap.contains(e.target)){
            setSelectSup(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', orderOutsideClick);

        return ()=>{
            document.removeEventListener('mousedown', orderOutsideClick);
        }
    }, [])
    
    function orderOutsideClick(e){
        const {current : wrap} = selectOrderRef;
        if(wrap && !wrap.contains(e.target)){
            setSelectOrder(false);
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
        item?.discountType === '%' ? Math.round(((Number(item?.qty) * Number(item?.costPrice)) - ((Number(item?.qty) * Number(item?.costPrice)) * (Number(item?.discount || 0)/100))) * (1 + (Number(item?.vatRate || 0)/100))) || 0 : Math.round(((Number(item?.qty) * Number(item?.costPrice)) - (Number(item?.discount || 0))) * (1 + (Number(item?.vatRate || 0)/100))) || 0)).reduce((acc, item) => (Number(acc) + Number(item)))

    const totalOtherCharges = addedCharges.map(item => (Number(item.amount) || 0)).reduce((acc, item) => (Number(acc) + Number(item)))

    const productsToSubmit = addedProducts.filter(item => item.qty !== '' && item.name !== '' && item.name !== undefined && item.name !== null)

    const receiptNumber = receiptsLength > 0 ? Number(receipts[receiptsLength - 1]?.input?.number) + 1 : 1

    const invoiceData = {
        userID : user.userID,
        input : {
            ...quoteInput,
            receiptNumber,
            receiptId : uuid(),
        },
        products : productsToSubmit,
        charges : addedCharges.filter(item => item.amount !== '0' && item.amount !== undefined && item.amount !== null && Number(item.amount) !== 0),
        grossAmount,
        netAmount : grossAmount + totalOtherCharges
    }

    const totalPayments = Number(quoteInput?.cashPayment || '0') + Number(quoteInput?.bankPayment || '0') + Number(quoteInput?.mobileMoneyPayment || '0')


    const handleSave = async()=>{
        
        try {
            if (!quoteInput.supplier._id) {
                throw {
                    message : 'Please add a supplier'
                }
            }

            if (productsToSubmit.length <= 0) {
                throw {
                    message : 'Please add at least one product'
                }
            }

            if (totalPayments !== (grossAmount + totalOtherCharges)) {
                throw {
                    message : 'Please total payments mustbe equal to net payable.'
                }
            }
            setLoader(true)
            const {data} = await baseURL.post('/purchaseReceipts', invoiceData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            if (!data) {
                throw {
                    message : 'Failed to post data. Please try later.'
                }
            }
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                history.goBack()
            }, 1000);

        } catch (error) {
            setAlertMessage(error.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 3000);
        }finally{
            setLoader(false)
        }
    }
    

    return (
        <div className="receipts NewInvoice">
            <div className="addProductHeading">
                <h2>Add A New Purchase Receipt</h2>
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
                                Receipt Number:
                            </span>
                            <span>
                                {receiptsLength > 0 ? Number(receipts[receiptsLength - 1]?.input?.number) + 1 : 1}
                            </span>
                        </div>
                    </div>

                    <div className='supAndCustCont'>
                        <div ref={supRef} className='customerName'>
                            <label htmlFor="supplierName">Supplier: </label>
                            <input 
                                type="text"
                                value={supName} 
                                onChange={(e)=>{setSupName(e.target.value)}}
                                onClick={()=>{setSelectSup(!selectSup)}}
                                name='supplierName'
                                className='autoListItemInput'
                                id='supplierName'
                                placeholder='Select Supplier'
                            />

                            {
                                selectSup && 
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
                                        }).map((item, i) => (
                                            <div
                                                className='autoListItem'
                                                onClick={()=>{
                                                    setSupName(item.displayName);
                                                    setSelectSup(false)
                                                    setQuoteInput(prev => ({
                                                        ...prev,
                                                        supplier : item
                                                    }))
                                                }}
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

                        <div ref={wrapperRef} className='customerName' ref={selectOrderRef}>
                            <label htmlFor="customerName">Order Number (ref): </label>
                            <input 
                                type="text"
                                value={orderNum} 
                                onChange={(e)=>{setOrderNum(e.target.value)}}
                                onClick={()=>{setSelectOrder(!selectOrder)}}
                                name='customerName'
                                className='autoListItemInput'
                                id='customerName'
                                placeholder='Select'
                            />

                            {
                                selectOrder && 
                                <div className="autoCompleteContainer">
                                    <button
                                        type="button"
                                        onClick={()=>{history.push('/purchase-order/new-purchase-order')}}
                                        className='addNewCust'
                                    >
                                        Add New Order
                                    </button>
                                    {
                                        orders?.filter(item => {
                                            if (!orderNum) return true
                                            if (item?.input?.number?.toLowerCase().includes(orderNum?.toLowerCase())) {
                                            return true
                                            }
                                        })
                                        .map((item, i) => (
                                            <div
                                                className='autoListItem'
                                                onClick={()=>{
                                                    setOrderNum(item?.input?.number);
                                                    setQuoteInput(prev => ({
                                                        ...prev,
                                                        orderRef : item
                                                    }))
                                                    setSelectOrder(false);
                                                }}
                                                key={i}
                                                tabIndex='0'
                                            >
                                                <p>Order # {item?.input?.number}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    <div className="addInvoiceHeading">
                        <input name="invoiceHeading" id="additionalInfo" value={quoteInput.invoiceHeading} onChange={handleChange} placeholder='Add receipt heading here' className='invoiceHeading' />

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
                                                    name="costPrice"
                                                    value={addedProducts[index]?.costPrice}
                                                    onChange={(e)=>{
                                                        if(isNaN(e.target.value)){
                                                            window.alert('Please only numbers allowed in this cell')
                                                            e.target.value = ''
                                                            return
                                                        }
                                                        updateFieldChanged("costPrice", index)(e)
                                                        
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
                                                    value={addedProducts[index]?.discountType === '%' ? Math.round(((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.costPrice)) - ((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.costPrice)) * (Number(addedProducts[index]?.discount || 0)/100))) * (1 + (Number(addedProducts[index]?.vatRate || 0)/100))) : Math.round(((Number(addedProducts[index]?.qty) * Number(addedProducts[index]?.costPrice)) - (Number(addedProducts[index]?.discount || 0))) * (1 + (Number(addedProducts[index]?.vatRate || 0)/100)))}
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
                                    <td className='otherChargesHead'>Other Charges <p className='chargedTo'>Charged to other expenses</p></td>
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
                                <tr className='summation addProductData'>
                                    <td></td>
                                    <td className='otherChargesHead meansOfPayments'>Enter Payments Below</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>

                                <tr className='notActiveToAddPro addProductRow'>
                                    <td className='addProductData'>
                                        <div className='addProductDataControl'>
                                            <label className='addProductLabel'>Cash</label>
                                            <input type='text' className='invoiceAmountElem' id='cash' name='cashPayment' value={quoteInput?.cashPayment} placeholder='Enter Cash Payment' onChange={(e)=>{
                                                if(isNaN(e.target.value)){
                                                    window.alert('Please only numbers allowed in this cell')
                                                    e.target.value = ''
                                                    return
                                                }
                                                handleChange(e)
                                            }} />
                                        </div>
                                    </td>
                                    <td className='addProductData'>
                                        <div className='addProductDataControl'>
                                            <label className='addProductLabel'>Bank</label>
                                            <input type='text' className='invoiceAmountElem' id='bank' name='bankPayment' value={quoteInput?.bankPayment} placeholder='Enter Bank Payment' onChange={(e)=>{
                                                if(isNaN(e.target.value)){
                                                    window.alert('Please only numbers allowed in this cell')
                                                    e.target.value = ''
                                                    return
                                                }
                                                handleChange(e)
                                            }} />
                                        </div>
                                    </td>
                                    <td className='addProductData'>
                                        <div className='addProductDataControl'>
                                            <label className='addProductLabel'>Mobile Money</label>
                                            <input type='text' className='invoiceAmountElem' id='mobileMoney' name='mobileMoneyPayment' value={quoteInput?.mobileMoneyPayment} placeholder='Enter MoMo Payment' onChange={(e)=>{
                                                if(isNaN(e.target.value)){
                                                    window.alert('Please only numbers allowed in this cell')
                                                    e.target.value = ''
                                                    return
                                                }
                                                handleChange(e)
                                            }} />
                                        </div>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td className='checTotals'>
                                        {
                                            totalPayments === (grossAmount + totalOtherCharges) ? <i className="fas fa-check-circle"></i> : <p className="notCorrect">
                                                <span className="notCorrectText">Please Ensure total payments equals net payable</span>
                                                <i className="fas fa-times-circle"></i>
                                            </p>
                                        }
                                    </td>
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

export default CashPurchase
