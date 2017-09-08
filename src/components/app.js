import 'babel-polyfill'
import React, { Component } from 'react'
import BP from './BP'
import BPG from './BPG'
import BPGList from './BPGList'
import ReactDOM from 'react-dom'
import TC from './TC'

class App extends Component {
	constructor (props) {
		super(props)
		this.state = {
			screenIndex: 0,
			id: [],
		}
		this.nextScreen = this.nextScreen.bind(this)
		this.prevScreen = this.prevScreen.bind(this)
	}

	nextScreen (id) {
		this.setState({
			id: this.state.id.concat([ id ]),
			screenIndex: this.state.screenIndex + 1,
		})
	}

	prevScreen () {
		var temp = this.state.id.slice(0, this.state.id.length - 1)
		this.setState({
			id: temp,
			screenIndex: this.state.screenIndex - 1,
		})
	}

	render () {
		const tableStyle = {
			resizable: true,
			className: '-highlight -striped',
			style: {
				textAlign: 'center',
				fontSize: '1rem',
			},
		}
		if (this.state.screenIndex === 0)
			return <BPGList next={this.nextScreen} tableStyle={tableStyle} />
		else if (this.state.screenIndex === 1)
			return <BPG next={this.nextScreen} prev={this.prevScreen} id={this.state.id[this.state.id.length - 1]} tableStyle={tableStyle} />
		else if (this.state.screenIndex === 2)
			return <BP next={this.nextScreen} prev={this.prevScreen} id={this.state.id[this.state.id.length - 1]} tableStyle={tableStyle} />
		return <TC prev={this.prevScreen} id={this.state.id[this.state.id.length - 1]} tableStyle={tableStyle} />
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
)
