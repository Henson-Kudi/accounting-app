import * as yup from 'yup'

export const registerUserSchema = yup.object().shape({
        userName : yup.string().min(6, 'User name must be at least 6 characters').max(255, 'User name cannot be more than 255 characters').required('User name is required'),
        email : yup.string().email('Please enter valid email address').min(6, 'Email must be at least 6 characters').max(50, 'Email cannot be more than 50 characters').required('Email is required'),
        companyName : yup.string().min(6, 'Company name must be at least 6 characters.').max(255, 'Company name cannot be more than 255 characters.').required('Company name is required'),
        country : yup.string().max(255, 'Country cannot be more than 255 characters'),
        city : yup.string().max(255, 'City cannot be more than 255 characters'),
        password : yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword : yup.string().oneOf([yup.ref('password'), null]).required('Confirm Password must match password'),
    })

    export const loginUserSchema = yup.object().shape({
        email : yup.string().email('Please enter valid email address').min(6, 'Email must be at least 6 characters').max(50, 'Email cannot be more than 50 characters').required('Email is required'),
        password : yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    })

    export const forgotPasswordSchema = yup.object().shape({
        email : yup.string().email('Please enter valid email address').min(6, 'Email must be at least 6 characters').max(50, 'Email cannot be more than 50 characters').required('Email is required'),
        password : yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword : yup.string().oneOf([yup.ref('password'), null]).required('Confirm Password must match password'),
    })

    export const contactUsSchema = yup.object().shape({
        userName : yup.string().min(6, 'Name must be at least 6 characters').max(255, 'Name cannot be more than 255 characters').required('Name is required'),
        email : yup.string().email('Please enter valid email address').min(6, 'Email must be at least 6 characters').max(50, 'Email cannot be more than 50 characters').required('Email is required'),
        message : yup.string().min(20, 'Message must be at least 20 characters.').required('Message is required'),
        city : yup.string().max(255, 'Address cannot be more than 255 characters'),
    })