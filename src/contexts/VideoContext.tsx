import { createContext } from 'react'

export const VideoContext = createContext<VideoContext>({
    videoId : '',
    frameRate : 30,
})
