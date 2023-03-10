define(['angular', 'components/shared/index'], function (angular) {
	// create the angular app and include this module and the powerschool module
	var myApp = angular.module('myApp', ['powerSchoolModule'])

	// creates the controller for the html page
	myApp.controller('myController', function ($scope, $http, $window) {
		// initial values of variables used in this controller
		$scope.isLoading = false
		$scope.duplicatesData = []
		$scope.matchName = true
		$scope.matchCell = false
		$scope.matchEmail = false
		$scope.matchStreet = false

		$scope.getDuplicates = function () {
			$scope.isLoading = true

			// calls the powerquery to get the list of duplicate contacts based on "matchOn" array value
			// "matchOn" must have at least one selected criteria
			var url = '/ws/schema/query/net.cdolinc.contacts.duplicates.list?pagesize=0'
			var payload = { params: $scope.matchOn }
			$http.post(url, payload, { headers: { 'Content-Type': 'application/json' } }).then(
				function (json) {
					if (json.data.record === undefined) {
						$scope.duplicatesData = []
					} else {
						$scope.duplicatesData = json.data.record
						if ($scope.duplicatesData.length > 0) {
							$j('#dupContactSpan').text($scope.duplicatesData.length)
						} else {
							$j('#dupLi').hide()
						}
					}
					$scope.isLoading = false
				},
				function () {
					// error loading PowerQuery .. what to do?
					console.log('error loading powerquery')
				}
			)
		}

		$scope.selectContacts = function (ids) {
			// sends the selected contacts to PS, the opens the consolidatecontacts.html page

			url = '/ws/contacts/selectedContactIds'
			var payload = ids.split(',')
			// calls the API
			$http.post(url, payload, { headers: { 'Content-Type': 'application/json' } }).then(
				function (response) {
					// no response expected unless error ... redirect to consolidatecontacts.html
					// $window.location.href = '/admin/contacts/consolidatecontacts.html';
					$window.open('/admin/contacts/consolidatecontacts.html', '_blank')
				},
				function () {
					// error, if any .. what to do?
				}
			)
		}

		$scope.updateMatch = function () {
			$scope.matchOn = []
			if ($scope.matchName) $scope.matchOn.push('N')
			if ($scope.matchCell) $scope.matchOn.push('P')
			if ($scope.matchEmail) $scope.matchOn.push('E')
			if ($scope.matchStreet) $scope.matchOn.push('S')
			// console.log($scope.matchOn, $scope.matchOn.length);
			$scope.getDuplicates()
		}

		// on start up
		$scope.updateMatch()
	})
})
