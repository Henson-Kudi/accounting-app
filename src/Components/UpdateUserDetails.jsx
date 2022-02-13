import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {baseURL} from './axios'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './RegisterUser.css'
import {updateUserSchema} from './schemas'
import {UserContext} from '../customHooks/userContext'
import Alert from './Alert'
import Loader from './Loader'


function UpdateUserDetails() {
    const {user, refereshToken} = useContext(UserContext)
    const history = useHistory()
    const [errorMessage, setErrorMessage] = useState('')
    const [logo, setLogo] = useState([])
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [loader, setLoader] = useState(false)

    const fileChange = (e)=>{
        const {files} = e.target;
        setLogo(files)
    }

    const onSubmit = async(data) => {
        const submitData = new FormData()

        Object.keys(data).map(key => (
            submitData.append(key, data[key])
        ))

        submitData.append('logoUrl', user?.logoURL)

        if (logo.length > 0) {
            submitData.append('files', logo[0], logo[0].name)
        }

        try {
            setLoader(true)
            const {data : res} = await baseURL.post('/users/update-user-details', submitData, {
                headers : {
                    'auth-token' : user?.token
                }
            })

            setAlertMessage(res.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                res && history.goBack()
            }, 2000);

        } catch (error) {
            console.log(error);
            setAlertMessage(error.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 2000);
        }finally{
            setLoader(false)
            refereshToken()
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            userName : user?.userName,
            email : user?.userEmail,
            companyName : user?.companyName,
            country : user?.country,
            city : user?.city,
        },
        resolver : yupResolver(updateUserSchema)
    })

    return (
        <div className='RegisterUser'>
            <p className='registerTitle'>Update Company Details</p>
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
                        <label htmlFor="confirmPassword">Chose Logo</label>
                        <div>
                            <input type="file" name='file' id='file' accept='image/jpg, image/png, image/jpeg' onChange={fileChange} style={{color : 'white'}}  />
                        </div>
                    </div>

                    <div className="submitContainer" style={{
                        display: 'flex',
                        gap : '1rem',
                        alignItems : 'center',
                        justifyContent : 'flex-end',
                    }}>
                        <button type='button' className="registerButton" onClick={history.goBack} style={{
                            backgroundColor : 'red'
                        }}>Cancel</button>

                        <button type='submit' className="registerButton" value="Update" >Update</button>
                    </div>
                
                </div>
            </form>
            <Alert alert={alert} message={alertMessage}/>
            {loader && <Loader/>}
        </div>
    )
}

export default UpdateUserDetails
