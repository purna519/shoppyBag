import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null, info: null }
  }

  componentDidCatch(error, info){
    console.error('ErrorBoundary caught', error, info)
    this.setState({ error, info })
  }

  render(){
    if(this.state.error){
      return (
        <div style={{padding:40}}>
          <h2 style={{color:'#b00020'}}>An error occurred</h2>
          <p style={{color:'#333'}}>{String(this.state.error && this.state.error.message)}</p>
          <details style={{whiteSpace:'pre-wrap'}}>
            {this.state.info?.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
