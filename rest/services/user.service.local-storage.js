(function () {
    'use strict';

    app.factory('UserService', UserService);

    UserService.$inject = ['$timeout', '$filter', '$q', '$http', '$rootScope', 'globalService'];
    function UserService($timeout, $filter, $q, $http, $rootScope, globalService) {

        var service = {};

        $rootScope.isAuthenticated = false;
        

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getUsers());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), {id: id});
            var user = filtered.length
                ? filtered[0]
                : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function GetByUsername(username, password) {
            

            var deferred = $q.defer();
            var filtered = getUsers(username, password);           
            deferred.resolve(filtered);   
         
            return deferred.promise;

        }

        function Create(user) {
            var deferred = $q.defer();

            var header = {
                'Content-Type': 'application/json'
            }
            return globalService.globalServiceAPI("POST", "user/Register", user,header)
        
        }

        function Update(user) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function getUsers(username, password) {

            var dataValue = {
                grant_type: 'password',
                username: username,
                password: password
            }
            var deferred = $q.defer();
            var requestForLogin = {
                method: 'POST',
                credentials: 'include',
                cache: 'no-cache',
                url: $rootScope.baseUrl+'user/LoginUser',
            
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(dataValue)
            }
            $http(requestForLogin).then(function (response) {
           
                $rootScope.isAuthenticated = true;
               
                sessionStorage.isAuthenticated = $rootScope.isAuthenticated;
                deferred.resolve({success: true});
                return true, response;

            }, function (response) {
            
                deferred.resolve({success: false});
                return false;

            });
            deferred.resolve({success: true});
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }
    }
})();
