'use strict'

const React = window.React
const angular = window.angular
const {
  __,
  always,
  concat,
  curry,
  gt,
  identity,
  ifElse,
  isArrayLike,
  isNil,
  length,
  map,
  pipe,
  reduce,
  substringTo
} = window.R
const ifNil = ifElse(isNil)
const ensureArray = ifElse(isArrayLike, identity, always([]))
const shorten = curry((maxLength, string) => {
  return ifElse(
    pipe(
      length,
      gt(__, maxLength)
    ),
    pipe(
      substringTo(maxLength),
      concat(__, ' ...')
    ),
    always(string)
  )(string)
})

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
            return (
              <li ref='node'>
                <a data-id={this.props.data.id}>
                  {`${this.props.data.nodeName}:: ${reduce(
                    (o, a) => `${o} ${a.name}:"${shorten(20, a.value)}"`,
                    '',
                    ensureArray(this.props.data.attributes)
                  )}`}
                </a>
                <ul>
                  {ifNil(
                    always(undefined),
                    map(child => <TreeNode data={child}/>)
                  )(this.props.data.children)}
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
