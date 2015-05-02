'use strict'

window.angular.module('scegratooApp')
  .service('TreeNode', function Project (React, R) {
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
    } = R
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

    return TreeNode
  })
