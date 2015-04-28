'use strict'

const React = window.React
const angular = window.angular
const {
  map
} = window.R

angular.module('scegratooApp')
  .directive('treeview', function () {
    return {
      // template: '',
      restrict: 'AE',
      scope: {
        data: '=',
        id: '@'
      },
      link: function postLink (scope, element) {
        const TreeNode = React.createClass({
          displayName: 'TreeNode',
          getInitialState: function () {
            return {
              children: []
            }
          },
          render: function () {
            let children = []

            if (this.props.data.children) {
              children = this.props.data.children
            }

            return (
              <li ref='node'>
                <a data-id={this.props.data.id}>
                  {this.props.data.nodeName}
                </a>
                <ul>
                  {map(child => <TreeNode data={child}/>, children)}
                </ul>
              </li>
            )
          }
        })

        const TreeView = React.createClass({
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

        scope.$watch('data', function () {
          React.render(
            React.createElement(
              TreeView,
              {
                data: scope.data
              }
            ),
            element[0]
          )
        })
      }
    }
  })
