import DevTreeInput from '../components/DevTreeInput'
import { useEffect } from 'react'
import { dataTask } from '../data/tasks'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/DevTreeApi'
import { User, Task } from '../types'

const TaskTree = () => {

    const queryClient = useQueryClient()
    const [devTreeTasks, setDevTreeTasks] = useState(dataTask)
    const user: User = queryClient.getQueryData(['user'])!
    const tasks: Task[] = JSON.parse(user.tasks)

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Perfil actualizado correctamente')
        }
    })

    const handleDescriptionTask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTasks = devTreeTasks.map(task => {
            if (task.name === e.target.name) {
                return { ...task, task_description: e.target.value }
            }
            return task
        })
        setDevTreeTasks(updatedTasks)
        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData,
                tasks: JSON.stringify(updatedTasks)
            }
        })
    }

    const handleEnableTask = (Task: string) => {
        const updatedTasks = devTreeTasks.map(task => {
            if (task.name === Task) {
                return { ...task, enabled: !task.enabled }
            }
            return task
        })
        setDevTreeTasks(updatedTasks)
        let updatedItems: Task[] = []
        const selectedTask = updatedTasks.find(task => task.name === Task)
        if (selectedTask?.enabled) {
            const id = tasks.filter(task => task.id > 0).length + 1
            if (tasks.some(task => task.name === Task)) {
                updatedItems = tasks.map(task => {
                    if (task.name === Task) {
                        return {
                            ...task,
                            enabled: true,
                            id: id,
                        }
                    } else {
                        return task
                    }
                })
            } else {
                const newItem = {
                    ...selectedTask,
                    id: id
                }
                updatedItems = [...tasks, newItem]
            }
        } else {
            const indexToUpdate = tasks.findIndex(task => task.name === Task)
            updatedItems = tasks.map(task => {
                if (task.name === Task) {
                    return {
                        ...task,
                        id: 0,
                        enabled: false
                    }
                } else if (task.id > indexToUpdate && (indexToUpdate !== 0 && task.id === 1)) {
                    return {
                        ...task,
                        id: task.id - 1
                    }
                } else {
                    return task
                }
            })
        }
        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData,
                tasks: JSON.stringify(updatedItems)
            }
        })
    }

    useEffect(() => {
        const updatedData = devTreeTasks.map(item => {
            const userTask = JSON.parse(user.tasks).find((task: Task) => task.name === item.name)
            if (userTask) {
                return { ...item, task_description: userTask.task_description, enabled: userTask.enabled }
            }
            return item
        })
        setDevTreeTasks(updatedData)
    }, [])

    return (
        <div className='space-y-5'>
            {devTreeTasks.map((task, index) => (
                <DevTreeInput key={index} item={task} handleDescriptionTask={(e) => handleDescriptionTask(e)} handleEnableTask={handleEnableTask} />
            ))}
            <button onClick={() => {updateProfileMutation.mutate(queryClient.getQueryData(['user'])!); window.location.reload();}} className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded'>Guardar</button>
        </div>
    )
}

export default TaskTree