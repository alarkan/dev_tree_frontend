import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import NavigationTabs from "../components/NavigationTabs";
import { User, Task } from "../types";
import DevTreeTask from "./DevTreeTask";
import { useQueryClient } from "@tanstack/react-query";

type DevTreeProps = {
    data: User
}

const DevTree = ({ data }: DevTreeProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [enabledTasks, setEnabledTasks] = useState<Task[]>(JSON.parse(data.tasks).filter((item: Task) => item.enabled))

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e
        if (over && over.id) {
            const prevIndex = enabledTasks.findIndex((task: Task) => task.id === active.id)
            const newIndex = enabledTasks.findIndex((task: Task) => task.id === over.id)
            const order = arrayMove(enabledTasks, prevIndex, newIndex)
            setEnabledTasks(order)
            const disabledTasks = JSON.parse(data.tasks).filter((item: Task) => !item.enabled)
            const tasks = [...order, ...disabledTasks]
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData,
                    tasks: JSON.stringify(tasks)
                }
            })
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        navigate('/auth/login');
    };

    useEffect(() => {
        setEnabledTasks(JSON.parse(data.tasks).filter((item: Task) => item.enabled))
    }, [data])
    return (
        <>
            <header className="bg-slate-800 py-5">
                <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
                    <div className="w-full p-5 lg:p-0 md:w-1/3">
                        <img src="/logo.svg" className="w-full block" />
                    </div>
                    <div className="md:w-1/3 md:flex md:justify-end">
                        <button
                            className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
                            onClick={() => handleLogout()}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>
            <div className="bg-gray-100  min-h-screen py-10">
                <main className="mx-auto max-w-5xl p-10 md:p-0">
                    <NavigationTabs />
                    <div className="flex justify-end">
                        <Link
                            className="font-bold text-right text-slate-800 text-2xl"
                            to={`/${data.handle}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >Visitar Mi Perfil : / {data.handle}</Link>
                    </div>
                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1 ">
                            <Outlet />
                        </div>
                        <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
                            <p className="text-center text-white text-4xl">{data.handle}</p>
                            {data.image &&
                                <img src={data.image} alt={data.handle} className="mx-auto max-w-[250px]" />
                            }
                            <p className="text-center text-lg font-black text-white">{data.description}</p>
                            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <div className="mt-20 flex flex-col gap-5">
                                    <SortableContext items={enabledTasks} strategy={verticalListSortingStrategy}>
                                        {enabledTasks.map(task => (
                                            <DevTreeTask key={task.name} task={task} />
                                        ))}
                                    </SortableContext>
                                </div>
                            </DndContext>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </>
    )
}

export default DevTree