import React, { useState } from 'react'
import Board from '../Components/Board'

interface BoardData {
    id: number,
    title: string,
}

function HomePage() {
    const [boards, setBoards] = useState<BoardData[]>([
        {
            id: 1,
            title: 'Board 1'
        }
    ])

    const addBoard = () => {
        const newId = boards.length ? boards[boards.length - 1].id + 1 : 1
        setBoards([
            ...boards,
            {
                id: newId,
                title: 'New Board',
            }
        ])
    }

    const deleteBoard = (id: number) => {
        setBoards(
            boards.filter(board => board.id !== id)
        )
    }
    return (
        <div className='flex h-lvh w-full overflow-y-hidden px-[40px] items-center overflow-x-auto'>
            <div className='m-auto mr-1 flex'>
                {boards.map(board => {
                    return (
                        <Board title={board.title} deleteBoard={deleteBoard} id={board.id} key={board.id} />
                    )
                })}
            </div>
            <div className='min-w-96 bg-black rounded-lg p-3 flex items-center mr-auto ml-0'>
                <div className='flex-1'>
                    <button className="btn btn-circle btn-outline" onClick={addBoard}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 12H20M12 4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                Add Board
            </div>
        </div>
    )
}

export default HomePage