'use strict'

window.angular.module('scegratooApp')
  .service('TreeNodeAttribute', (React, R) => {
    const {
      contains,
      curry,
      flatten,
      map,
      pipe,
      split,
      take
    } = R

    const splitVector = pipe(
      split(' '),
      map(split(',')),
      flatten
    )

    const deserializeVector = pipe(
      splitVector,
      map(Number.parseFloat),
      map(n => n.toFixed(2))
    )

    return React.createClass({
      displayName: 'TreeNodeAttribute',
      propTypes: {
        owner: React.PropTypes.object.isRequired,
        attribute: React.PropTypes.object.isRequired
      },
      getInitialState: function () {
        return {
          renderAttribute: true
        }
      },
      mapAttributeToHandler: function (name, value, index) {
        if (name === 'translation') {
          return curry(this.translationChanged)(value, index)
        } else if (name === 'rotation') {
          return curry(this.rotationChanged)(value, index)
        } else {
          throw new Error('Unknown attribute')
        }
      },
      clicked: function (event) {
        if (event.currentTarget.checked) {
          this.props.owner.render = true
        } else {
          this.props.owner.render = false
        }
      },
      focus: function (translation, event) {
        this.setState({
          renderAttribute: false,
          translation: this.props.owner.translation,
          rotation: this.props.owner.rotation
        })
      },
      blur: function (oldValue, index, event) {
        this.setState({renderAttribute: true})
      },
      translationChanged: function (oldValue, index, event) {
        const oldVector = deserializeVector(oldValue)
        oldVector[index] = event.currentTarget.value
        const newVector = take(3, oldVector).join(' ')

        this.props.owner.translation = newVector
        this.setState({
          translation: newVector
        })
      },
      rotationChanged: function (oldValue, index, event) {
        const oldVector = deserializeVector(oldValue)
        oldVector[index] = event.currentTarget.value
        const newVector = take(4, oldVector).join(' ')

        this.props.owner.rotation = newVector
        this.setState({
          rotation: newVector
        })
      },
      render: function () {
        const attribute = this.props.attribute

        console.log('render: ', this.state)

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
              {attribute.name}: {(this.state.renderAttribute ? deserializeVector(attribute.value) : this.state[attribute.name].split(' ')).map((coordinate, index) => <input
                type='text'
                value={coordinate}
                onFocus={this.focus}
                onBlur={this.blur}
                onChange={this.mapAttributeToHandler(attribute.name, attribute.value, index)}
                style={ {width: '50px'} }
              />)}
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
