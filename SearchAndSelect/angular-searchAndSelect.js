(function() {
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
                totalrecords: "="
            },
            templateUrl: 'search-and-select/template.html',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, elm, attr) {
            scope.showList = false;

            scope.selectItem = function (item) {
                scope.selecteditem = item;
                scope.showList = false;
            };

            scope.isActive = function (item) {
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

            elm.find(".dropdown").bind('scroll', function () {
                var currentItem = $(this);
                if (currentItem.scrollTop() + currentItem.innerHeight() >= currentItem[0].scrollHeight) {

                    if (!scope.pagenumber) scope.pagenumber = 2;
                    else
                        scope.pagenumber = scope.pagenumber + 1;

                    scope.onscroll({
                        searchKey: scope.searchKey,
                        pagenumber: scope.pagenumber
                    });
                }
            });
        }
    }

    runSearchSelect.$inject = ['$templateCache'];

    function runSearchSelect($templateCache) {
        $templateCache.put('search-and-select/template.html', template());

        function template() {
            return (
                '<div class="searchandselect" ng-class="{ active: showList }">\n'+
                    '<div class="header" ng-click="show()">\n'+
                        '<b>{{selecteditem[key]}}</b>\n' +
                        '<span class="pull-right glyphicon" ng:class="{true:\'glyphicon-chevron-up\', false:\'glyphicon-chevron-down\'}[showList]"></span>\n' +
                    '</div>\n' +
                    '<div class="search">\n' +
                        '<div class="input-group">\n' +
                            '<input type="text" ng-model="searchKey" class="form-control" placeholder="Type 3 characters to start search" ng-change="textChanged(searchKey)">\n' +
                            '<span class="input-group-btn">\n' +
                                '<button class="btn btn-default" type="button"><i class="glyphicon glyphicon-search"></i></button>\n' +
                            '</span>\n' +
                        '</div><!-- /input-group -->\n' +
                        '<div class="text-right nomargin nopadding"><small>Showing records 1 to {{values.length}} of {{totalrecords}}</small></div>\n' +
                    '</div>\n' +
                    '<ul class="dropdown">\n' +
                        '<li ng-repeat="item in values" ng-click="selectItem(item)" ng-if="values.length > 0">\n'+
                            '<span>{{item[key]}}</span>\n'+
                            '<i class="glyphicon glyphicon-ok" ng-show="isActive(item)"></i>\n'+
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






