import pod from 'redux-pods'
import { symbol, Symbol } from './symbol'

let ticker = 1

export interface Position {
  id: number
  type: 'b' | 's'
  size: number
  open: string
  current: string
  pl: string
  plPercent: string
  closed: boolean
}

export const positions = pod<Position[]>([])
  .track(symbol, (symbolState) => (positions) => {
    positions.forEach((position) => {
      if (position.closed === false) {
        resolvePosition(symbolState, position)
      }
    })
  })
  .on({
    addPosition: (type: 'b' | 's', size: number, symbolState: Symbol) => (positions) => {
      const position = {
        id: ++ticker,
        type,
        size,
        open: type === 'b' ? symbolState.buy : symbolState.sell,
        current: '',
        pl: '',
        plPercent: '',
        closed: false,
      }

      resolvePosition(symbolState, position)
      positions.push(position)
    },

    closePosition: (id: number) => (positions) => {
      if (id === undefined) {
        const openPositions = positions.filter(({ closed }) => !closed)
        
        if (openPositions.length === 1) {
          openPositions[0].closed = true
        }
      } else {
        const position = positions.find((position) => position.id === id)
  
        if (position) {
          position.closed = true
        }
      }
    },

    closeAll: () => (positions) => {
      positions.forEach((position) => {
        position.closed = true
      })
    },

    reset: () => () => []
  })

const resolvePosition = (symbolState: Symbol, position: Position) => {
  const current = position.type === 'b' 
    ? symbolState.sell 
    : symbolState.buy
  const pips = position.type === 'b' 
    ? (parseFloat(current) - parseFloat(position.open))
    : (parseFloat(position.open) - parseFloat(current))
  const pl = pips * position.size
  const prefix = pips > 0 ? '+' : ''
  const plPercent = pips/parseFloat(position.open)*100
  
  position.current = current
  position.pl = `${prefix}$${pl.toFixed(2)}`
  position.plPercent = `${(plPercent).toFixed(2)} %`
}
