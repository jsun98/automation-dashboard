import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import React, { Component } from 'react'
import $ from 'jquery'
import { Button } from 'semantic-ui-react'
import Moment from 'moment'
import ReactTable from 'react-table'


class BPG extends Component {
	constructor (props) {
		super(props)
		this.state = { loading: true }
	}

	fetchData () {
		$.get('/db/BPGByName/' + this.props.id)
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
		return <div>
			<ReactTable
				loading={ this.state.loading }
				data={ this.state.data }
				resizable={ this.props.tableStyle.resizable }
				className={ this.props.tableStyle.className }
				style={ this.props.tableStyle.style }
				defaultPageSize={10}
				columns = {
					[ {
						Header: () =>
							<div>
								<Button secondary content="back" icon='left arrow' labelPosition='left' style={{
									position: 'absolute',
									left: 0,
								}} onClick={() => {
									this.props.prev()
								}}/>
								<h1 style={{ margin: 0 }}>Business Process Group Details: {this.state.name}</h1>
							</div>,
						columns: [ {
							Header: 'Business Process Name',
							accessor: 'name',
							minWidth: 200,
							Cell: row => <a href='javascript:void(0)' onClick={e => {
								this.props.next(row.original._id)
							}}>{row.original._id}</a>,
						}, {
							Header: () => <div
								style={{
									width: '100%',
									height: '100%',
									backgroundColor: '#01FF70',
								}}>Pass</div>,
							accessor: 'pass',
							maxWidth: 100,
						}, {
							Header: () => <div
								style={{
									width: '100%',
									height: '100%',
									backgroundColor: '#FF4136',
								}}>Fail</div>,
							accessor: 'fail',
							maxWidth: 100,
						}, {
							Header: () => <div
								style={{
									width: '100%',
									height: '100%',
									backgroundColor: '#AAAAAA',
								}}>Skip</div>,
							accessor: 'skip',
							maxWidth: 100,
						}, {
							id: 'last_run_date',
							Header: 'Last Run',
							minWidth: 150,
							accessor: r => Moment(r.last_run_date).format('MMM Do, YYYY HH:mm:ss'),
						} ],
					} ]
				}
			/>
			<h1 style={{ textAlign: 'center' }}>Graph</h1>
			<ResponsiveContainer height={500}>
				<BarChart
					data={ this.state.data }
					maxBarSize={100}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<XAxis dataKey="_id"/>
					<YAxis/>
					<CartesianGrid strokeDasharray="3 3"/>
					<Tooltip/>
					<Legend />
					<Bar dataKey="pass" stackId="a" fill="#60BD68" />
					<Bar dataKey="fail" stackId="a" fill="#F15854" />
					<Bar dataKey="skip" stackId="a" fill="#AAAAAA" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	}
}


export default BPG
