import React, {useState} from 'react'
import Alert from './Alert';
import {baseURL as axios} from './axios'
import './NewCustomerForm.css'

function NewSupplierForm({onClick, refetch}) {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        email: '',
        tel : '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;

        setNewSupplier(prevValue => {
            return {
                ...prevValue,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if (newSupplier.name == '' || newSupplier.email === '' || newSupplier.tel === '') {
            setAlertMessage("Please add supplier's name, email and telephone number")
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        } else {
            await axios.post('/suppliers', newSupplier)
            .then(async res => {
                const response = await res.data
                onClick();
                refetch()
            })
            .catch(err => console.log(err))
            }
    }

    return (
        <div className="newCustomerForm">
            <div className="close" onClick={onClick}>
                <i className="fas fa-times fa-lg"></i>
            </div>
            <h3>Add New Supplier</h3>
            <form action="" className="form">
                    <div className="formGroup">
                        <label htmlFor="name">Supplier's Name</label>
                        <input type="text" name="name" value={newSupplier.name} onChange={handleChange} id="name"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" value={newSupplier.email} onChange={handleChange} id="email"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="country">Country</label>
                        <input type="text" name="country" value={newSupplier.country} onChange={handleChange} id="country"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="city">Town/City</label>
                        <input type="text" name="city" value={newSupplier.city} onChange={handleChange} id="city"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="street">Street Address</label>
                        <input type="text" name="street" value={newSupplier.street} onChange={handleChange} id="street"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="tel">Telephone</label>
                        <input type="number" name="tel" value={newSupplier.tel} onChange={handleChange} id="tel"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="mobile">Mobile</label>
                        <input type="number" name="mobile" value={newSupplier.mobile} onChange={handleChange} id="mobile"/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="fax">Fax</label>
                        <input type="text" name="fax" value={newSupplier.fax} onChange={handleChange} id="fax"/>
                    </div>

                    <div></div>

                    <div className="formGroup">
                        <button type='button' onClick={onClick} className='btn'>Cancel</button>
                        <button type='button' onClick={(e)=>{
                            handleSubmit(e);
                        }} className='btn'>Save</button>
                    </div>
            </form>
            <Alert
                message={alertMessage}
                alert={alert}
            />
        </div>
    )
}


export default NewSupplierForm
