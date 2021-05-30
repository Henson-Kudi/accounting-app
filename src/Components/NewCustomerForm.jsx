import React, {useState} from 'react'
import {baseURL as axios} from './axios'
import './NewCustomerForm.css'

function NewCustomerForm({onClick, setValue}) {
    const [newCustomer, setNewCustomer] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;

        setNewCustomer(prevValue => {
            return {
                ...prevValue,
                [name] : value
            }
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        axios.post('/customers', newCustomer)
        .then(res => console.log(res.data))
    }

    return (
        <div className="newCustomerForm">
            <div className="close" onClick={onClick}>
                <i className="fas fa-times fa-lg"></i>
            </div>
            <h3>Add New Customer</h3>
            <form action="" className="form">
                    <div className="formGroup">
                        <label htmlFor="name">Customer Name</label>
                        <input type="text" name="name" value={newCustomer.name} onChange={handleChange} id="name"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" value={newCustomer.email} onChange={handleChange} id="email"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="country">Country</label>
                        <input type="text" name="country" value={newCustomer.country} onChange={handleChange} id="country"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="city">Town/City</label>
                        <input type="text" name="city" value={newCustomer.city} onChange={handleChange} id="city"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="street">Street Address</label>
                        <input type="text" name="street" value={newCustomer.street} onChange={handleChange} id="street"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="tel">Telephone</label>
                        <input type="text" name="tel" value={newCustomer.tel} onChange={handleChange} id="tel"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="mobile">Mobile</label>
                        <input type="text" name="mobile" value={newCustomer.mobile} onChange={handleChange} id="mobile"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="fax">Fax</label>
                        <input type="text" name="fax" value={newCustomer.fax} onChange={handleChange} id="fax"/>
                    </div>

                    <div></div>

                    <div className="formGroup">
                        <button type='button' onClick={onClick} className='btn'>Cancel</button>
                        <button type='button' onClick={(e)=>{
                            handleSubmit(e);
                            onClick()
                        }} className='btn'>Save</button>
                    </div>
            </form>
        </div>
    )
}


export default NewCustomerForm
