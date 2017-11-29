import React, { Component } from 'react'
import $ from 'jquery'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import ReactTable from 'react-table'

// this class renders the BP details page, details see BPG.js and TC.js
class BP extends Component {
	constructor (props) {
		super(props)
		this.state = { loading: true }
	}

	fetchData () {
		$.get('/db/BPByBPandBPG/' + this.props.bpName + '/' + this.props.bpgName)
			.done(data => {
				this.setState({
					name: this.props.id,
					data,
					loading: false,
				})
			})
	}

	componentDidMount () {
		this.fetchData()
	}
	render () {
		return <ReactTable
			loading={ this.state.loading }
			data={ this.state.data }
			resizable={ this.props.tableStyle.resizable }
			className={ this.props.tableStyle.className }
			style={ this.props.tableStyle.style }
			defaultPageSize={10}
			columns={
				[ {
					Header: () =>
						<div>
							<Button secondary content="back" icon='left arrow' labelPosition='left' style={{
								position: 'absolute',
								left: 0,
							}} onClick={() => {
								this.props.prev()
							}}/>
							<h1 style={{ margin: 0 }}>Business Process Details: {this.state.name}</h1>
						</div>,
					columns: [ {
						Header: 'Test Case Name',
						accessor: 'name',
						minWidth: 200,
						Cell: row => <Link to={this.props.next + '/' + row.original._id}>{row.original._id}</Link>,
					}, {
						Header: 'Status',
						accessor: 'status',
						maxWidth: 100,
						Cell: cell => {
							let style = {}
							if (cell.original.status === 'pass')
								style = { background: '#60BD68' }
							else if (cell.original.status === 'fail')
								style = { background: '#F15854' }
							else if (cell.original.status === 'skip')
								style = { background: '#AAAAAA' }
							return <div style={ style }>
								{cell.original.status}
							</div>
						},
					}, {
						id: 'last_run_date',
						Header: 'Last Run',
						minWidth: 150,
						accessor: r => Moment(r.last_run_date).format('MMM Do, YYYY HH:mm:ss'),
					}, {
						Header: 'Jenkins Job',
						accessor: 'job',
						maxWidth: 100,
						Cell: row => row.original.job ? <a target='_blank' href={row.original.job}>Link</a> : '',
					} ],
				} ]
			}
		/>
	}
}


export default BP
