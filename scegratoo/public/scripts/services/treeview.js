'use strict'

window.angular.module('scegratooApp')
  .service('TreeView', function Project (React, TreeNode) {
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
  })
