import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getUserByHandle } from "../api/DevTreeApi"
import { SocialNetwork } from "../types"

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
        const links: SocialNetwork[] = JSON.parse(data.links).filter((link: SocialNetwork) => link.enabled)
        return (
            <div className="space-y-6 text-white">
                <p className="text-5xl text-center font-black">{data.handle}</p>
                <p className="text-lg text-center font-bold">{data.description}</p>
                <div className="mt-20 flex flex-col gap-6">
                    {links.length ?
                        links.map(link => (
                            <a key={link.name} className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg" href={link.url} target="_blank" rel="noopener noreferrer">
                                <img src={`/social/icon_${link.name}.svg`} alt={link.name} className="w-12" />
                                <p className="text-black capitalize font-bold text-lg">Visita mi: {link.name}</p>
                            </a>
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