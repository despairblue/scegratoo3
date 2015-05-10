'use strict'

window.angular.module('scegratooApp')
  .service('TreeNode', function Project (React, R) {
    const {
      __,
      always,
      concat,
      curry,
      eq,
      filter,
      contains,
      gt,
      ifElse,
      length,
      map,
      pipe,
      prop,
      substringTo,
      toLower
    } = R
    const unlessInline = ifElse(
      pipe(
        prop('nodeName'),
        toLower,
        eq('inline')
      ),
      always(undefined)
    )
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

    const TreeNode = React.createClass({
      displayName: 'TreeNode',
      propTypes: {
        data: React.PropTypes.object.isRequired,
        runtime: React.PropTypes.object.isRequired
      },
      clicked: function (event) {
        this.props.runtime.showObject(this.props.data, 'xAxis')
      },
      render: function () {
        return (
          <li ref='node'>
            <a data-id={this.props.data.id} onClick={this.clicked}>
              {`<${this.props.data.nodeName}>`}
              <br/>
              {map(
                a => [
                  `${a.name}: "${shorten(20, a.value)}"`,
                  <br/>
                ],
                filter(
                  pipe(
                    prop('name'),
                    toLower,
                    contains(__, ['translation', 'rotation', 'diffusecolor', 'def', 'render'])
                  ),
                  this.props.data.attributes
                )
              )}
            </a>
            {unlessInline(node =>
              <ul>
                {map(child =>
                  <TreeNode
                    data={child}
                    runtime={this.props.runtime}
                  />
                )(node.children)}
              </ul>
            )(this.props.data)}
          </li>
        )
      }
    })

    return TreeNode
  })
