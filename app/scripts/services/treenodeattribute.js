'use strict'

window.angular.module('scegratooApp')
  .service('TreeNodeAttribute', (React, R) => {
    const {
      contains,
      flatten,
      map,
      pipe,
      split
    } = R

    const deserializeVector = pipe(
      split(' '),
      map(split(',')),
      flatten,
      map(Number.parseFloat),
      map(n => n.toFixed(2))
    )

    return React.createClass({
      displayName: 'TreeNodeAttribute',
      propTypes: {
        owner: React.PropTypes.object.isRequired,
        attribute: React.PropTypes.object.isRequired
      },
      clicked: function (event) {
        if (event.currentTarget.checked) {
          this.props.owner.render = true
        } else {
          this.props.owner.render = false
        }
      },
      render: function () {
        const attribute = this.props.attribute

        if (attribute.name === 'render') {
          const checked = attribute.value === 'true'
          return (
            <span>
              {attribute.name}: <input type='checkbox' checked={checked} onClick={this.clicked} />
            </span>
          )
        } else if (contains(attribute.name, ['translation', 'rotation'])) {
          return (
            <span>
              {attribute.name}: {deserializeVector(attribute.value).map(coordinate => <input type='text' value={coordinate} style={ {width: '50px'} }/>)}
            </span>
          )
        } else {
          return (
            <span>
              {attribute.name}: {attribute.value}
            </span>
          )
        }
      }
    })
  })
