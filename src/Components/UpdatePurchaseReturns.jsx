import React, {useEffect, useState, useRef, useContext} from 'react'
import { useHistory, Link, useParams } from 'react-router-dom';
import './Quotation.css';
import './Invoice.css';
import {baseURL} from './axios'
import axios from 'axios'
import Loader from './Loader'
import Alert from './Alert';
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch';


function UpdatePurchaseReturns() {
    const {returnNumber} = useParams()
    const selectInvoiceRef =useRef()
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [suppliers, setSuppliers] = useState([])
    const [purchaseReturn, setPurchaseReturn] = useState({})
    const [products, setProducts] = useState([])
    const [loader, setLoader] = useState(false)
    const [selectInvoice, setSelectInvoice] = useState(false)
    const [invoiceRef, setInvoiceRef] = useState('')

    const [active, setActive] = useState(false);
    const wrapperRef = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const {data:invoiceList} = useFetch('purchaseReturns', [])

    const [quoteInput, setQuoteInput] = useState({
        date : new Date(),
        dueDate: function(){
            const today = new Date(this.date);
            const futureDate = new Date(today.setDate(today.getDate()+ Number(this.terms)))
            return futureDate.toLocaleDateString();
        },
        
    });

    const [supName, setSupName] = useState('')

    const [productName, setProductName] = useState('')

    const changeProductName = (e)=>{
        setProductName(e.target.value)
    }

    const [addedProducts, setAddedProducts] = useState([{}])
    const [visibleAutoComplete, setVisibleAutoComplete] = useState(null)
    const [addProduct, setAddproduct] = useState(false)
    const autoRef = useRef()
    const [addedCharges, setAddedCharges] = useState([])

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchCreditNote(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const fetchCreditNote = async(source, unMounted)=>{
        const supReq = baseURL.get('suppliers', {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })

        const prodReq = baseURL.get('products', {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })

        const returnReq = baseURL.get(`purchaseReturns/${returnNumber}`, {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })

        try {
            setLoader(true)
            const res = await axios.all([supReq, prodReq, returnReq])
            const [supRes, prodRes, returnRes] = await res
            const returnData = await returnRes.data
            const suppliers = await supRes.data
            

            const addedProds = await returnRes.data?.products

            const prods = await prodRes.data

            const identifiedSup = suppliers?.filter(cust => cust._id === returnData?.supplier?._id && cust.id === returnData?.supplier?.id && cust.number === returnData?.supplier?.number)

            const addedProducts = addedProds?.map((product, index) => {
                const identical = prods.filter(item => item?._id === product._id && item.id === product.id && item?.number === product?.number)
                return {
                    ...identical[0],
                    qty : product.qty,
                    sellingPrice : product.up,
                    discountType : 'value',
                    discount : product?.discount?.amount,
                    vatRate : product?.vat?.rate,
                    
                }
            })

            const supName = suppliers?.filter(cust => cust._id === returnData?.supplier?._id && cust.id === returnData?.supplier?.id && cust.number === returnData?.supplier?.number).map(cust => cust?.displayName)

            setQuoteInput(prev => ({
                ...prev,
                date : returnData.input.date,
                invoiceHeading : returnData?.input?.heading,
                number : returnData?.input?.number,
                supplier: identifiedSup[0],
                invoiceRef : returnData?.input?.invoiceRef
            }))

            setInvoiceRef(returnData?.input?.invoiceRef?.number)

            setSupName(supName[0]);

            setAddedProducts(addedProducts)
            setAddedCharges(await returnRes.data.otherCharges)

            setSuppliers(await suppliers)
            setProducts(await prodRes.data)
            setPurchaseReturn(await returnData)
            
        } catch (error) {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }}
        }finally{
            setLoader(false)
        }
    }

    useEffect(() => {
        suppliers?.filter(sup => (
            sup.displayName === supName
        )).map(sup => (
            setQuoteInput(prev => ({
                ...prev,
                customer : sup
            }))
        ))
        
    }, [supName])

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
                discountType : oldProducts[index].discountType,
                discount : oldProducts[index].discount,
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

    const totalOtherCharges = addedCharges?.map(item => (Number(item.amount) || 0)).reduce((acc, item) => (Number(acc) + Number(item)), 0)

    const productsToSubmit = addedProducts?.filter(item => item.qty !== '' && item.name !== '' && item.name !== undefined && item.name !== null)

    
    const invoiceData = {
        userID : user.userID,
        input : {
            ...quoteInput,
            returnNumber : purchaseReturn?.input?.number,
            returnId : purchaseReturn?.input?.id
        },
        products : productsToSubmit,
        charges : addedCharges?.filter(item => item.amount !== '0' && item.amount !== undefined && item.amount !== null && Number(item.amount) !== 0),
        grossAmount,
        netAmount : grossAmount + totalOtherCharges
    }

    const submit = async()=>{
        if (!quoteInput.supplier._id) {
            setAlertMessage('Please add a supplier')
            setAlert(true)
            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
            }, 3000);
            return
        }

        if (productsToSubmit.length <= 0) {
            setAlertMessage('Please add at least one product')
            setAlert(true)
            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
            }, 3000);
            return
        }
        try {
            setLoader(true)
            const {data} = await baseURL.put(`/purchaseReturns/${returnNumber}`, invoiceData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            return data
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }


    const handleSave = async ()=>{
        const data  = await submit()
        setAlertMessage(data.message)
        setAlert(true)
        setTimeout(() => {
            setAlert(false)
            setAlertMessage('')
            history.goBack()
        }, 2000);
    }


    // FUNCTION BELOW WOULD BE USE TO PREPARE REPORTS FOR *SALES BY CUSTOMER, SALES BY ITEM, CUSTOMERS DEBT, AND MORE
    

    // const SampleDivEleFunc = ()=>{
    //     const submit = addedProducts?.map(product => {
    //         const elements = productsToSubmit.filter(item => item._id === product._id)
    //         console.log(elements);
    //         const filteredSum = elements.map(el => el.qty).reduce((acc, ele) => Number(acc) + Number(ele), 0)
    //         return <div>
    //             <div style={{display: filteredSum > 0 ? 'block' : 'none'}}>
    //                 <span>{product.productName} </span>
    //                 <span> {filteredSum}</span>
    //             </div>
    //     </div>
    //     })
    //     return submit
    // }


    return (
        
        <div className="Quotations NewInvoice">
            <div className="addProductHeading">
                <h2>Update Sales Return #{purchaseReturn?.input?.number}</h2>
                <div className="cancelButton" onClick={history.goBack}><i className="fas fa-times"></i></div>
            </div>
            <div className="formContainer">
                <form className='invoiceForm'>
                    <div className="invoiceFormTop">
                        <div className="date invoiceControl">
                            <label htmlFor="date">Date:</label>
                            <input type="date" name='date' value={quoteInput.date} id='date' className='invoiceSelectInput' onChange={handleChange} />
                        </div>
                        
                        <div className="invoiceNumber invoiceControl">
                            <span>
                                Number:
                            </span>
                            <span>
                                {quoteInput?.number}
                            </span>
                        </div>
                    </div>

                    <div style={{display : 'flex', gap : '1rem', alignItems : 'center'}}>
                        <div ref={wrapperRef} className='customerName'>
                            <label htmlFor="customerName">Supplier: </label>
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
                                        onClick={()=>{history.push('/customer/new-customer')}}
                                        className='addNewCust'
                                    >
                                        Add New Customer
                                    </button>
                                    {
                                        suppliers?.filter(item => {
                                            if (!supName) return true
                                            if ((`${item?.designation} ${item?.firstName} ${item?.lastName}`)?.toLocaleLowerCase()?.includes(supName?.toLowerCase)) {
                                            return true
                                            }
                                        }).map((item, i) => (
                                            <div
                                                className='autoListItem'
                                                onClick={()=>{setSupName(item.displayName); setActive(false);}}
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

                    {
                        quoteInput?.customer?.displayName && <div className="emailAndDetails">
                        <div className="customerEmail">
                            <p>Email: {quoteInput.customer?.email}</p>
                        </div>
                        <div className="addressInfoCont">
                            <div className="deliveryAdress">
                                <h4>Billing Address</h4>
                                <div className="addressInfo">
                                    <p>Country: {quoteInput.customer?.billingAddress?.country}</p>
                                    <p>City: {quoteInput.customer?.billingAddress?.city}</p>
                                    <p>Street: {quoteInput.customer?.billingAddress?.street}</p>
                                    <p>Tel: {quoteInput.customer?.billingAddress?.tel}</p>
                                    <p>Mobile: {quoteInput.customer?.billingAddress?.mobile}</p>
                                </div>
                            </div>
                            <div className="deliveryAdress">
                                <h4>Shiping Address</h4>
                                <div className="addressInfo">
                                    <p>Country: {quoteInput.customer?.shippingAddress?.country}</p>
                                    <p>City: {quoteInput.customer?.shippingAddress?.city}</p>
                                    <p>Street: {quoteInput.customer?.shippingAddress?.street}</p>
                                    <p>Tel: {quoteInput.customer?.shippingAddress?.tel}</p>
                                    <p>Mobile: {quoteInput.customer?.shippingAddress?.mobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    <div className="addInvoiceHeading">
                        <input name="invoiceHeading" id="additionalInfo" value={quoteInput.invoiceHeading} onChange={handleChange} placeholder='Add invoice heading here' className='invoiceHeading' />

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
                                                    if (item?.name?.toLowerCase().includes(productName?.toLowerCase())) {
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
                                    <td className='grossAmount invoiceAmountElem'>{grossAmount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                                    
                                </tr>

                                <tr className='summation addProductData'>
                                    <td>
                                    </td>

                                    <td></td>
                                    <td></td>
                                    <td className='otherChargesHead'>Other Charges <p className='chargedTo'>Charged to other income</p></td>
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
                                    <td className='totalCharges'>{totalOtherCharges?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
                    <div className="saveOptions" style={{
                        display : 'flex',
                        justifyContent : 'flex-end'
                    }}>
                        <button
                            onClick={history.goBack}
                            type="button" className='saveOption btn'>
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            type="button" className='saveOption btn'>
                            Update
                        </button>
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

export default UpdatePurchaseReturns

