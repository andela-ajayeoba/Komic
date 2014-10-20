'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'komic';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'angularFileUpload'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('komics');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);  // .run(['$rootScope', function($rootScope){
     // 	$rootScope.$on('$stateChangeSuccess',function(){
     // 		("html, body").animate({ scrollTop: 0 }, 200);
     // 	});
     // }]);
'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('komics').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Komics', 'komics', 'dropdown', '/komics(/create)?');
    Menus.addSubMenuItem('topbar', 'komics', 'List Komics', 'komics');
    Menus.addSubMenuItem('topbar', 'komics', 'New Komic', 'komics/create');
  }
]);'use strict';
//Setting up route
angular.module('komics').config([
  '$stateProvider',
  function ($stateProvider) {
    // Komics state routing
    $stateProvider.state('listKomics', {
      url: '/komics',
      templateUrl: 'modules/komics/views/list-komics.client.view.html'
    }).state('createKomic', {
      url: '/komics/create',
      templateUrl: 'modules/komics/views/create-komic.client.view.html'
    }).state('viewKomic', {
      url: '/komics/:komicId',
      templateUrl: 'modules/komics/views/view-komic.client.view.html'
    }).state('editKomic', {
      url: '/komics/:komicId/edit',
      templateUrl: 'modules/komics/views/edit-komic.client.view.html'
    }).state('searchKomic', {
      url: '/search_page/:genre',
      templateUrl: 'modules/komics/views/search-komic.client.view.html'
    });
  }
]);'use strict';
// Komics controller
angular.module('komics').controller('KomicsController', [
  '$scope',
  '$stateParams',
  '$location',
  '$upload',
  '$timeout',
  '$http',
  'Authentication',
  'Komics',
  'Reviews',
  function ($scope, $stateParams, $location, $upload, $timeout, $http, Authentication, Komics, Reviews) {
    $scope.authentication = Authentication;
    $scope.review_state = false;
    $scope.review_list_state = false;
    $scope.loading = false;
    //function to upload comic images
    $scope.onFileSelect = function ($files) {
      $scope.files = $files;
      $scope.imageFiles = [];
      $scope.uploadResult = [];
      if ($scope.files) {
        for (var i in $scope.files) {
          if ($scope.files[i].type === 'image/jpeg' || $scope.files[i].type === 'image/png' || $scope.files[i].size < 600000) {
            $scope.correctFormat = true;
          } else {
            alert('error');
            alert('Wrong file format...');
            $scope.correctFormat = false;
          }
          $scope.start(i);
        }
      }
    };
    $scope.start = function (indexOftheFile) {
      $scope.loading = true;
      var formData = {
          key: $scope.files[indexOftheFile].name,
          AWSAccessKeyID: 'AKIAJQYBMDUWZVLR6ZGA',
          acl: 'private',
          policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtvbWljYnVja2V0In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9',
          signature: 'CNs+4S/Ms5sCgbITIksXcyHBgas=',
          filename: $scope.files[indexOftheFile].name,
          'Content-Type': $scope.files[indexOftheFile].type
        };
      $scope.imageFiles[indexOftheFile] = $upload.upload({
        url: 'https://komicbucket.s3-us-west-2.amazonaws.com/',
        method: 'POST',
        headers: { 'Content-Type': $scope.files[indexOftheFile].type },
        data: formData,
        file: $scope.files[indexOftheFile]
      });
      $scope.imageFiles[indexOftheFile].then(function (response) {
        $timeout(function () {
          $scope.loading = false;
          //alert('uploaded');
          var imageUrl = 'https://komicbucket.s3-us-west-2.amazonaws.com/' + $scope.files[indexOftheFile].name;
          $scope.uploadResult.push(imageUrl);
        });
      }, function (response) {
        console.log(response);
        $scope.loading = false;
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        alert('Connection Timed out');
      }, function (evt) {
      });
      console.log($scope.imageFiles[indexOftheFile]);
      $scope.imageFiles[indexOftheFile].xhr(function (xhr) {
      });
    };
    // Create new Komic
    $scope.create = function () {
      // Create new Komic object
      var komic = new Komics({
          title: this.title,
          description: this.description,
          genre: this.genre,
          images: $scope.uploadResult
        });
      komic.$save(function (response) {
        $location.path('komics/' + response._id);
        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.genre = '';
        $scope.images = [];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Add Review to Komic
    $scope.addReview = function () {
      var review = new Reviews({
          komicId: $scope.komic._id,
          rating: this.rating,
          review: this.review,
          name: this.name
        });
      $scope.komic.reviews.push({
        review: this.review,
        rating: this.rating,
        name: this.name,
        user: Authentication.user.displayName,
        created: Date.now()
      });
      review.$save(function (response) {
        $scope.komic = response;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      //$scope.review_state = false;
      $scope.review = '';
      $scope.rating = '';
      $scope.name = '';
    };
    // Remove Review from Komic
    $scope.removeReview = function (rev) {
      var review = new Reviews({
          komicId: $scope.komic._id,
          _id: rev._id
        });
      review.$remove(function (response) {
        for (var i in $scope.komic.reviews) {
          if ($scope.komic.reviews[i] === rev) {
            $scope.komic.reviews.splice(i, 1);
          }
        }
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Komic
    $scope.remove = function (komic) {
      if (komic) {
        console.log(komic);
        komic.$remove();
        for (var i in $scope.komics) {
          if ($scope.komics[i] === komic) {
            $scope.komics.splice(i, 1);
          }
        }
      } else {
        console.log($scope.komic);
        $scope.komic.$remove(function () {
          $location.path('komics');
        });
      }
    };
    // Update existing Komic
    $scope.update = function () {
      var komic = $scope.komic;
      komic.$update(function () {
        $location.path('komics/' + komic._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Komics
    $scope.find = function () {
      $scope.komics = Komics.query();
    };
    // Find existing Komic
    // $scope.findOne = function() {
    // 	$scope.komic = Komics.get({ 
    // 		komicId: $stateParams.komicId
    // 	});
    // };
    $scope.next = function (nextvallue) {
      if (nextvallue < $scope.komic.images.length) {
        $scope.imageindex++;
      }
    };
    $scope.prev = function (nextvallue) {
      if (nextvallue > 0) {
        $scope.imageindex--;
      } else
        $scope.imageindex = 0;
    };
    $scope.imageindex = 0;
    // $scope.prevPageDisabled = function() {
    //     return $scope.imageindex === 0 ? 'disabled' : '';
    //  };
    // $scope.nextPageDisabled = function() {
    //     return $scope.currentPage === $scope.pageCount() ? 'disabled' : '';
    // };
    $scope.findOne = function () {
      $http.get('komics/' + $stateParams.komicId).success(function (response) {
        $scope.komic = response;
      });
    };
    $scope.load_komic_by_genre = function () {
      $http.get($stateParams.genre).success(function (response) {
        $scope.komic_result = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.show_review = function () {
      $scope.review_state = !$scope.review_state;
    };
    $scope.show_review_list = function () {
      $scope.review_list_state = !$scope.review_list_state;
    };  // $scope.show_review_list = function() {
        // 	for (var i in $scope.komic.reviews) 
        // };
  }
]).config(function ($sceProvider) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects.
  $sceProvider.enabled(false);
});'use strict';
//Komics service used to communicate Komics REST endpoints
angular.module('komics').factory('Komics', [
  '$resource',
  function ($resource) {
    return $resource('komics/:komicId', { komicId: '@_id' }, { update: { method: 'PUT' } });
  }
]).factory('Reviews', [
  '$resource',
  function ($resource) {
    return $resource('komics/:komicId/reviews/:id', {
      komicId: '@komicId',
      reviewId: '@_id'
    }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);