import { useState, useEffect } from 'react'

export function useLiveTimer(startTime?: number) {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (!startTime) {
            setElapsed(0)
            return
        }

        // Initial calculation to prevent jump
        setElapsed(Date.now() - startTime)

        const interval = setInterval(() => {
            setElapsed(Date.now() - startTime)
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime])

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`
    }

    return {
        formattedTime: formatTime(elapsed),
        elapsedMs: elapsed
    }
}
