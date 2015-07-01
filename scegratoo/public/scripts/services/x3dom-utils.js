'use strict'

window.angular.module('scegratooApp')
  .service('X3domUtils', function X3domutils ($window, $templateCache) {
    const angular = $window.angular
    const options = {
      useHitPnt: false,
      snapToGrid: false,
      x: '',
      y: '',
      z: ''
    }
    let inlines
    let translationGizmoX
    let translationGizmoY

    const processTranslationGizmoEventX = function (event) {
      let sensorToWorldMatrix
      let translationValue

      if (event.fieldName === 'translation_changed') {
        // convert the sensor's output from sensor coordinates to world coordinates (i.e., include its 'axisRotation')
        sensorToWorldMatrix = $window.x3dom.fields.SFMatrix4f.parseRotation(event.target.getAttribute('axisRotation'))

        translationValue = sensorToWorldMatrix.multMatrixVec(event.value)

        if (options.snapToGrid) {
          translationValue.x = Math.floor(translationValue.x)
        }

        angular.forEach(inlines, function (inline) {
          const oldTranslationValue = inline.parentNode.getFieldValue('translation')
          oldTranslationValue.x = translationValue.x
          inline.parentNode.setFieldValue('translation', oldTranslationValue)
        })
      }
    }

    const processTranslationGizmoEventY = function (event) {
      let sensorToWorldMatrix
      let translationValue

      if (event.fieldName === 'translation_changed') {
        // convert the sensor's output from sensor coordinates to world coordinates (i.e., include its 'axisRotation')
        sensorToWorldMatrix = $window.x3dom.fields.SFMatrix4f.parseRotation(event.target.getAttribute('axisRotation'))

        translationValue = sensorToWorldMatrix.multMatrixVec(event.value)

        if (options.snapToGrid) {
          translationValue.y = Math.floor(translationValue.y)
        }

        angular.forEach(inlines, function (inline) {
          const oldTranslationValue = inline.parentNode.getFieldValue('translation')
          oldTranslationValue.y = translationValue.y
          inline.parentNode.setFieldValue('translation', oldTranslationValue)
        })
      }
    }

    const setUp = function (x3dContainer) {
      // const x3dNode = x3dContainer.children().get(0)
      // let loadCount = 0
      console.debug('Set up scene.')

      // fix x3dom swallowing exceptions in callback
      $window.x3dom.debug.logException = function (e) {
        console.error(e.stack)
      }

      translationGizmoX = angular.element($templateCache.get('templates/planeSensor-X.html')).get(0)
      translationGizmoY = angular.element($templateCache.get('templates/planeSensor-Y.html')).get(0)

      inlines = x3dContainer.find('inline')

      $window.x3dom.reload()

      angular.forEach(x3dContainer.find('scene'), function (scene) {
        scene.appendChild(translationGizmoX)
        scene.appendChild(translationGizmoY)
      })

      translationGizmoX.children[0].addEventListener('onoutputchange', processTranslationGizmoEventX)
      translationGizmoY.children[0].addEventListener('onoutputchange', processTranslationGizmoEventY)
    }

    return {
      setUp: setUp
    }
  })
