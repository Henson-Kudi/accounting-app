import {baseURL} from '../Components/axios'



export default function (){
    
    const sendQuote = async({data : quote})=>{
        const {data} = await baseURL.post(`/quotations/sendQuotation/${quote._id}`, quote, {
            headers : {
                'auth-token' : user?.token
            }
        })
        return data
    }

    const printer = async({data})=>{

        const {data: blob} = await baseURL.get(`/quotations/${data._id}`, {
            responseType: 'blob',
            headers : {
                'auth-token' : user?.token
            }
        })
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(pdfBlob);

        print({
            printable : blobUrl,
            type: 'pdf',
            documentTitle: user?.userName,
        })
    }

    const submit = async()=>{
        if (!quoteInput.customer._id) {
            throw {
                message: 'Please add a customer.'
            }
        }

        if (productsToSubmit.length <= 0) {
            throw {
                message : 'Please add at least one product'
            }
        }

        setLoader(true)
        const {data} = await baseURL.post('/quotations', invoiceData, {
            headers : {
                'auth-token' : user?.token
            }
        })
        return data
    }

    const handleSaveAndSend = async ()=>{
        try {
            const data = await submit()
            if (!data) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }
            const sentItem = await sendQuote(data)

            if (!sentItem) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }

            setAlertMessage(sentItem.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                sentItem.status === 200 && history.goBack()
            }, 1000)

        } catch (error) {
            console.log(error);
            setAlertMessage(error.message ?? 'Failed to submit. Please try again later')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 1000)
        }finally{
            setLoader(false)
        }
    }

    const handleSave = async ()=>{
        
        try {
            const data  = await submit()

            if (!data) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && history.goBack()
            }, 1000)
        } catch (error) {
            setAlertMessage(error.message ?? 'Failed to submit. Please try again later')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 1000)
        }finally{
            setLoader(false)
        }
    }

    const handleSaveAndPrint = async ()=>{
        try {
            const data = await submit()
            if (!data) {
                throw {
                    message : 'Failed to submit. Please try again later'
                }
            }

            await printer(data)

        } catch (error) {
            setAlertMessage(error.message ?? 'Failed to submit. Please try again later')
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
            }, 1000)
        }finally{
            setLoader(false)
        }
    }
}