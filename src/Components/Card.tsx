import { useDraggable } from '@dnd-kit/core'
import React, { useId } from 'react'

interface Props {
    title: string,
    description: string,
}

const Card: React.FC<Props> = ({ title, description }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: useId(),
    })
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
            <div className='flex justify-center'>
                <div className='w-[90%] bg-base-100 shadow-xl rounded-lg p-3 mb-3 mt-3'>
                    <h2 className='font-bold text-lg'>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
}

export default Card