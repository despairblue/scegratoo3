import {
  __,
 map,
  filter,
  contains,
  pipe,
  prop,
  toLower
} from 'ramda'
import React from 'react'
import TreeNodeAttribute from './treenodeattribute'

export default React.createClass({
  propTypes: {
    node: React.PropTypes.object.isRequired
  },

  render: function () {
    const node = this.props.node

    return (
      <div style={{paddingLeft: '20px'}}>
        {map(
          a => <TreeNodeAttribute attribute={a} owner={node} />,
          filter(
            pipe(
              prop('name'),
              toLower,
              contains(__, [
                'def',
                'diffusecolor',
                'orientation',
                'position',
                'render',
                'rotation',
                'scale',
                'translation',
                'url'
              ])
            ),
            node.attributes
          )
        )}
      </div>
    )
  }
})
