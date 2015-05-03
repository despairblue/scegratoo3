'use strict'

window.angular.module('scegratooApp')
  .service('TreeView', function Project (React, TreeNode) {
    return React.createClass({
      displayName: 'TreeView',
      getDefaultProps: () => ({
        data: {},
        runtime: {}
      }),
      render: function () {
        return (
          <div>
            <ul>
              <TreeNode data={this.props.data.querySelector('scene')} runtime={this.props.data.runtime} />
            </ul>
          </div>
        )
      }
    })
  })
