import { cancelFrame, frame, frameData } from "../../frameloop"
import { time } from "../../frameloop/sync-time"
import { FrameData } from "../../frameloop/types"
import { Driver } from "./types"
import { Ticker, TickerCallback } from 'pixi.js';

export const frameloopDriver: Driver = (update) => {
    const passTimestamp = ({ timestamp }: FrameData) => update(timestamp)

    return {
        start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
        stop: () => cancelFrame(passTimestamp),
        /**
         * If we're processing this frame we can use the
         * framelocked timestamp to keep things in sync.
         */
        now: () => (frameData.isProcessing ? frameData.timestamp : time.now()),
    }
}
 const frameloopDriverPixi: Driver = (update) => {
    const ticker = new Ticker();

    const passTimestamp = ({ deltaTime }: Ticker) => {
        // TODO: Convert deltaTime to timestamp
        const timestamp = deltaTime
        return update(timestamp)
    }

    return {
        start: (keepAlive = true) => ticker.add(passTimestamp, keepAlive),
        stop: () => ticker.remove(passTimestamp),
        /**
         * If we're processing this frame we can use the
         * framelocked timestamp to keep things in sync.
         */
        now: () => {
            // TODO: Convert deltaTime to timestamp
            const timestamp = ticker.deltaTime
            return timestamp
        },
    }
}
