import { SocialNetwork } from "../types/"
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

type DevTreeLinkProps = {
    link: SocialNetwork
}

const DevTreeLink = ({ link }: DevTreeLinkProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white px-5 py-2 flex flex-items-center gap-5 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-cover" style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}></div>
            <p className="capitalize">Visita Mi: <b>{link.name}</b></p>
        </li>
    )
}

export default DevTreeLink