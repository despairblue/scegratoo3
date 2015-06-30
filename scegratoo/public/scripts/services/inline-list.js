'use strict'

window.angular.module('scegratooApp')
  .service('InlineList', function InlineList (React, Project, $routeParams) {
    return React.createClass({
      displayName: 'InlineList',

      getInitialState: function () {
        return {
          collapsed: false,
          // these are necessary because the browser fires the dragEnter and dragLeave events interleaved:
          //   dragEnter, dragEnter, dragLeave, dragLeave
          // thus making it necessary to keep track of the number of enters and leaves (or at least two of them)
          // thanks to dragster for this idea (https://github.com/bensmithett/dragster/blob/gh-pages/src/dragster.coffee)
          dragEntered1: false,
          dragEntered2: false
        }
      },

      propTypes: {
        inlines: React.PropTypes.array.isRequired
      },

      dragStart: function (event, index) {
        this.getDOMNode().style.opacity = 0.4
        event.dataTransfer.setData('text/plain', this.props.inlines[index].url)
      },

      dragEnd: function (event) {
        this.getDOMNode().style.opacity = 1
      },

      render: function render () {
        return (
          <ul>
            {
              this.props.inlines.map((inline, index) => <li>
                <a
                  draggable='true'
                  onDragStart={event => this.dragStart(event, index)}
                  onDragEnd={this.dragEnd}
                >
                  {inline.name}
                </a>
              </li>)
            }
          </ul>
        )
      }
    })
  })
