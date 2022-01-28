import {useState} from 'react'

export default function(){
    const [active, setActive] = useState('false')
    const [errorMessage, setErrorMessage] = useState()
    const [files, setFiles] = useState([])

    const activeClass = ()=> setActive('true')
    const badFilesClass = ()=> setActive('bad')
    const inactiveClass = ()=> setActive('false')
    const preventDefaults = (e)=> e.preventDefault()

    const checkFilesType = (dataFiles)=> {

        if ((files.length + dataFiles.length) > 5) {
            setErrorMessage('Note more than 3 images please.')
            setFiles([])
            return badFilesClass()
        }
        const imagePattern = /image-*/
        
        for (const file of dataFiles) {
            
            if (!file.type.match(imagePattern)) {
                alert('Bad file(s) chosen. Please select only images')
                break
            }
            inactiveClass()
            setFiles(prev => (
                [ ...prev, file ]
            ))
        }
    }


    const dragenter = (e) => {
        preventDefaults(e)
        const dataTransfer = e.dataTransfer;
        const files = [...dataTransfer.items]
        const imagePattern = /image-*/

        if (files.length > 5) {
            setErrorMessage('Note more than 3 images please.')
            return badFilesClass()
        }

        for (const file of files) {
            if (!file.type.match(imagePattern)) {
                setErrorMessage('Bad file types chosen. Please add only images')
                badFilesClass()
                break
            }
            activeClass()
            setErrorMessage('Drop images to upload')
        }
        
    }


    const dragleave = (e) => {
        preventDefaults(e)
        inactiveClass()
        setErrorMessage()
    }

    const drop = (e) => {
        preventDefaults(e)
        inactiveClass()
        const dataTransfer = e.dataTransfer;
        const files = [...dataTransfer.files]
        checkFilesType(files)
        setErrorMessage(`Added ${files.length} images`)
    }

    const handleFileChange = (e) => {
        preventDefaults(e)
        inactiveClass()
        const dataFiles = [...e.target.files]

        checkFilesType(dataFiles)
        setErrorMessage(`Added ${dataFiles.length} images`)

    }

    return (
        {
            active, errorMessage, dragenter, dragleave, drop, handleFileChange, files
        }
    )
}