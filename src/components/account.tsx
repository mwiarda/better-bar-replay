import React from 'react'
import Table from 'ink-table'
import { connect } from 'react-redux'
import { account, AccountState } from '../reducers/account'

interface Props {
  accountState: AccountState
}

const AccountComponent = (props: Props) => {
  return (
    <Table
      data={[
        {
          Cash: props.accountState.cash,
          Equities: props.accountState.equity,
          "P/L": props.accountState.pl,
          "P/L %": props.accountState.plPercent
        }
      ]}
    />
  )
}

const mapStateToProps = (state: any) => ({
  accountState: account.mapState(state)
})

export default connect(mapStateToProps)(AccountComponent)
