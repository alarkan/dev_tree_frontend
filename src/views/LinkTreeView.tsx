import DevTreeInput from '../components/DevTreeInput'
import { useEffect } from 'react'
import { social } from '../data/social'
import { useState } from 'react'
import { isValidUrl } from '../utils'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/DevTreeApi'
import { User, SocialNetwork } from '../types'

const LinkTree = () => {

    const queryClient = useQueryClient()
    const [devTreeLinks, setDevTreeLinks] = useState(social)
    const user: User = queryClient.getQueryData(['user'])!
    const links: SocialNetwork[] = JSON.parse(user.links)

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Profile updated successfully')
        }
    })

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === e.target.name) {
                return { ...link, url: e.target.value }
            }
            return link
        })
        setDevTreeLinks(updatedLinks)
    }

    const handleEnableLink = (socialNetWork: string) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === socialNetWork) {
                console.log(link.url)
                if (isValidUrl(link.url)) {
                    return { ...link, enabled: !link.enabled }
                } else {
                    toast.error('URL Invalida')
                }
            }
            return link
        })
        setDevTreeLinks(updatedLinks)
        let updatedItems: SocialNetwork[] = []
        const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetWork)
        if (selectedSocialNetwork?.enabled) {
            const id = links.filter(link => link.id > 0).length + 1
            if (links.some(link => link.name === socialNetWork)) {
                updatedItems = links.map(link => {
                    if (link.name === socialNetWork) {
                        return {
                            ...link,
                            enabled: true,
                            id: id,
                        }
                    } else {
                        return link
                    }
                })
            } else {
                const newItem = {
                    ...selectedSocialNetwork,
                    id: id
                }
                updatedItems = [...links, newItem]
            }
        } else {
            const indexToUpdate = links.findIndex(link => link.name === socialNetWork)
            updatedItems = links.map(link => {
                if (link.name === socialNetWork) {
                    return {
                        ...link,
                        id: 0,
                        enabled: false
                    }
                } else if (link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1)) {
                    return {
                        ...link,
                        id: link.id - 1
                    }
                } else {
                    return link
                }
            })
        }
        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedItems)
            }
        })
    }

    useEffect(() => {
        const updatedData = devTreeLinks.map(item => {
            const userLink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
            if (userLink) {
                return { ...item, url: userLink.url, enabled: userLink.enabled }
            }
            return item
        })
        setDevTreeLinks(updatedData)
    }, [])

    return (
        <div className='space-y-5'>
            {devTreeLinks.map((link, index) => (
                <DevTreeInput key={index} item={link} handleUrlChange={(e) => handleUrlChange(e)} handleEnableLink={handleEnableLink} />
            ))}
            <button onClick={() => updateProfileMutation.mutate(queryClient.getQueryData(['user'])!)} className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded'>Guardar</button>
        </div>
    )
}

export default LinkTree