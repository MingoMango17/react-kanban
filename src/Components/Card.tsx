// import { useDraggable } from '@dnd-kit/core'
import { CardData } from '../types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';

interface Props {
    card: CardData
}
const Card = ({ card }: Props): JSX.Element => {
    const { attributes, listeners, setNodeRef, transform, isDragging, transition } = useSortable({
        id: card.id,
        data: {
            type: "Card",
            card
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div >
                <div className='flex justify-center' ref={setNodeRef}  style={style}>
                    <div
                        className="opacity-30 bg-mainBackgroundColor p-2.5 w-[90%] min-h-[76px] items-center flex text-left rounded-lg border-2 border-rose-500  cursor-grab relative mb-3 mt-3"
                    />
                </div>
            </div>
        );
    }

    return (
        <div >
            <div className='flex justify-center' ref={setNodeRef} {...listeners} {...attributes} style={style}>
                <div className='w-[90%] bg-base-100 shadow-xl rounded-lg p-3 mb-3 mt-3'>
                    <h2 className='font-bold text-lg'>{card.title}</h2>
                    <p>{card.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Card