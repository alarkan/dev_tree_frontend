import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getUserByHandle } from "../api/DevTreeApi"
import { Task } from "../types"
import { RectangleStackIcon } from "@heroicons/react/20/solid"

const HandleView = () => {
    const params = useParams()
    const handle = params.handle!
    const { data, error, isLoading } = useQuery({
        queryFn: () => getUserByHandle(handle),
        queryKey: ["handle", handle],
        retry: false,
    })

    if (isLoading) return <p className="text-center text-white">Cargando...</p>
    if (error) return <Navigate to="/404" />
    if (data) {
        const tasks: Task[] = JSON.parse(data.tasks).filter((task: Task) => task.enabled)
        return (
            <div className="space-y-6 text-white">
                <p className="text-5xl text-center font-black">{data.handle}</p>
                <p className="text-lg text-center font-bold">{data.description}</p>
                <div className="mt-20 flex flex-col gap-6">
                    {tasks.length ?
                        tasks.map(task => (
                            <div key={task.name} className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg">
                                <RectangleStackIcon className='mr-2 h-5 w-5 text-gray-400' aria-hidden="true"/>
                                <p className="text-black capitalize text-lg">Id {task.id}-{task.task_description}</p>
                            </div>
                        ))
                        :
                        <p></p>
                    }
                </div>
            </div>
        )
    }
}

export default HandleView