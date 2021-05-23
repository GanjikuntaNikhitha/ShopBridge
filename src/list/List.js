angular
  .module("latestDialogApp", ["ngMaterial", "ngMessages", "ui.bootstrap"])

  .controller("AppController", function ($scope, $mdDialog, $http, $timeout, $filter) {
    $scope.TestString = "App Has been initialted";
    $scope.showAddItem = false;
    $scope.showAddItemModal = function (ev) {
      $scope.showAddItem = true;
      let itemsLength = ($scope.items.length-1)
      let lastItem = $scope.items[itemsLength]
      $scope.items
      $scope.editInfo = {id:(lastItem.id+1)};
      $mdDialog.show({
        contentElement: "#myDialog",
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application to prevent interaction outside of dialog
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
      });
    };
    $scope.itemId;

    $scope.showEditModal = function (item) {
      $scope.itemId = item.id
      $scope.editInfo = JSON.parse(JSON.stringify($scope.items[($scope.itemId-1)]));
      $mdDialog.show({
        contentElement: "#myDialogEdit",
        parent: angular.element(document.body),
        clickOutsideToClose: true,
      });
    };

  

    $scope.showDeleteModal = function (item) {
      console.log('index....'+item.id)
      $scope.itemId = item.id
      $scope.modalMode = 'delete';
      $mdDialog.show({
        contentElement: "#myDialogDelete",
        parent: angular.element(document.body),
        clickOutsideToClose: true,
      });
    };

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    const url = "http://localhost:3000/items";

    var createRequest = function (method, url, data, id) {
      if (id) url = `${url}/${id}`;
      return new Promise((resolve, reject) => {
        $http({
          method: method,
          url: url,
          data,
          showLoader: true,
        }).then(
          ({ data }) => {
            resolve(data);
          },
          (err) => {
            console.log(
              method + " " + "data.Error.....  " + JSON.stringify(err)
            );
            errorMessage(err);
            reject(err);
          }
        );
      });
    };

    const errorMessage = (error) => {
      if (error.data.includes("Insert failed, duplicate id")) {
        let id = error.config.data.id;
        $scope.errorMsg = `Item with Id ${id} already exists`;
        $timeout(() => {
          delete $scope.errorMsg;
        }, 6000);
      }
    };

    $scope.getItems = function () {
      createRequest("get", url).then((data) => {
        $timeout(() => {
          $scope.items = data;
        });
      });
    };

    $scope.getItems();

    $scope.addItem = function () {
      createRequest("post", url, $scope.editInfo).then(() => {
        $scope.hide();
        $scope.getItems();
      });
    };

    $scope.isNumber = function (evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    };

    $scope.editItem = function () {
      createRequest("put", url, $scope.editInfo, $scope.itemId).then(() => {
        $scope.hide();
        $scope.getItems();
      });
    };

    $scope.deleteItem = function () {
      createRequest("delete", url,undefined ,$scope.itemId).then(() => {
        $scope.hide();
        $scope.getItems();
      });
    };

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname;
      $scope.reverse = !$scope.reverse;
    }

    $scope.currentPage = 0;
    $scope.pageSize = 7;
    $scope.q = '';

    $scope.getData = function () {
      return $filter('filter')($scope.items, $scope.q)
    }

    $scope.numberOfPages = function () {
      if (!$scope.getData() || !$scope.getData().length) { return; }
      return Math.ceil($scope.getData().length / $scope.pageSize);
    }

  }).filter('startFrom', function () {
    return function (input, start) {
      if (!input || !input.length) { return; }
      start = +start;
      return input.slice(start);
    }
  });
