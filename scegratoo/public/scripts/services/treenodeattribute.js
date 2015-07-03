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

    const TreeNodeAttribute = React.createClass({
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
            <div style={styles.container}>
              <div style={styles.title}>
                {attribute.name}:
              </div>
              <div style={styles.item}>
                <input type='checkbox' checked={checked} onChange={this.changeHandler} />
              </div>
            </div>
          )
        } else if (contains(attribute.name, ['translation', 'rotation', 'position', 'orientation', 'scale'])) {
          return (
            <div style={styles.container}>
              <div style={styles.title}>
                {attribute.name}:
              </div>
              {splitVector(attribute.value).map((coordinate, index) =>
                <TreeNodeAttributeTextbox
                  attributeName={attribute.name}
                  index={index}
                  owner={this.props.owner}
                  style={styles.item}
                />
              )}
            </div>
          )
        } else {
          return (
            <div style={styles.container}>
              <div style={styles.title}>
                {attribute.name}:
              </div>
              <div style={styles.item}>
                {attribute.value}
              </div>
            </div>
          )
        }
      }
    })

    const styles = {
      container: {
        display: 'flex',
        alignItems: 'stretch'
      },
      item: {
        width: '',
        flexGrow: '1'
      },
      title: {
        width: '100px'
      }
    }

    return TreeNodeAttribute
  })
