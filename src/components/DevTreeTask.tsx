import { Task } from "../types"
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { RectangleStackIcon } from '@heroicons/react/20/solid'

type DevTreeTaskProps = {
    task: Task
}

const DevTreeTask = ({ task }: DevTreeTaskProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white px-5 py-2 flex flex-items-center gap-5 rounded-lg shadow-md">
            <RectangleStackIcon className='mr-2 h-5 w-5' aria-hidden="true"/>
            <p className="capitalize">Id {task.id}-<b>{task.task_description}</b></p>
        </li>
    )
}

export default DevTreeTask