require('./treenode')

import React from 'react'

function TreeView ($injector, TreeNode) {
  // const TreeNode = $injector.invoke(require('./treenode'))

  return React.createClass({
    displayName: 'TreeView',
    propTypes: {
      data: React.PropTypes.object.isRequired
    },
    getDefaultProps: () => ({
      data: {},
      runtime: {}
    }),
    render: function () {
      if (this.props.data.runtime) {
        return (
          <TreeNode
            data={this.props.data.querySelector('scene')}
            runtime={this.props.data.runtime}
          />
        )
      } else {
        return <div/>
      }
    }
  })
}

module.exports = exports = TreeView
window.angular.module('scegratooApp').service('TreeView', TreeView)
