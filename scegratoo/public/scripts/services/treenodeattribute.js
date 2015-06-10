'use strict'

window.angular.module('scegratooApp')
  .service('TreeNodeAttribute', (React, R, TreeNodeAttributeTextbox) => {
    const {
      contains,
      flatten,
      map,
      pipe,
      split,
    } = R

    const splitVector = pipe(
      split(' '),
      map(split(',')),
      flatten
    )

    return React.createClass({
      displayName: 'TreeNodeAttribute',
      propTypes: {
        owner: React.PropTypes.object.isRequired,
        attribute: React.PropTypes.object.isRequired
      },
      changeHandler: function (event) {
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
              {attribute.name}: <input type='checkbox' checked={checked} onChange={this.changeHandler} />
            </span>
          )
        } else if (contains(attribute.name, ['translation', 'rotation', 'position', 'orientation'])) {
          return (
            <span>
              {attribute.name}: {splitVector(attribute.value).map((coordinate, index) =>
                <TreeNodeAttributeTextbox
                  attributeName={attribute.name}
                  index={index}
                  owner={this.props.owner}
                  style={{width: '100px'}}
                />
              )}
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
