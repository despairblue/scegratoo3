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
      mergeAll,
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

    let viewPointPosition
    let viewPointOrientation

    const TreeNode = React.createClass({
      displayName: 'TreeNode',
      getInitialState: function () {
        return {
          collapsed: false
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
      render: function () {
        const node = this.props.data
        const runtime = this.props.runtime
        const children = filter(complement(isGUI), node.children)
        const collapsed = this.state.collapsed

        return (
          <div>
            <li ref='node' style={{listStyle: 'none'}}>
              <div
                style={{display: 'flex'}}
              >
                <div
                  onClick={this.toggleVisibility}
                  style={mergeAll([
                    bulletStyle,
                    collapsed && collapsedStyle
                  ])}
                />
                <a data-id={node.id} onClick={this.clicked}>
                  {`<${node.nodeName}>`}
                </a>
                {(nodeName => {
                  if (nodeName.toLowerCase() === 'viewpoint') {
                    return (<button onClick={this.syncViewpoint}>Sync</button>)
                  }
                })(node.nodeName)}
                <br/>
              </div>
              <div style={{paddingLeft: '20px'}}>
                {map(
                  a => [
                    <TreeNodeAttribute attribute={a} owner={node} />,
                    <br/>
                  ],
                  filter(
                    pipe(
                      prop('name'),
                      toLower,
                      contains(__, [
                        'class',
                        'def',
                        'diffusecolor',
                        'orientation',
                        'position',
                        'render',
                        'rotation',
                        'translation'
                      ])
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
              </div>
            </li>
          </div>
        )
      }
    })

    return TreeNode
  })
