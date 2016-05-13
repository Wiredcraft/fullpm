import React from 'react'
import Sortable from 'sortablejs'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import 'normalize.css/normalize.css'
import 'styles/app.scss'
import 'styles/main.scss'
import Column from 'components/Column'
import { fetchIssues } from 'actions'

export class AppComponent extends React.Component {
  componentWillMount () {
    const { fetchIssues } = this.props
    fetchIssues()
  }

  componentDidMount () {
    Sortable.create(this.refs.list, {
      group: 'columns',
      ghostClass: 'columnGhost',
      handle: '.drag-handle',
      animation: 150
    })
  }

  render() {
    const { sortedArr } = this.props

    return (
      <div className='AppComponent'>
        <div ref='list' className='board-area'>
          {
            sortedArr.map((d, i) => {
              return (
                <Column key={ i } id={ d.id } title={ d.name } issues={ d.issues } />
              )
            })
          }
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchIssues }, dispatch)
}

function parserTickets(tickets) {
  return [
    { id: 1, name: 'Backlog', issues: tickets.filter(d => d.column === 'backlog') },
    { id: 2, name: 'Doing', issues: [] },
    { id: 3, name: 'Done', issues: [] }
  ]
}

function mapStateToProps(state) {
  return {
    sortedArr: parserTickets(state.issues.get('tickets'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent)
