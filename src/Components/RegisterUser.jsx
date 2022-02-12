import React, {useState} from 'react'
import {useHistory, Link} from 'react-router-dom'
import {baseURL} from './axios'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './RegisterUser.css'
import {registerUserSchema} from './schemas'


function RegisterUser() {
    const history = useHistory()
    const [errorMessage, setErrorMessage] = useState('')
    const [logo, setLogo] = useState([])

    const fileChange = (e)=>{
        const {files} = e.target;
        setLogo(files)
    }

    const onSubmit = async(data) => {
        const submitData = new FormData()

        Object.keys(data).map(key => (
            submitData.append(key, data[key])
        ))

        submitData.append('files', logo[0], logo[0].name)

        try {
            const {data : res} = await baseURL.post('/users/register-user', submitData)

            res && history.push('/success')

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
        resolver : yupResolver(registerUserSchema)
    })

    return (
        <div className='RegisterUser'>
            <p className='registerTitle'>Register your company lets get started</p>
            {
                errorMessage && <p className="errorMessage"><span>{errorMessage}</span> <i className="fas fa-times" onClick={()=>{setErrorMessage(null)}}></i></p>
            }
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="formContainer">
                    <div className="formControl">
                        <label htmlFor="userName">User Name</label>
                        <div>
                            <input type="text" {...register('userName', {required : true})} placeholder='Enter User Name' id='userName' />
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
                        <label htmlFor="companyName">Company Name</label>
                        <div>
                            <input type="text" {...register('companyName')} placeholder='Enter Company Name' id='companyName' />
                            {errors?.companyName && <p className="error">{errors?.companyName?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <label htmlFor="country">Country</label>
                        <div>
                            <input type="text" {...register('country')} placeholder='Enter Country' id='country' />
                            {errors?.country && <p className="error">{errors?.country?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <label htmlFor="city">City</label>
                        <div>
                            <input type="text" {...register('city')} placeholder='Enter City' id='city' />
                            {errors?.city && <p className="error">{errors?.city?.message}</p>}
                        </div>
                    </div>

                    <div className="formControl">
                        <label htmlFor="password">Password</label>
                        <div>
                            <input type="password" {...register('password')} placeholder='Enter Password' id='password' />
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

                    <div className="formControl">
                        <label htmlFor="confirmPassword">Chose Logo</label>
                        <div>
                            <input type="file" name='file' id='file' accept='image/jpg, image/png, image/jpeg' onChange={fileChange} style={{color : 'white'}}  />
                        </div>
                    </div>

                    <p className='loginLinkCont'>Already Have an account? <Link to='/login' className='loginLink'>Login</Link></p>
                    <div className="submitContainer">
                        <input type='submit' className="registerButton" value="Register"></input>
                    </div>
                
                </div>
            </form>
        </div>
    )
}

export default RegisterUser
