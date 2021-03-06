require('../services/x3dom-utils')
require('../services/inline-list.js')
require('../services/project')
require('../services/moveable')
require('../services/moveables')
require('../services/x3dom')
require('../services/x3d-query')

import $ from 'jquery'
import Rx from 'rx'
import React from 'react'
import _ from 'lodash'
import {
  flatten,
  eq
} from 'ramda'

window.angular.module('scegratooApp')
  .directive('sgtX3d', function SgtX3d ($window, X3domUtils, $http, $q, $templateCache, InlineList, Project, Moveable, moveables, $routeParams, x3dom, x3dQuery, $injector) {
    const styles = {
      item: {
        padding: '5px',
        flex: '1'
      }
    }

    let TreeView = $injector.invoke(require('../services/treeview'))
    let colorCache
    let crossHairs

    const start = function (event) {
      const inline = $(event.hitObject).lastParent('inline')
      colorCache = inline.color()
      inline.color('yellow')
      inline.addClass('mousedown')

      // add crossHairs
      inline.get(0).parentNode.appendChild(crossHairs)

      Rx.Observable
        .fromEvent(document, 'mouseup')
        .take(1)
        .forEach(function stop (event) {
          inline.color(colorCache)
          inline.removeClass('mousedown')

          // remove the crosshair
          if (crossHairs.parentNode) {
            crossHairs.parentNode.removeChild(crossHairs)
          }
        })
    }

    const setUpInline = (inline, x3dNode) => {
      // add eventlisteners to make it selectable
      inline.addEventListener('mousedown', start)

      // keep a weak reference from the tranlation to the moveable around to
      // remove the event handlers the moveable registers on the translation
      // again if the translation is removed
      if (!moveables.has(inline)) {
        moveables.set(inline.parentNode, new Moveable(x3dNode,
          inline.parentNode, () => {}, 0, 'all'))
      }
    }

    return {
      restrict: 'AE',
      link: (scope, element, attrs) => {
        // load templates TODO: find better way than loading them manually
        var templates = [
          'templates/crosshair.html',
          'templates/planeSensor-X.html',
          'templates/planeSensor-Y.html'
        ]
        var promises = templates.map(value => $http.get(value, {cache: $templateCache}))

        $q.all(promises)
          .then(results => {
            // Normally this would be enough, but we want to make sure that the
            // cached value is only the template and not the whole response object
            // with status code, header, etc
            results.forEach(value => {
              $templateCache.put(value.config.url, value.data)
            })

            return Project.getInlines()
          })
          .then(({data: inlinesFromServer}) => {
            const div = $(document.createElement('div')).css(styles.item)
            const div2 = $(document.createElement('div')).css(styles.item)

            element.append(div)
            element.append(div2)

            crossHairs = window.angular.element($templateCache.get('templates/crosshair.html')).get(0)

            scope.$watch(attrs.content, content => {
              div.html(content)

              const x3dNode = div.children().get(0)
              const inlines = flatten(div.get(0).querySelectorAll('inline'))

              let sidebar = (
                <div>
                  <TreeView data={x3dNode} />
                  <InlineList inlines={inlinesFromServer} />
                </div>
              )

              const watchedAttributes = [
                'diffuseColor',
                'orientation',
                'position',
                'render',
                'rotation',
                'scale',
                'translation'
              ]

              const rerender = _.throttle(React.render, 100)
              const x3dObserver = new window.MutationObserver(mutations => {
                mutations.forEach(mutation => {
                  if (mutation.type === 'attributes') {
                    if (['style', 'class', 'width', 'height'].some(name => name === mutation.attributeName)) {

                    } else if (watchedAttributes.some(eq(mutation.attributeName))) {
                      rerender(sidebar, div2.get(0))
                    } else {
                      console.log(mutation.attributeName)
                    }
                  } else if (mutation.type === 'childList') {
                    flatten(mutation.addedNodes)
                      .filter(node => node.nodeName.toLowerCase() === 'transform')
                      .forEach(transform => {
                        let inline = transform.children[0]

                        if (inline && inline.nodeName.toLowerCase() === 'inline') {
                          let x3dNode = $(inline).firstParent('x3d').get(0)

                          setUpInline(inline, x3dNode)
                        }
                      })

                    rerender(sidebar, div2.get(0))
                  }
                })
              })

              if (module.hot) {
                module.hot.accept('../services/treeview', function () {
                  TreeView = $injector.invoke(require('../services/treeview'))
                  sidebar = (
                    <div>
                      <TreeView data={x3dNode} />
                      <InlineList inlines={inlinesFromServer} />
                    </div>
                  )
                  rerender(sidebar, div2.get(0))
                })
              }

              x3dObserver.observe(div.find('scene').get(0), {
                attributes: true,
                childList: true,
                subtree: true
              })

              // take care of the inlines already in the scene

              // rewrite all urls
              inlines.forEach(inline => {
                const url = inline.getAttribute('url')
                const project = $routeParams.project

                inline.setAttribute('url', `projects/${project}/src/${url}`)
              })

              // kick x3dom to init the runtime
              x3dom.reload()

              inlines.forEach(inline => setUpInline(inline, x3dNode))

              React.render(sidebar, div2.get(0))
              X3domUtils.setUp(div)
            })
          })
      }
    }
  })
