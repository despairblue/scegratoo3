import React from 'react'
import {
  flatten,
  map,
  mergeAll,
  pipe,
  split
} from 'ramda'

const splitVector = pipe(
  split(' '),
  map(split(',')),
  flatten
)

export default React.createClass({
  displayName: 'TreeNodeAttributeTextbox',
  propTypes: {
    attributeName: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    owner: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  },
  handleChangeEvent: function (event) {
    const {attributeName, index, owner} = this.props
    const oldVector = splitVector(owner.getAttribute(attributeName))

    oldVector[index] = event.currentTarget.value
    owner.setAttribute(attributeName, oldVector.join(' '))

    this.forceUpdate()
  },
  render: function () {
    const {owner, index, attributeName} = this.props

    return (
      <input
        type='number'
        step='0.1'
        value={splitVector(owner.getAttribute(attributeName))[index]}
        onChange={this.handleChangeEvent}
        onMouseEnter={() => this.getDOMNode().focus()}
        style={mergeAll([
          {
            width: '50px',
            padding: '0px',
            margin: '1px'
          },
          this.props.style
        ])}
      />
    )
  }
})
