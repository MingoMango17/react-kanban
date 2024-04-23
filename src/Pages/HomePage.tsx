import React, { useMemo, useRef, useState } from 'react'
import Board from '../Components/Board'
import { BoardData, CardData } from '../types'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import Card from '../Components/Card'
import { generateId } from '../functions'
import { createPortal } from 'react-dom'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import Modal from '../Components/Modal'



function HomePage() {
    const [boards, setBoards] = useState<BoardData[]>([])
    const [cards, setCards] = useState<CardData[]>([])

    const [activeCard, setActiveCard] = useState<CardData | null>()
    const [activeBoard, setActiveBoard] = useState<BoardData | null>()

    const boardIds = useMemo(() => boards.map(board => board.id), [boards])
    const [boardTitle, setBoardTitle] = useState<string>('')
    const dialogRef = useRef<HTMLDialogElement>(null)

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
        addBoard(boardTitle)
        setBoardTitle('')
        dialogRef.current?.close()
    }

    const addBoard = (title: string = "Add Board") => {
        setBoards([
            ...boards,
            {
                id: generateId(),
                title: title,
            }
        ])
    }

    const addCard = (card: CardData) => {
        setCards([...cards, card])
    }

    const deleteBoard = (id: number) => {
        setBoards(
            boards.filter(board => board.id !== id)
        )
    }
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    const onDragStart = (event: DragStartEvent) => {
        // console.log(event)
        if (event.active.data.current?.type === "Card")
            setActiveCard(cards.find(card => card.id === event.active.id))

        if (event.active.data.current?.type === "Board")
            setActiveBoard(boards.find(board => board.id === event.active.id))
    }

    const onDragEnd = (event: DragEndEvent) => {
        setActiveCard(null)
        setActiveBoard(null)

        const { active, over } = event

        if (!over) return

        const activeId = active.id

        const isActiveColumn = active.data.current?.type === "Board"
        if (!isActiveColumn) return

        setBoards((boards) => {
            const activeIndex = boards.findIndex(board => board.id === activeId)

            const overIndex = boards.findIndex(board => board.id === over.id)

            return arrayMove(boards, activeIndex, overIndex)
        })
    }

    const onDragOver = (event: DragOverEvent) => {
        // console.log(event)
        const { active, over } = event
        const activeId = active.id
        const overId = over?.id

        if (activeId === overId) return

        const isActiveCard = event.active.data.current?.type === "Card"
        const isOverCard = event.over?.data.current?.type === "Card"

        if (!isActiveCard) return

        if (isActiveCard && isOverCard) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeId)
                const overIndex = cards.findIndex((card) => card.id === overId)

                if (cards[activeIndex].boardId != cards[overIndex].boardId) {
                    cards[activeIndex].boardId = cards[overIndex].boardId
                    return arrayMove(cards, activeIndex, overIndex - 1)
                }

                return arrayMove(cards, activeIndex, overIndex)
            })
        }

        const isOverBoard = event.over?.data.current?.type === "Board"
        // console.log(isOverBoard)
        if (isActiveCard && isOverBoard) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeId)

                cards[activeIndex].boardId = overId
                return arrayMove(cards, activeIndex, activeIndex)
            })
        }
    }

    return (
        <>
            <Modal ref={dialogRef}>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col'>
                        <label className='mb-3'>
                            Board Title
                            <input required value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                        </label>
                    </div>
                    <div className='foot flex mt-3'>
                        <div className='flex-1' />
                        <button className='btn'>Submit</button>
                        <button className='btn' onClick={closeModal}>Close</button>
                    </div>
                </form>
            </Modal>
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className='flex h-lvh w-full overflow-y-hidden px-[40px] items-center overflow-x-auto'>
                    <div className='m-auto mr-1 flex'>
                        <SortableContext items={boardIds}>
                            {boards.map(board => {
                                return (
                                    <Board
                                        board={board}
                                        deleteBoard={deleteBoard}
                                        key={board.id}
                                        addCard={addCard}
                                        cards={cards.filter(card => card.boardId === board.id)} />
                                )
                            })}
                        </SortableContext>
                    </div>
                    <div className='min-w-96 bg-black rounded-lg p-3 flex items-center mr-auto ml-0'>
                        <div className='flex-1'>
                            <button className="btn btn-circle btn-outline" onClick={handleModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M4 12H20M12 4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        Add Board
                    </div>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeBoard &&
                            <Board
                                board={activeBoard}
                                deleteBoard={deleteBoard}
                                addCard={addCard}
                                cards={cards.filter(card => card.boardId === activeBoard.id)}
                            />
                        }
                        {activeCard && <Card card={activeCard} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </>
    )
}

export default HomePage