import * as yup from 'yup'

export const productSchema = yup.object().shape({
        productName : yup.string().required('This field is required').min(6, 'Minimum 6 characters required.'),

        sp : yup.number('Number is required.').positive('Only positive numbers').required('This field is required'),

        cp : yup.number('Number is required.').required('This field is required').positive('Only positive numbers'),
        description : yup.string(),
    }) 