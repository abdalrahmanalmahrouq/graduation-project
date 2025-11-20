import { useState, useEffect } from 'react';

export const useFlashMessage = (duration = 2000) => { 
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if(message){
            const timer = setTimeout (() => {
                setMessage({ type: '', text: '' });
            },duration);
            return () => clearTimeout (timer); 
        }
       
    }, [message, duration]);

    return { message, setMessage };
}