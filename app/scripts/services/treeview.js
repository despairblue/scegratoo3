'use strict'

window.angular.module('scegratooApp')
  .service('TreeView', function Project (React, TreeNode) {
    return React.createClass({
      displayName: 'TreeView',
      getDefaultProps: () => ({data: {}}),
      getInitialState: () => ({data: {}}),
      render: function () {
        return (
          <div>
            <ul>
              <TreeNode data={this.props.data} />
            </ul>
          </div>
        )
      }
    })
  })
