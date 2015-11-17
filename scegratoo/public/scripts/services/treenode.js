require('./project')
require('./moveables')
require('./x3d')

const {
  FileReader
} = window

import angular from 'angular'
import React from 'react'
import {
  eq,
  flatten,
  mergeAll,
  complement,
  pipe,
  filter,
  map,
  prop,
  toLower,
  mapObjIndexed
} from 'ramda'
import TreeNodeAttributeList from './treenodeattributelist'

const isSelected = pipe(
  prop('className'),
  toLower,
  eq('mousedown')
)

const bulletStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  fontSize: '20px',
  color: '#fff',
  lineHeight: '100px',
  textAlign: 'center',
  background: '#000',
  marginRight: '5px',
  cursor: 'pointer'
}

const collapsedStyle = {
  background: '#d9d9d9'
}

const removeStyle = {
  color: 'red',
  marginLeft: '10px',
  marginRight: '10px'
}

const syncStyle = {
  color: 'blue'
}

const selected = {
  background: 'rgb(249, 247, 90)'
}

const isGUI = pipe(
  prop('className'),
  toLower,
  eq('gui')
)

const setAttributes = node => mapObjIndexed((value, key) => node.setAttribute(key, value))
const attachCustomAttributes = options => node => {
  if (node) {
    setAttributes(node.getDOMNode())(options)
  }
}

const renderChildren = (node, TreeNode, runtime, children) => {
  if (node.nodeName.toLowerCase() !== 'inline') {
    return (
      <ol>
        {map(child =>
          <TreeNode
            data={child}
            runtime={runtime}
            />
        )(children)}
      </ol>
    )
  }
}

function TreeNode (Project, moveables, X3D) {
  let viewPointPosition
  let viewPointOrientation

  const TreeNode = React.createClass({
    displayName: 'TreeNode',

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
      data: React.PropTypes.object.isRequired,
      runtime: React.PropTypes.object.isRequired
    },

    componentDidMount: function () {
      const node = this.props.data

      if (node.nodeName.toLowerCase() === 'viewpoint') {
        node.addEventListener('viewpointChanged', event => {
          viewPointPosition = event.position
          viewPointOrientation = event.orientation
        })
      }
    },

    clicked: function (event) {
      this.props.runtime.showObject(this.props.data, 'xAxis')
    },

    toggleVisibility: function (event) {
      const element = event.currentTarget.parentNode.nextSibling

      if (this.state.collapsed) {
        element.style.display = ''
        this.setState({
          collapsed: false
        })
      } else {
        element.style.display = 'none'
        this.setState({
          collapsed: true
        })
      }
    },

    syncViewpoint: function (event) {
      const node = this.props.data

      node.setAttribute('orientation', `${viewPointOrientation[0].toString()} ${viewPointOrientation[1]}`)
      node.setAttribute('position', viewPointPosition.toString())
    },

    dragStart: function (event) {
      this.getDOMNode().style.opacity = 0.4
      event.node = this.props.data
    },

    dragEnd: function (event) {
      this.getDOMNode().style.opacity = 1
    },

    drop: function (event) {
      const node = event.node
      event.node = undefined

      event.stopPropagation() // Stops some browsers from redirecting.
      event.preventDefault()

      if (node && !node.contains(this.props.data)) {
        node.parentElement.removeChild(node)
        this.props.data.appendChild(node)
      } else if (event.dataTransfer.files.length > 0) {
        const files = flatten(event.dataTransfer.files) // turn into real array

        files.forEach(file => {
          const reader = new FileReader()

          reader.onload = event => {
            Project
              .uploadFile(file.name, event.target.result)
              .catch(() => window.alert('Upload failed.'))
              .then((result) => {
                this.props.data.appendChild(X3D.renderJSX(
                  <transform>
                    <inline ref={attachCustomAttributes({
                      url: result.data,
                      namespacename: file.name
                    })}/>
                  </transform>
                ))
              })
          }
          reader.readAsText(file)
        })
      } else if (event.dataTransfer.items.length > 0) {
        const url = event.dataTransfer.getData('text/plain')

        this.props.data.appendChild(X3D.renderJSX(
          <transform>
            <inline ref={attachCustomAttributes({
              url,
              namespacename: url
            })}/>
          </transform>
        ))
      }
      this.getDOMNode().style.background = ''
    },

    dragEnter: function (event) {
      if (this.state.dragEntered1) {
        this.state.dragEntered2 = true
      } else {
        this.state.dragEntered1 = true
        this.getDOMNode().style.background = 'rgb(203, 169, 198)'
      }
    },

    dragLeave: function (event) {
      if (this.state.dragEntered2) {
        this.state.dragEntered2 = false
      } else {
        this.state.dragEntered1 = false
        this.getDOMNode().style.background = ''
      }
    },

    dragOver: function (event) {
      // enables the drop event at all, whoever thought of that api -.-
      event.preventDefault()
    },

    remove: function (event) {
      // detach the event handlers the moveable registered on the translation
      if (moveables.has(this.props.data)) {
        moveables.get(this.props.data).detachHandlers()
      }

      this.props.data.parentElement.removeChild(this.props.data)
    },

    render: function () {
      const node = this.props.data
      const runtime = this.props.runtime
      const collapsed = this.state.collapsed
      const children = filter(complement(isGUI), node.children)
      const divStyle = isSelected(node) ? selected : undefined

      return (
        <li ref='node' style={mergeAll([
          {listStyle: 'none'},
          divStyle
        ])}>
          <div style={{display: 'flex'}} >
            <div
              onClick={this.toggleVisibility}
              style={mergeAll([
                bulletStyle,
                collapsed && collapsedStyle
              ])}
            />

            <a
              draggable='true'
              data-id={node.id}
              onClick={this.clicked}
              onDragStart={this.dragStart}
              onDragEnd={this.dragEnd}
              onDragEnter={this.dragEnter}
              onDragLeave={this.dragLeave}
              onDragOver={this.dragOver}
              onDrop={this.drop}
            >
              {`<${node.nodeName}>`}
            </a>

            {(node.nodeName.toLowerCase() !== 'scene') && <a
              onClick={this.remove}
              style={removeStyle} >
              X
            </a>}

            {(node.nodeName.toLowerCase() === 'viewpoint') && <a
              onClick={this.syncViewpoint}
              style={syncStyle}>
              Sync
            </a>}
          </div>

          <div>
            <TreeNodeAttributeList node={node}/>
            {renderChildren(node, TreeNode, runtime, children)}
          </div>
        </li>
      )
    }
  })

  return TreeNode
}

module.exports = exports = TreeNode
angular.module('scegratooApp') .service('TreeNode', TreeNode)
