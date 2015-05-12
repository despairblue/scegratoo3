'use strict'

window.angular.module('scegratooApp')
  .service('TreeNode', function Project (React, R, TreeNodeAttribute) {
    const {
      __,
      always,
      complement,
      contains,
      eq,
      filter,
      ifElse,
      map,
      pipe,
      prop,
      toLower
    } = R
    const isInline = pipe(
        prop('nodeName'),
        toLower,
        eq('inline')
    )
    const isGUI = pipe(
      prop('className'),
      toLower,
      eq('gui')
    )
    const unlessInline = ifElse(
      isInline,
      always(undefined)
    )

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
        const node = this.props.data
        const runtime = this.props.runtime
        const children = filter(complement(isGUI), node.children)

        return (
          <li ref='node'>
            <a data-id={node.id} onClick={this.clicked}>
              {`<${node.nodeName}>`}
              <br/>
            </a>
            {map(
              a => [
                <TreeNodeAttribute attribute={a} owner={node} />,
                <br/>
              ],
              filter(
                pipe(
                  prop('name'),
                  toLower,
                  contains(__, ['translation', 'rotation', 'diffusecolor', 'def', 'render', 'class'])
                ),
                node.attributes
              )
            )}
            {unlessInline(node =>
              <ul>
                {map(child =>
                  <TreeNode
                    data={child}
                    runtime={runtime}
                  />
                )(children)}
              </ul>
            )(node)}
          </li>
        )
      }
    })

    return TreeNode
  })
