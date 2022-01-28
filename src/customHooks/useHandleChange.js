import React, {useState} from 'react'

function useHandleChange(type) {
    const [change, setChange] = useState(type)

    const handleChange = (e)=>{
        const {name, value} = e.target

        setChange(prev =>(
            {
                ...prev,
                [name]: value
            }
        ))
    }

    return {
        change, handleChange, setChange
    }
}

export default useHandleChange
