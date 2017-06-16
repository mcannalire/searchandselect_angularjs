﻿(function() {
   'use strict'
    angular
        .module('angular-search-and-select', [])
        .run(runSearchSelect)
        .directive('searchAndSelect', searchAndSelect);

    searchAndSelect.$inject = ['$rootScope'];

    function searchAndSelect($rootScope) {
        var directive = {
            replace: true,
            restrict: 'E',
            scope: {
                values: "=",
                selecteditem: "=",
                key: "@",
                onscroll: "&",
                totalrecords: "=",
                selectCallBack: '&',
            },
            templateUrl: 'search-and-select/template.html',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, elm, attr) {
            scope.showList = false;

            scope.selectItem = function (item) {
                scope.selecteditem = item;
                scope.selectCallBack(item); 
                scope.showList = false;
            };
          

            scope.isActive = function (item) {
               if(!item || !scope.selecteditem) return;

                return item[scope.key] === scope.selecteditem[scope.key];
            };

            scope.textChanged = function (searchKey) {
                if (searchKey.length === 0 || searchKey.length > 2) {
                    scope.onscroll({
                        searchKey: searchKey,
                        pagenumber: 1
                    });
                }
            };

            scope.show = function () {
                scope.showList = !scope.showList;
            };

            $rootScope.$on("documentClicked", function (inner, target) {

                var isSearchBox = ($(target[0]).is(".searchandselect")) || ($(target[0]).parents(".searchandselect").length > 0);

                if (!isSearchBox)
                    scope.$apply(function () {
                        scope.showList = false;
                    });
            });
            var dropdown = elm.find("ul"),
            scrollable = true;
            dropdown.bind('scroll', onScroll);

            function onScroll() {
               //  var currentItem = $(this);
                if (dropdown[0].scrollTop >= dropdown[0].scrollHeight/2 && scrollable) {
                   scrollable = false;
                    if (!scope.pagenumber) scope.pagenumber = 2;
                    else
                        scope.pagenumber = scope.pagenumber + 1;

                    var data = {
                        searchKey: scope.searchKey,
                        pagenumber: scope.pagenumber
                    };

                    var defer = scope.onscroll(data);

                    if(defer.then) {
                       defer.then(function() {
                          dropdown[0].scrollTop -= 100;
                          scrollable = true;
                       });
                       // if function returned true
                    } else if(defer) {
                       dropdown[0].scrollTop -= 100;
                       scrollable = true;
                    }
                }
            }
        }
    }

    runSearchSelect.$inject = ['$templateCache'];

    function runSearchSelect($templateCache) {
        $templateCache.put('search-and-select/template.html', template());

        function template() {
            return (
                '<div class="searchandselect ui-select-bootstrap" ng-class="{ active: showList }">\n'+
                    '<div class="header" ng-click="show()">\n'+
                        '{{selecteditem[key]}}\n' +
                        '<span class="pull-right caret"></span>\n' +
                    '</div>\n' +
                    '<ul class="dropdown dropdown-menu">\n' +
                        '<li ng-repeat="item in values" class="menu-item" ng-click="selectItem(item)" ng-if="values.length > 0">\n'+
                            '<div class="inner-menu-item"><span class="ui-select-label" ng-class="isActive(item) ? \'active\' : \'\'">{{item[key]}}</span></div>\n'+
                        '</li>\n'+
                        '<li ng-if="values.length == 0">\n'+
                            'No Records\n' +
                        '</li>\n' +
                    '</ul>\n' +
                '</div>\n'
            );
        }
    }
})();

module.exports = 'angular-search-and-select';
