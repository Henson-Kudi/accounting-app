import React, {useState} from 'react'
import {useHistory, Link} from 'react-router-dom'
import {baseURL} from './axios'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './RegisterUser.css'
import {contactUsSchema} from './schemas'


function ContactUs() {
    const history = useHistory()
    const [errorMessage, setErrorMessage] = useState(null)
    const [message, setMessage] = useState(null)
    const onSubmit = async(data) => {
        try {
            await baseURL.post('/contact-us', data)
            .then(async res => {
                setMessage(res.data)
            })
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data);
            };
            if (error.request) {
                console.log(error.request.response);
            };
            if (error.message) {
                console.log(error.message);
            };
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        resolver : yupResolver(contactUsSchema)
    })

    return (
        <div className='RegisterUser'>
            <p className='registerTitle'>Send Us A Message</p>
            {
                errorMessage && <p className="errorMessage"><span>{errorMessage}</span> <i className="fas fa-times" onClick={()=>{setErrorMessage(null)}}></i></p>
            }
            {
                message && <p className="errorMessage"><span>{message}</span> <i className="fas fa-times" onClick={()=>{setMessage(null)}}></i></p>
            }
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="formContainer">
                    <div className="formControl">
                        <label htmlFor="userName">User Name</label>
                        <div>
                            <input type="text" {...register('userName', {required : true})} placeholder='Enter Name' id='userName' />
                            {errors?.userName && <p className="error">{errors?.userName?.message}</p>}
                        </div>
                    </div>
                    

                    <div className="formControl">
                        <label htmlFor="email">Email</label>
                        <div>
                            <input type="email" {...register('email', {required : 'Email is required', pattern:{value : '\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', message: 'Invalid Email'}})} placeholder='Enter Email' id='email' />
                            {errors?.email && <p className="error">{errors?.email?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <label htmlFor="city">City</label>
                        <div>
                            <input type="text" {...register('address')} placeholder='Enter Address' id='city' />
                            {errors?.address && <p className="error">{errors?.address?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <div style={{width : '100%'}}>
                            <textarea style={{width : '100%'}} {...register('message')} placeholder='Enter Message' id='companyName' />
                            {errors?.message && <p className="error">{errors?.message?.message}</p>}
                        </div>
                    </div>

                    <div className="submitContainer">
                        <input type='submit' className="registerButton" value="Submit"></input>
                    </div>
                
                </div>
            </form>
        </div>
    )
}

export default ContactUs
