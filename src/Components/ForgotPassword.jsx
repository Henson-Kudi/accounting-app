import React, {useState} from 'react'
import {useHistory, Link} from 'react-router-dom'
import {baseURL} from './axios'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './RegisterUser.css'
import {forgotPasswordSchema} from './schemas'

function Login() {
    const history = useHistory()
    const [errorMessage, setErrorMessage] = useState('')
    
    const onSubmit = async(data) => {
        try {
            await baseURL.post('/forgot-password', data)
                .then(async res => {
                    history.push('/success')
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
        resolver : yupResolver(forgotPasswordSchema)
    })


    return (
        <div className='RegisterUser'>
            <p className='registerTitle'>Forgot Password? Change Password</p>
            {
                errorMessage && <p className="errorMessage"><span>{errorMessage}</span> <i className="fas fa-times" onClick={()=>{setErrorMessage(null)}}></i></p>
            } 
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="formContainer">

                    <div className="formControl">
                        <label htmlFor="email">Email</label>
                        <div>
                            <input type="email" {...register('email', {required : 'Email is required', pattern:{value : '\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', message: 'Invalid Email'}})} placeholder='Enter Email' id='email' />
                            {errors?.email && <p className="error">{errors?.email?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <label htmlFor="password">New Password</label>
                        <div>
                            <input type="password" {...register('password')} placeholder='Enter New Password' id='password' />
                            {errors?.password && <p className="error">{errors?.password?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div>
                            <input type="password" {...register('confirmPassword')} placeholder='Confirm Password' id='confirmPassword' />
                            {errors?.confirmPassword && <p className="error">Confirm Password must match password</p>}
                        </div>
                    </div>

                    <p className='loginLinkCont' style={{padding : '1rem 0 0'}}>I want to <Link to='/register' className='loginLink'>Register</Link> instead</p>
                    <div className="submitContainer">
                        <input type='submit' className="registerButton" value="Submit"></input>
                    </div>
                
                </div>
            </form>
        </div>
    )
}

export default Login
