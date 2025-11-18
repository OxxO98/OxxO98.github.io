import { useEffect, useState, useRef, useCallback } from 'react';

function useReactPlayerHook( 
    videoId : string,
){
    //Ref
    const playerRef = useRef<HTMLVideoElement | null>(null);

    //State
    const FRAMERATE = 30;
    
    const initialState : ReactPlayerState = {
        src : `https://www.youtube.com/watch?v=${videoId}`,
        pip : false,
        playing : false,
        controls : false,
        volume : 1,
        muted : false,
        played : 0,
        playedSeconds : 0,
        loaded : 0,
        duration : 0,
        loop : false,
        seeking: false,
    }

    const [state, setState] = useState<ReactPlayerState>(initialState);

    //Handle
    const setPlayerRef = useCallback( (player: HTMLVideoElement) => {
        if(!player) return;
        playerRef.current = player;
    }, []);

    const _updateTime = () => {
        const player = playerRef.current;
        if (!player || player.seeking ) return;

        if (!player.duration) return;

        setState(prevState => ({
            ...prevState,
            playedSeconds: player.currentTime,
            played: player.currentTime / player.duration,
        }));
    }

    const handlePlay = () => {
        setState(prevState => ({ ...prevState, playing: true }));

        _updateTime();
    }

    const handlePause = () => {
        setState(prevState => ({ ...prevState, playing: false }));

        _updateTime();
    }

    const handlePausePlay = useCallback( ( playing : boolean ) => {
        setState(prevState => ({ ...prevState, playing: playing }));
    }, []);

    const handleTimeUpdate = () => {
        const player = playerRef.current;
        // We only want to update time slider if we are not currently seeking
        if (!player || player.seeking ) return;

        if (!player.duration) return;

        setState(prevState => ({
            ...prevState,
            playedSeconds: player.currentTime,
            played: player.currentTime / player.duration,
        }));
    };

    const handleDurationChange = () => {
        const player = playerRef.current;
        if (!player) return;

        setState(prevState => ({ ...prevState, duration: player.duration }));
    };

    const handleSeek = useCallback( ( time : number ) => {
        const player = playerRef.current;

        _updateTime();

        if (player) {
            player.currentTime = time;
        }
    }, []);

    const playerHandles = {
        handlePausePlay, handlePlay, handlePause, handleTimeUpdate, handleDurationChange, handleSeek
    }
    
    useEffect(() => {
        const intervalId = setInterval( () => { handleTimeUpdate() }, 1000/30);

        return () => clearInterval(intervalId);
    }, []);

    return { 
        frameRate : FRAMERATE, state, playerRef, setPlayerRef, playerHandles
    }
}

export { useReactPlayerHook }