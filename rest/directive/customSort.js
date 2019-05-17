app
    .directive("customSort", function () {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                sort: '='
            },
            template: '<a ng-click="sort_by(order)" style="color: #555555;cursor: pointer">    <span ng' +
                    '-transclude></span>    <i ng-class="selectedCls(order)"></i></a>',
            link: function (scope, elm, attr) {

                scope.order = attr.order

                // change sorting order
                scope.sort_by = function (newSortingOrder) {
                 
                    var sort = scope.sort;

                    if (sort.sortingOrder == newSortingOrder) {
                     
                        sort.reverse = !sort.reverse;
                    } else {
                        sort.sortingOrder = newSortingOrder;
                        sort.reverse = true;
                    }

                };

                scope.selectedCls = function (column) {
                    if (column == scope.sort.sortingOrder) {
                        return ('fa fa-' + ((scope.sort.reverse)
                            ? 'sort-asc'
                            : 'sort-desc'));
                    } else {
                        return 'fa fa-sort-desc'
                    }
                };
            } // end link fa fa-angle-down
        }
    });