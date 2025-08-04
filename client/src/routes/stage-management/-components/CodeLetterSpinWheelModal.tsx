import { useState, useMemo, useEffect } from 'react'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const COLORS = [
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
]

export default function CodeLetterSpinWheelModal({
  chestNumber,
  maxCount,
  usedLetters,
  onContinue,
  onReset,
}: {
  chestNumber: number
  maxCount: number
  usedLetters: string[]
  onContinue?: (letter: string) => void
  onReset?: () => void
}) {
  const availableLetters = useMemo(
    () => LETTERS.filter((l) => !usedLetters.includes(l)).slice(0, maxCount),
    [usedLetters, maxCount]
  )
  const [selected, setSelected] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (spinning) {
      const spinDuration = 2000 // Longer for dramatic effect
      const spins = 4 // More rotations for realism
      const segmentAngle = 360 / availableLetters.length
      const randomIndex = Math.floor(Math.random() * availableLetters.length)
      const finalAngle = randomIndex * segmentAngle + spins * 360 + Math.random() * segmentAngle * 0.5
      setRotation(finalAngle)

      setTimeout(() => {
        setSelected(availableLetters[randomIndex])
        setSpinning(false)
      }, spinDuration)
    } else {
      setRotation(0)
    }
  }, [spinning, availableLetters])

  function spin() {
    if (!spinning && availableLetters.length > 0) {
      setSpinning(true)
      setSelected(null)
    }
  }

  return (
    <div className="p-8 flex flex-col items-center gap-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl max-w-lg mx-auto font-sans">
      <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
        Spin for Chest #{chestNumber}
      </h2>
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Pointer at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-600 z-10"></div>
        {/* Wheel */}
        <div
          className="absolute inset-0 transition-transform duration-2000 ease-[cubic-bezier(0.23, 1, 0.32, 1)]"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="rounded-full border-8 border-gray-700 w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-inner relative">
            {availableLetters.map((letter, idx) => {
              const angle = (idx / availableLetters.length) * 360
              const radius = 120
              return (
                <div
                  key={letter}
                  className={`absolute w-full h-full rounded-full overflow-hidden`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((Math.PI / availableLetters.length))}% ${50 - 50 * Math.sin((Math.PI / availableLetters.length))}%)`,
                  }}
                >
                  <div
                    className={`w-full h-full bg-gradient-to-r ${COLORS[idx % COLORS.length]} flex items-center justify-center`}
                  >
                    <div
                      className={`absolute flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl text-white shadow-md transition-all duration-300 ${
                        selected === letter ? 'scale-125 ring-4 ring-white' : ''
                      }`}
                      style={{
                        transform: `translate(${radius}px) rotate(-${angle}deg)`,
                      }}
                    >
                      {letter}
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-gray-600"></div>
          </div>
        </div>
        <button
          className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full shadow-lg text-lg font-semibold transition-all duration-200 transform ${
            spinning || availableLetters.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 hover:scale-105'
          }`}
          onClick={spin}
          disabled={spinning || availableLetters.length === 0}
        >
          {spinning ? 'Spinning...' : 'Spin'}
        </button>
      </div>
      {selected && (
        <div className="mt-6 text-xl font-semibold text-gray-800 animate-pulse">
          Selected Letter: <span className="font-extrabold text-red-600">{selected}</span>
        </div>
      )}
      <div className="flex gap-6 mt-8">
        <button
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200 ${
            spinning
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
          }`}
          onClick={() => {
            setSelected(null)
            setSpinning(false)
            setRotation(0)
            onReset?.()
          }}
          disabled={spinning}
        >
          Reset
        </button>
        <button
          className={`px-6 py-3 rounded-full text-lg font-semibold text-white transition-all duration-200 ${
            !selected
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-105'
          }`}
          onClick={() => selected && onContinue?.(selected)}
          disabled={!selected}
        >
          Continue
        </button>
      </div>
    </div>
  )
}