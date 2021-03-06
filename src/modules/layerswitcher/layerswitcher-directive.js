angular.module('anol.layerswitcher')

/**
 * @ngdoc directive
 * @name anol.layerswitcher.directive:anolLayerswitcher
 *
 * @restrict A
 * @requires anol.map.LayersService
 *
 * @param {string=} anolLayerswitcher If containing "open" layerswitcher initial state is expanded. Otherweise it is collapsed.
 *
 * @description
 * Shows/hides background- and overlaylayer
 */
.directive('anolLayerswitcher', ['LayersService', function(LayersService) {
    return {
        restrict: 'A',
        require: '?^anolMap',
        transclude: true,
        templateUrl: 'src/modules/layerswitcher/templates/layerswitcher.html',
        scope: {
            anolLayerswitcher: '@anolLayerswitcher'
        },
        link: {
            pre: function(scope, element, attrs, AnolMapController) {
                scope.collapsed = false;
                scope.showToggle = false;

                scope.backgroundLayers = LayersService.backgroundLayers;
                var overlayLayers = [];
                angular.forEach(LayersService.overlayLayers, function(layer) {
                    if(layer.get('displayInLayerswitcher') !== false) {
                        overlayLayers.push(layer);
                    }
                });
                scope.overlayLayers = overlayLayers;

                if(angular.isDefined(AnolMapController)) {
                    scope.collapsed = scope.anolLayerswitcher !== 'open';
                    scope.showToggle = true;
                    element.addClass('ol-unselectable');
                    AnolMapController.getMap().addControl(
                        new ol.control.Control({
                            element: element.first().context
                        })
                    );
                }
            },
            post: function(scope, element, attrs) {
                angular.forEach(scope.backgroundLayers, function(layer) {
                    if(layer.getVisible() === true && scope.backgroundLayer === undefined) {
                        scope.backgroundLayer = layer;
                        scope.backgroundLayer.setVisible(false);
                    } else {
                        layer.setVisible(false);
                    }
                });
                scope.$watch('backgroundLayer', function(newVal, oldVal) {
                    oldVal.setVisible(false);
                    newVal.setVisible(true);
                });
            }
        }
    };
}]);
