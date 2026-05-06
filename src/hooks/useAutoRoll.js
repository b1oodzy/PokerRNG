import { useRef, useState, useCallback, useEffect } from 'react'
 
export const FLIP_MS        = 250
export const MANUAL_LOCK_MS = 1000
export const AUTO_MS        = 2000
 
const POLL_MS = 50
 
let audioCtx = null
 
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}
 
function startSilentTone() {
  const ctx  = getAudioCtx()
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = 1
  gain.gain.value     = 0.00001
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  return () => {
    try { osc.stop(); osc.disconnect(); gain.disconnect() } catch {}
  }
}
 
export function useAutoRoll(rollFn) {
  const [autoRolling, setAutoRolling] = useState(false)
  const stopToneRef  = useRef(null)
  const intervalRef  = useRef(null)
  const lockUntilRef = useRef(0)
 
  const isLocked = () => Date.now() < lockUntilRef.current
 
  const tryRoll = useCallback(() => {
    if (isLocked()) return false
    lockUntilRef.current = Date.now() + MANUAL_LOCK_MS
    rollFn(false)
    return true
  }, [rollFn])
 
  const startAuto = useCallback(() => {
    if (autoRolling) return
    // Set the lock immediately — first roll fires when it naturally expires,
    // preventing toggle spam from bypassing the cooldown
    if (!isLocked()) {
      lockUntilRef.current = Date.now() + AUTO_MS
    }
    setAutoRolling(true)
    stopToneRef.current = startSilentTone()
 
    intervalRef.current = setInterval(() => {
      if (!isLocked()) {
        lockUntilRef.current = Date.now() + AUTO_MS
        rollFn(true)
      }
    }, POLL_MS)
  }, [autoRolling, rollFn])
 
  const stopAuto = useCallback(() => {
    setAutoRolling(false)
    clearInterval(intervalRef.current)
    // Deliberately do NOT clear lockUntilRef here —
    // the cooldown keeps running so re-enabling immediately gains nothing
    if (stopToneRef.current) { stopToneRef.current(); stopToneRef.current = null }
  }, [])
 
  const toggleAuto = useCallback(() => {
    autoRolling ? stopAuto() : startAuto()
  }, [autoRolling, startAuto, stopAuto])
 
  useEffect(() => () => {
    clearInterval(intervalRef.current)
    if (stopToneRef.current) stopToneRef.current()
  }, [])
 
  return { autoRolling, toggleAuto, tryRoll }
}