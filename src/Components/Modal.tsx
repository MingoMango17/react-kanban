import React, { forwardRef } from 'react'

interface ModalProps {
    children: React.ReactNode
}

const Modal = forwardRef<HTMLDialogElement, ModalProps>((props, ref) => {
    return (
        <div>
            <dialog id="my_modal_1" ref={ref} className="modal">
                <div className="modal-box">
                    {props.children}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
})

export default Modal