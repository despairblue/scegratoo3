'use strict'

window.angular.module('scegratooApp')
  .service('InlineList', function InlineList (React, Project, $routeParams) {
    return React.createClass({
      displayName: 'InlineList',

      propTypes: {
        inlines: React.PropTypes.array.isRequired
      },

      render: function render () {
        return (
          <ul>
            {this.props.inlines.map(inline => <li>{inline.name}</li>)}
          </ul>
        )
      }
    })
  })
