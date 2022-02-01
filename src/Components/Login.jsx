import React, {useState} from 'react'
import {useHistory, Link} from 'react-router-dom'
import {baseURL} from './axios'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './RegisterUser.css'
import {loginUserSchema} from './schemas'
import useAuth from '../customHooks/useAuth';

function Login() {
    const  {user, login} = useAuth()
    const history = useHistory()
    const [errorMessage, setErrorMessage] = useState('')
    
    const onSubmit = async(data) => {
        try {
            const {data : resData} = await baseURL.post('/users/login', data, {
                withCredentials: true
            })
            
            await login(resData)
            history.push('/')

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
        resolver : yupResolver(loginUserSchema)
    })


    return (
        <div className='RegisterUser'>
            <p className='registerTitle'>Login to your account</p>
            {
                errorMessage && <p className="errorMessage"><span>{errorMessage}</span> <i className="fas fa-times" onClick={()=>{setErrorMessage(null)}}></i></p>
            } 
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formContainer">

                    <div className="formControl">
                        <label htmlFor="email">Email</label>
                        <div>
                            <input type="email" {...register('email', {required : 'Email is required', pattern:{value : '\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', message: 'Invalid Email'}})} placeholder='Enter Email' id='email' />
                            {errors?.email && <p className="error">{errors?.email?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <label htmlFor="password">Password</label>
                        <div>
                            <input type="password" {...register('password')} placeholder='Enter Password' id='password' />
                            {errors?.password && <p className="error">{errors?.password?.message}</p>}
                        </div>
                    </div>

                    <p className='loginLinkCont'><Link to='/forgot-password' className='loginLink'>Forgot Password?</Link></p>

                    <p className='loginLinkCont'>Do not have an account? <Link to='/register' className='loginLink'>Register</Link></p>
                    <div className="submitContainer">
                        <input type='submit' className="registerButton" value="Login"></input>
                    </div>
                
                </div>
            </form>
        </div>
    )
}

export default Login
