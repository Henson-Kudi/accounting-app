import React, {useState, useEffect, useRef, useContext} from 'react'
import { useHistory } from 'react-router-dom'
import uuid from 'react-uuid'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {baseURL} from './axios'
import './AddProductForm.css'
import Alert from './Alert'
import {UserContext} from './userContext'
import useHandleChange from '../customHooks/useHandleChange'
import useDragAndDrop from '../customHooks/useDragAndDrop'
import useFetch from '../customHooks/useFetch'
import {productSchema} from '../schemas/addProductSchema'
import Loader from './Loader'

function AddProductForm() {
    const [loader, setLoader] = useState(false)
    const [checked, setChecked] = useState(true)
    const [reqVat, setReqVat] = useState(true)
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const history = useHistory()

    const {active, errorMessage, dragenter, dragleave, drop, handleFileChange, files} = useDragAndDrop()
    const [otherErrors, setOtherErrors] = useState({})

    const {change: product, handleChange,} = useHandleChange({
        units : 'pcs',
        date : new Date()
    })
    const {data: products} = useFetch('products', [{}])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        resolver : yupResolver(productSchema)
    })


    const productData = {
        userID : user.userID,
        ...product,
        images : files,
        productType : checked ? 'good' : 'service',
        productNumber : products?.length > 0 ? Number(products[products?.length - 1]?.number) + 1 : 1,
        productId : uuid(),
        reqvat : reqVat ? 'Yes' : 'No',
    }

    const handleProductSubmit  = async (data)=>{
        
        if (otherErrors.openingStock || otherErrors.vatRate || otherErrors.stockPrice) {
            setAlertMessage('Please correct all errors')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
            return
        }
        try {
            setLoader(true)
            const res = await baseURL.post('/products', {
                ...productData,
                ...data
            }, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            // history.goBack()
            setAlertMessage(res.data.message)
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
                setAlertMessage('')
                res.data.status === 200 && history.goBack()
            }, 3000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleCheckChange = ()=>{
        setChecked(!checked)
    }

    const handleReqVatChange = ()=>{
        setReqVat(!reqVat)
    }

    const handleBlur = (e)=>{
        const {name, value} = e.target
        const num = Number(value)
        if (isNaN(num)) {
            setOtherErrors(prev => ({
                ...prev,
                [name]: 'Invalid input'
            }))
        }else{
            setOtherErrors(prev => ({
                ...prev,
                [name]: ''
            }))
            handleChange(e)
        }
    }


    return (
        <div className='AddProductForm'>
            <div className="addProductHeading">
                <h2>Add A New Product or Service</h2>
                <div className="cancelButton" onClick={history.goBack}><i className="fas fa-times"></i></div>
            </div>
            <form onSubmit={handleSubmit(handleProductSubmit)}>
                <div className="addProductContainer">
                    <div className="dateAndNumCont">
                        <div className="date productControl">
                            <label htmlFor="date">Date:</label>
                            <input type="date" name="date" id="date" onChange={handleChange} value={product?.date} className='productInput' />
                        </div>

                        <div className="productControl">
                            <label>Product Number:</label>
                            <input value={products?.length > 0 ? Number(products[products?.length - 1]?.number) + 1 : 1} readOnly className='productInput' />
                        </div>
                    </div>

                    <div className="productDetailsContainer">
                        <div className="addProductDetails">
                            <div className="productType productControl">
                                <span>Type:</span>

                                <label htmlFor="good">Good</label>

                                <input type='checkbox' name="good" id="good" onChange={handleCheckChange} value='good' checked={checked} disabled={true} className='productInput' />

                                <label htmlFor="service">Service</label>

                                <input type='checkbox' name="service" id="service" onChange={handleCheckChange} value='service' checked={!checked} disabled={true} className='productInput' />
                            </div>

                            <div className="productName productControl">
                                <label htmlFor="productName">Name:</label>
                                <input type="text"
                                id="productName"
                                {...register('productName', {require : 'This field is required'})}
                                placeholder='Enter Product Name'
                                className='productInput'/>
                            </div>
                            {
                                errors.productName && <p className='error'>{errors.productName.message}</p>
                            }

                            <div className="units productControl">
                                <label htmlFor="units">Units:</label>
                                <select name="units" id="units"
                                value={product.units} onChange={handleChange}
                                className='productInput'>
                                    <option className='productSelect' value='pcs'>
                                        Select (Default - pcs)
                                    </option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="lbs">Pounds (lbs)</option>
                                    <option value="t"> Tonnes (t)</option>
                                    <option value="doz">Dozen (doz)</option>
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="ctn">Cartons (ctn)</option>
                                    <option value="l">Litres (l)</option>
                                    <option value="m">Metres (m)</option>
                                    <option value="sq m">Square Metres (sq m)</option>
                                    <option value="ft">Feet (ft)</option>
                                    <option value="sq ft">Square Feet (sq ft)</option>
                                    
                                </select>
                            </div>
                        </div>
                        <div className={
                            active === 'true' ? "productImagesCont active" : active === 'false' ? 'productImagesCont' : "productImagesCont bad"
                        }
                        onDragEnter={dragenter}
                        onDragLeave={dragleave}
                        onDrop={drop}
                        onDragOver={dragenter}
                        >
                            <p>{
                                errorMessage ? errorMessage : <span>Drag and drop product <br/> images (Max 3)</span>
                            }</p>
                            <p style={{margin : '0.2rem'}}>Or</p>
                            <label htmlFor="dragAndDrop" className='addImageLabel'>Browse Images</label>
                            <input type="file" multiple name="dragAndDrop" id="dragAndDrop" accept='image/jpg, image/png, image/jpeg'  className='addImageInput' onChange={handleFileChange} />
                        </div>
                        <div className="selectImages">
                            {
                                files?.map(img => (
                                    <p className='listOfImages'>
                                        <span style={{fontSize: '3rem'}}>‣</span>
                                        <span>{img.name}</span>
                                    </p>
                                ))
                            }
                        </div>
                    </div>

                    <div className="prices">
                        <div>
                            <div className="sp productControl">
                                <label htmlFor="sp">Selling Price:</label>
                                <input id="sp" {...register('sp', {
                                    rquired : 'This field is required.',
                                    number : 'Number is required.',
                                    positive : 'Only positive numbers'
                                })} placeholder='Enter Selling Price' className='productInput' />
                            </div>
                            {
                                errors.sp && <p className='error'>Invalid Input</p>
                            }
                        </div>

                        <div>
                            <div className="cp productControl">
                                <label htmlFor="cp">Cost Price:</label>
                                <input  id="cp" {...register('cp', {required : 'This field is required.'})} placeholder='Enter Cost Price' className='productInput' />
                            </div>
                            {
                                errors.cp && <p className='error'>Invalid Input</p>
                            }
                        </div>
                    </div>

                    <div className="prices">
                        <div>
                            <div className="os productControl">
                                <label htmlFor="os">Opening Stock:</label>
                                <input id="os" type='text' name='openingStock' value={product.openingStock} onChange={handleChange} placeholder='Enter opening stock quantity' className='productInput' onBlur={handleBlur} />
                            </div>
                            {
                                otherErrors.openingStock && <p className='error'>
                                    {otherErrors.openingStock}
                                </p>
                            }
                        </div>

                        <div>
                            <div className="up productControl">
                                <label htmlFor="up">Unit Price:</label>
                                <input id="up" type='text' name='stockPrice' value={product.stockPrice} onChange={handleChange} placeholder='Enter unit cost of opening stock' className='productInput' onBlur={handleBlur} />
                            </div>
                            {
                                otherErrors.stockPrice && <p className='error'>
                                    {otherErrors.stockPrice}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="prices">
                        <div className="vat productControl">
                            <label htmlFor="reqVat">VAT recoverable?:</label>
                            <input type="checkbox" name="reqVat" id="reqVat" onChange={handleReqVatChange} value={reqVat} checked={reqVat} className='productInput' />
                        </div>

                        <div>
                            <div className="vatRate productControl" style={{
                                visibility : reqVat ? 'visible' : 'hidden'
                            }}>
                                <label htmlFor="vatRate">VAT rate:</label>
                                <input id="vatRate" type='text' name='vatRate' value={product.vatRate} onChange={handleChange} placeholder='Enter VAT rate (%)' className='productInput' onBlur={handleBlur} />
                            </div>
                            {
                                otherErrors.vatRate && <p className='error'>
                                    {otherErrors.vatRate}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="description productControl">
                        <textarea rows="4" type="text" id="description" {...register('description')} placeholder='Enter Product Description' className='productInput' />
                    </div>
                    {
                            errors.description && <p className='error'>{errors.description.message}</p>
                        }

                    

                    <div className="buttons">
                        <button className="btn-can" onClick={history.goBack}>Cancel</button>
                        <button className="btn-sub" type='submit'>
                            Submit
                        </button>
                    </div>
                </div>
            </form>
            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
            {
                loader && <Loader />
            }
        </div>
    )
}

export default AddProductForm
