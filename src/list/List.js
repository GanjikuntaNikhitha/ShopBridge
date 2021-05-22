angular
  .module("latestDialogApp", ["ngMaterial", "ngMessages","ui.bootstrap"])

  .controller("AppController", function ($scope, $mdDialog, $http, $timeout) {
    $scope.TestString = "App Has been initialted";
    $scope.showAddItem = false;
    $scope.showAddItemModal = function (ev) {
      $scope.showAddItem = true;
      $scope.editInfo = {};
      $mdDialog.show({
        contentElement: "#myDialog",
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application to prevent interaction outside of dialog
        parent: angular.element(document.body),
        targetEvent: ev,
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

    var createRequest = function (method, url, data = null, id = null) {
      if (id) url = `${url}/${id}`;
      return new Promise((resolve, reject) => {
        $http({
          method: method,
          url: url,
          data,
          showLoader: true,
        }).then(
          ({ data }) => {
            console.log(method + " " + "data.....  " + JSON.stringify(data));
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
          console.log($scope.items);
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

    $scope.showEditModal = function (index) {
      $scope.editInfo = JSON.parse(JSON.stringify($scope.items[index]));
      $mdDialog.show({
        contentElement: "#myDialogEdit",
        parent: angular.element(document.body),
        clickOutsideToClose: true,
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
      createRequest("put", url, $scope.editInfo, $scope.editInfo.id).then(() => {
        $scope.hide();
        $scope.getItems();
      });
    };

    $scope.deleteItem = function (index) {
      $scope.editInfo = JSON.parse(JSON.stringify($scope.items[index]));
      createRequest("delete", url, $scope.editInfo, $scope.editInfo.id).then(() => {
        $scope.getItems();
      });
    };
    $scope.sort= function(keyname){
      console.log(keyname + "keyname..")
      $scope.sortKey = keyname;
      $scope.reverse= !$scope.reverse;
    }
  });
