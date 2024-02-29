import React from 'react'
import { connect } from 'react-redux'
import { account, AccountState } from '../reducers/account'
import { symbol, Symbol } from '../reducers/symbol'
import { positions } from '../reducers/positions'
import { Text, Box } from 'ink'
import TextInput from 'ink-text-input'
import { nextTicker } from '../browser'

interface Props {
  accountState: AccountState
  symbol: Symbol
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

const Trade = (props: Props) => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const resetQuery = () => {
    setQuery('')
    setLoading(false)
  }

  const onSubmit = () => {
    if (!loading) {
      const [command, ...args] = query.split(" ")
  
      if (command === "b" || command === "s") {
        if (props.symbol.price) {
          let size = 1
          if (args.length == 0){
            size = parseFloat(props.accountState.balance.substring(1)) / parseFloat(props.symbol.price)
            size = Math.floor(size)
          }
          else
          {
            size = parseFloat(args[0].replace('k', '000'))
          }
          if (!isNaN(size)) {
            positions.addPosition(command === "b" ? "b" : "s", size, props.symbol)
          }
        }
        resetQuery()
      }
      else if (command === "c") {
        positions.closeAll()
        resetQuery()
      }
      else if (command === "reset") {
        account.reset()
        positions.reset()
        resetQuery()
      }
      else if (command === "view") {
        props.setViewMode(mode => !mode)
        resetQuery()
      }
      else if (command === "exit" || command == "quit"){
        process.exit(0)
      }
      else if (command === "") {
        setLoading(true)
  
        nextTicker()
          .finally(() => {
            resetQuery()
          })
          .catch(() => {})
      }
    }
  }

  return (
    <Box>
      <Box marginRight={1}>
        <Text>{loading ? 'Loading...' : 'Command:'}</Text>
      </Box>

      <TextInput value={query} onChange={setQuery} onSubmit={onSubmit} />
    </Box>
  )
}

const mapStateToProps = (state: any) => {
  return {
    symbol: symbol.mapState(state),
    accountState: account.mapState(state)
  }
}

export default connect(mapStateToProps)(Trade)
