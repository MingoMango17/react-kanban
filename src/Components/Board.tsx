import React, { useRef, useState } from 'react'
import Card from './Card'
import { DndContext, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import Modal from './Modal';

export interface CardData {
  title: string,
  description: string,
}

interface Props {
  title: string,
  id: number,
  deleteBoard: (id: number) => void,
}

const Board: React.FC<Props> = ({ title, deleteBoard, id }) => {
  const [cards, setCards] = useState<CardData[]>([])

  const [cardData, setCardData] = useState<CardData>({
    title: '',
    description: '',
  })
  // const [cardTitle, setCardTitle] = useState<string>('')
  // const [cardDescription, setCardDescription] = useState<string>('')

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal()
    }
  }

  const closeModal = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (dialogRef.current) {
      dialogRef.current.close()
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    addCard(cardData)
    if (dialogRef.current) {
      dialogRef.current.close()
    }
  }

  const addCard = ({ title, description }: CardData) => {
    setCards([
      ...cards,
      {
        title: title,
        description: description,
      }
    ])

    setCardData({
      title: '',
      description: '',
    })
  }
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )
  return (
    <>
      <Modal ref={dialogRef}>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col'>
            <label className='mb-3'>
              Card Title
              <input required value={cardData?.title} onChange={(e) => setCardData(prev=>{return {...prev, title: e.target.value}})} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>
            <label>
              Card Description
              <input required value={cardData?.description} onChange={(e) => setCardData(prev=>{return {...prev, description: e.target.value}})} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>
          </div>
          <div className='foot flex mt-3'>
            <div className='flex-1'/>
            <button className='btn'>Submit</button>
            <button className='btn' onClick={closeModal}>Close</button>
          </div>
        </form>
      </Modal>
      <div ref={setNodeRef} style={style}>
        <div className='min-w-96 max-w-96 bg-black rounded-lg p-3 h-[32rem] flex flex-col m-3'>
          <div className='font-bold align-middle flex'>
            <h1 className='flex-1 justify-center align-middle'>{title}</h1>
            <button className="btn" onClick={() => deleteBoard(id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
          </div>
          <div className="divider mb-1 mt-1" />
          <div className='overflow-auto overflow-x-hidden flex-1'>
            <DndContext
              sensors={sensors}
            >
              {cards.map((card, index) => {
                return (
                  <Card title={card.title} description={card.description} key={index} />
                )
              })}
            </DndContext>
          </div>
          <div className='flex mt-3'>
            <div className='flex-1' />
            <button className="btn btn-circle btn-outline" onClick={handleModal}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 12H20M12 4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Board