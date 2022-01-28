import React, {useState, useContext, useEffect} from 'react'
import { useHistory,useParams } from 'react-router-dom';
import useHandleChange from '../customHooks/useHandleChange';
import Alert from './Alert';
import {baseURL} from './axios'
import Loader from './Loader';
import './NewCustomerForm.css'
import {UserContext} from './userContext'

function UpdateCustomer({onClick, refetch}) {
    const history = useHistory()
    const {customerNumber} = useParams()
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [loader, setLoader] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {change:newCustomer, handleChange, setChange:setNewCustomer} = useHandleChange({
        userID : user.userID,
        displayName : function(){
            return `${this.designation} ${this.firstName} ${this.lastName}`
        }
    });
    
    useEffect(() => {
        getCustomer()
    }, [])

    const getCustomer = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.get(`/customers/${customerNumber}`, {
                headers : {
                    'auth-token' : user.token
                }
            })
            setNewCustomer(prev => ({
                ...prev,
                id : data?.customer?.id,
                number : data?.customer?.number,
                designation : data?.customer?.designation,
                firstName : data?.customer?.firstName,
                lastName : data?.customer?.lastName,
                companyName : data?.customer?.companyName,
                email : data?.customer?.email,
                openingBalance : data?.customer?.openingBalance,
                billingCountry : data?.customer?.billingAddress?.country,
                billingRegion : data?.customer?.billingAddress?.region,
                billingAddress : data?.customer?.billingAddress?.address,
                billingCity : data?.customer?.billingAddress?.city,
                billingMobileTel : data?.customer?.billingAddress?.mobile,
                billingFixedTel : data?.customer?.billingAddress?.tel,
                billingWhatsApp : data?.customer?.billingAddress?.whatsApp,
                billingFaxTel : data?.customer?.billingAddress?.fax,
                shippingCountry : data?.customer?.shippingAddress?.country,
                shippingRegion : data?.customer?.shippingAddress?.region,
                shippingAddress : data?.customer?.shippingAddress?.address,
                shippingCity : data?.customer?.shippingAddress?.city,
                shippingMobileTel : data?.customer?.shippingAddress?.mobile,
                shippingFixedTel : data?.customer?.shippingAddress?.tel,
                shippingWhatsApp : data?.customer?.shippingAddress?.whatsApp,
                shippingFaxTel : data?.customer?.shippingAddress?.fax,
            }))
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            setLoader(true)
            const {data} = await baseURL.put(`/customers/${customerNumber}`, {
                ...newCustomer,
                displayName : newCustomer.displayName(),
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
            }, 3000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
        
    }

    return (
        <div className="newCustomerForm">
            <div className="addProductHeading">
                <h2>Edit Customer Details</h2>
                <div className="cancelButton" onClick={history.goBack}><i className="fas fa-times"></i></div>
            </div>
            <form className="customerForm" onSubmit={handleSubmit}>
                <div className="nameCont">
                    <div className="custFormControl">
                        <select name="designation" id="designation" className='designation' value={newCustomer.designation} onChange={handleChange}>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Miss">Miss</option>
                            <option value="Sir">Sir</option>
                            <option value="Dr">Dr</option>
                        </select>
                    </div>
                    <div className="custFormControl">
                        <label htmlFor="firstName" className='mobLabel'>First Name </label>
                        <input type="text" name="firstName" value={newCustomer.firstName} onChange={handleChange} id="firstName" className='custInputElem' />
                    </div>

                    <div className="custFormControl">
                        <label htmlFor="lastName" className='mobLabel'>Last Name </label>
                        <input type="text" name="lastName" value={newCustomer.lastName} onChange={handleChange} id="lastName" className='custInputElem'/>
                    </div>
                </div>

                <div className="custFormControl">
                    <label htmlFor="displayName" className='mobLabel'>Display Name</label>
                    <input type="text" name="displayName" value={newCustomer.displayName()} id="displayName" className='custInputElem'/>
                </div>

                <div className="custFormControl">
                    <label htmlFor="companyName" className='mobLabel'>Company Name</label>
                    <input type="text" name="companyName" value={newCustomer.companyName} onChange={handleChange} id="companyName" className='custInputElem'/>
                </div>

                <div className="custFormControl">
                    <label htmlFor="email" className='mobLabel'>Email Address</label>
                    <input type="email" name="email" value={newCustomer.email} onChange={handleChange} id="email" className='custInputElem'/>
                </div>

                <div className="custFormControl">
                    <label htmlFor="openingBalance" className='mobLabel'>Opening Balance</label>
                    <input type="openingBalance" name="openingBalance" value={newCustomer.openingBalance} onChange={(e)=>{
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
                                <input type="text" name="billingCountry" value={newCustomer.billingCountry} onChange={handleChange} id="billingCountry" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingRegion" className='mobLabel'>Region</label>
                                <input type="text" name="billingRegion" value={newCustomer.billingRegion} onChange={handleChange} id="billingRegion" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingAddress" className='mobLabel'>Address</label>
                                <input type="text" name="billingAddress" value={newCustomer.billingAddress} onChange={handleChange} id="billingAddress" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingCity" className='mobLabel'>City</label>
                                <input type="text" name="billingCity" value={newCustomer.billingCity} onChange={handleChange} id="billingCity" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingMobileTel" className='mobLabel'>Mobile</label>
                                <input type="text" name="billingMobileTel" value={newCustomer.billingMobileTel} onChange={handleChange} id="billingMobileTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingFixedTel" className='mobLabel'>Telephone</label>
                                <input type="text" name="billingFixedTel" value={newCustomer.billingFixedTel} onChange={handleChange} id="billingFixedTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingWhatsApp" className='mobLabel'>whatsApp</label>
                                <input type="text" name="billingWhatsApp" value={newCustomer.billingWhatsApp} onChange={handleChange} id="billingWhatsApp" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="billingFaxTel" className='mobLabel'>Fax</label>
                                <input type="text" name="billingFaxTel" value={newCustomer.billingFaxTel} onChange={handleChange} id="billingFaxTel" className='custInputElem'/>
                            </div>
                        </div>
                    </div>

                    <div className="shippingAddressCont singleAddress">
                        <span className='addressTitle'>Shipping Address</span> <span className='copyBilling' onClick={()=>{
                            setNewCustomer(prev => ({
                                ...prev,
                                shippingCountry : newCustomer?.billingCountry,
                                shippingRegion : newCustomer?.billingRegion,
                                shippingAddress : newCustomer?.billingAddress,
                                shippingCity : newCustomer?.billingCity,
                                shippingMobileTel : newCustomer?.billingMobileTel,
                                shippingFixedTel : newCustomer?.billingFixedTel,
                                shippingWhatsApp : newCustomer?.billingWhatsApp,
                                shippingFaxTel : newCustomer?.billingFaxTel,
                            }))
                        }}>Copy billing address</span>
                        <div className="shippingAddress">
                            <div className="custFormControl">
                                <label htmlFor="shippingCountry" className='mobLabel'>Country</label>
                                <input type="text" name="shippingCountry" value={newCustomer.shippingCountry} onChange={handleChange} id="shippingCountry" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingRegion" className='mobLabel'>Region</label>
                                <input type="text" name="shippingRegion" value={newCustomer.shippingRegion} onChange={handleChange} id="shippingRegion" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingAddress" className='mobLabel'>Address</label>
                                <input type="text" name="shippingAddress" value={newCustomer.shippingAddress} onChange={handleChange} id="shippingAddress" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingCity" className='mobLabel'>City</label>
                                <input type="text" name="shippingCity" value={newCustomer.shippingCity} onChange={handleChange} id="shippingCity" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingMobileTel" className='mobLabel'>Mobile</label>
                                <input type="text" name="shippingMobileTel" value={newCustomer.shippingMobileTel} onChange={handleChange} id="shippingMobileTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingFixedTel" className='mobLabel'>Telephone</label>
                                <input type="text" name="shippingFixedTel" value={newCustomer.shippingFixedTel} onChange={handleChange} id="shippingFixedTel" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingWhatsApp" className='mobLabel'>whatsApp</label>
                                <input type="text" name="shippingWhatsApp" value={newCustomer.shippingWhatsApp} onChange={handleChange} id="shippingWhatsApp" className='custInputElem'/>
                            </div>

                            <div className="custFormControl">
                                <label htmlFor="shippingFaxTel" className='mobLabel'>Fax</label>
                                <input type="text" name="shippingFaxTel" value={newCustomer.shippingFaxTel} onChange={handleChange} id="shippingFaxTel" className='custInputElem'/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button className="btn-can submitButtons" type='button' onClick={history.goBack}>Cancel</button>
                    <button className="btn-sub submitButtons" type='submit'>
                        Update
                    </button>
                </div>
            </form>
            
            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
            {
                loader && <Loader/>
            }
        </div>
    )
}


export default UpdateCustomer
