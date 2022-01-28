import React, {useState, useContext} from 'react'
import { useHistory } from 'react-router-dom';
import uuid from 'react-uuid';
import useFetch from '../customHooks/useFetch';
import useHandleChange from '../customHooks/useHandleChange';
import Alert from './Alert';
import {baseURL} from './axios'
import Loader from './Loader';
import './NewCustomerForm.css'
import {UserContext} from './userContext'

function NewCustomerForm({onClick, refetch}) {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {change:newSupplier, handleChange, setChange:setNewSupplier} = useHandleChange({
        userID : user.userID,
        id : uuid(),
        designation : 'Mr',
        firstName : '',
        lastName : '',
        displayName : function(){
            return `${this.designation} ${this.firstName} ${this.lastName}`
        }
    });
    const {data:supplierData, loader, setLoader} = useFetch('suppliers', [])

    const supNumber = supplierData?.length > 0 ? Number(supplierData[supplierData?.length - 1]?.number) + 1 : 1

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            setLoader(true)
            const {data} = await baseURL.post('/suppliers', {
                ...newSupplier,
                number : supNumber,
                displayName : newSupplier.displayName()
            }, {
                headers:{
                    'auth-token': user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && history.goBack()
            }, 1000)
            e.target.reset()
        } catch (error) {
            setAlertMessage(error.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 3000)
        }finally{
            setLoader(false)
        }
        
    }

    return (
        <div className="newCustomerForm">
            <div className="addProductHeading">
                <h2>Add A New Supplier</h2>
                <p>{supNumber}</p>
                <div className="cancelButton" onClick={history.goBack}><i className="fas fa-times"></i></div>
            </div>
            <form action="" className="customerForm" onSubmit={handleSubmit}>
                <div className="nameCont">
                    <div className="custFormControl">
                        <select name="designation" id="designation" className='designation' onChange={handleChange}>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Miss">Miss</option>
                            <option value="Sir">Sir</option>
                            <option value="Doc">Dr</option>
                        </select>
                    </div>
                    <div className="custFormControl">
                        <label htmlFor="firstName" className='mobLabel'>First Name </label>
                        <input type="text" name="firstName" value={newSupplier.firstName} onChange={handleChange} id="firstName" className='custInputElem' />
                    </div>

                    <div className="custFormControl">
                        <label htmlFor="lastName" className='mobLabel'>Last Name </label>
                        <input type="text" name="lastName" value={newSupplier.lastName} onChange={handleChange} id="lastName" className='custInputElem'/>
                    </div>
                </div>

                <div className="custFormControl">
                    <label htmlFor="displayName" className='mobLabel'>Display Name</label>
                    <input type="text" name="displayName" value={newSupplier.displayName()} onChange={handleChange} id="displayName" className='custInputElem'/>
                </div>

                <div className="custFormControl">
                    <label htmlFor="companyName" className='mobLabel'>Company Name</label>
                    <input type="text" name="companyName" value={newSupplier.companyName} onChange={handleChange} id="companyName" className='custInputElem'/>
                </div>

                <div className="custFormControl">
                    <label htmlFor="email" className='mobLabel'>Email Address</label>
                    <input type="email" name="email" value={newSupplier.email} onChange={handleChange} id="email" className='custInputElem'/>
                </div>

                <div className="custFormControl">
                    <label htmlFor="openingBalance" className='mobLabel'>Opening Balance</label>
                    <input type="openingBalance" name="openingBalance" value={newSupplier.openingBalance} onChange={(e)=>{
                        if(isNaN(e.target.value)){
                            window.alert('opening balance should be a value')
                            e.target.value = ''
                            return
                        }
                        handleChange(e)
                    }} id="openingBalance" className='custInputElem'/>
                </div>

                <div className='addressContainer'>
                    <div className="billingAddressCont singleAddress">
                        <p className='addressTitle'>Billing Address</p>
                        <div className="billingAddress">
                            <div className="custFormControl">
                                <label htmlFor="billingCountry" className='mobLabel'>Country</label>
                                <input type="text" name="billingCountry" value={newSupplier.billingCountry} onChange={handleChange} id="billingCountry" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingRegion" className='mobLabel'>Region</label>
                                <input type="text" name="billingRegion" value={newSupplier.billingRegion} onChange={handleChange} id="billingRegion" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingAddress" className='mobLabel'>Address</label>
                                <input type="text" name="billingAddress" value={newSupplier.billingAddress} onChange={handleChange} id="billingAddress" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingCity" className='mobLabel'>City</label>
                                <input type="text" name="billingCity" value={newSupplier.billingCity} onChange={handleChange} id="billingCity" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingMobileTel" className='mobLabel'>Mobile</label>
                                <input type="text" name="billingMobileTel" value={newSupplier.billingMobileTel} onChange={handleChange} id="billingMobileTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingFixedTel" className='mobLabel'>Telephone</label>
                                <input type="text" name="billingFixedTel" value={newSupplier.billingFixedTel} onChange={handleChange} id="billingFixedTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingWhatsApp" className='mobLabel'>whatsApp</label>
                                <input type="text" name="billingWhatsApp" value={newSupplier.billingWhatsApp} onChange={handleChange} id="billingWhatsApp" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingFaxTel" className='mobLabel'>Fax</label>
                                <input type="text" name="billingFaxTel" value={newSupplier.billingFaxTel} onChange={handleChange} id="billingFaxTel" className='custInputElem'/>
                            </div>
                        </div>
                    </div>

                    <div className="shippingAddressCont singleAddress">
                        <span className='addressTitle'>Shipping Address</span> <span className='copyBilling' onClick={()=>{
                            setNewSupplier(prev => ({
                                ...prev,
                                shippingCountry : newSupplier?.billingCountry,
                                shippingRegion : newSupplier?.billingRegion,
                                shippingAddress : newSupplier?.billingAddress,
                                shippingCity : newSupplier?.billingCity,
                                shippingMobileTel : newSupplier?.billingMobileTel,
                                shippingFixedTel : newSupplier?.billingFixedTel,
                                shippingWhatsApp : newSupplier?.billingWhatsApp,
                                shippingFaxTel : newSupplier?.billingFaxTel,
                            }))
                        }}>Copy billing address</span>
                        <div className="shippingAddress">
                            <div className="custFormControl">
                                <label htmlFor="shippingCountry" className='mobLabel'>Country</label>
                                <input type="text" name="shippingCountry" value={newSupplier.shippingCountry} onChange={handleChange} id="shippingCountry" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingRegion" className='mobLabel'>Region</label>
                                <input type="text" name="shippingRegion" value={newSupplier.shippingRegion} onChange={handleChange} id="shippingRegion" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingAddress" className='mobLabel'>Address</label>
                                <input type="text" name="shippingAddress" value={newSupplier.shippingAddress} onChange={handleChange} id="shippingAddress" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingCity" className='mobLabel'>City</label>
                                <input type="text" name="shippingCity" value={newSupplier.shippingCity} onChange={handleChange} id="shippingCity" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingMobileTel" className='mobLabel'>Mobile</label>
                                <input type="text" name="shippingMobileTel" value={newSupplier.shippingMobileTel} onChange={handleChange} id="shippingMobileTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingFixedTel" className='mobLabel'>Telephone</label>
                                <input type="text" name="shippingFixedTel" value={newSupplier.shippingFixedTel} onChange={handleChange} id="shippingFixedTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingWhatsApp" className='mobLabel'>whatsApp</label>
                                <input type="text" name="shippingWhatsApp" value={newSupplier.shippingWhatsApp} onChange={handleChange} id="shippingWhatsApp" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingFaxTel" className='mobLabel'>Fax</label>
                                <input type="text" name="shippingFaxTel" value={newSupplier.shippingFaxTel} onChange={handleChange} id="shippingFaxTel" className='custInputElem'/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button className="btn-can submitButtons" type='button' onClick={history.goBack}>Cancel</button>
                    <button className="btn-sub submitButtons" type='submit'>
                        Submit
                    </button>
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


export default NewCustomerForm
