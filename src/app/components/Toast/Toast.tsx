import React from 'react';
import Swal from 'sweetalert2'

export default function Toast(props: any) {
    
if(props.open){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: props.timer ? props.timer : 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    Toast.fire({
        icon: props.icon,
        title: props.mensagem
    })
    
}
   return (
        <>
        </>
    )
}
