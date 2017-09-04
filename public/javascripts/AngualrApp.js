var app = angular.module("flapperNews", ["ui.router"]);

app.controller(
    "MainCtrl",[
    "$scope",
    "posts",
    function ($scope,posts) {
        $scope.test = "Hello world";
        $scope.posts = posts.posts;
        $scope.incrementUpvotes = function (post) {
            post.upvotes += 1;
        };
        $scope.addPost = function () {
            if (!$scope.title || $scope.title === "") {
                return;
            }
            $scope.posts.push({
                title:$scope.title,
                link:$scope.link,
                upvotes:0,
                comments:[
                    {author:"Joe",body:"Cool post!",upvotes:0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });
            $scope.title="";
            $scope.link="";
        };
    }
    ]);
app.controller(
    "PostsCtrl",[
        "$scope",
        "$stateParams",
        "posts",
        function ($scope,$stateParams,posts) {
            $scope.post = posts.posts[$stateParams.id];
            $scope.addComment= function () {
                if($scope.body===""){ return;}
                posts.addComment(post._id, {
                    body: $scope.body,
                    author: 'user',
                }).success(function(comment) {
                    $scope.post.comments.push(comment);
                });
                $scope.body="";
            };
            $scope.incrementUpvotes = function (comment) {
                posts.upvoteComment(post, comment);
            };
        }
    ]);

app.factory('posts', ['$http',function(){
    var o = {
        posts: [{title: 'post 1', upvotes: 5}, {title: 'post 2', upvotes: 2}, {title: 'post 3', upvotes: 15}, {title: 'post 4', upvotes: 9}, {title: 'post 5', upvotes: 4} ]
    };
    o.getAll = function() {
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };
    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function(data){
                post.upvotes += 1;
            });
    };
    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };
    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };
    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
            .success(function(data){
                comment.upvotes += 1;
            });
    };
    return o;
}]);
// app.factory("posts",[function () {
//     var o = {
//         posts:[
//             {title: 'post 1', link:"#", upvotes: 5,comments:[]},
//             {title: 'post 2', link:"#", upvotes: 2,comments:[]},
//             {title: 'post 3', link:"#", upvotes: 15,comments:[]},
//             {title: 'post 4', link:"#", upvotes: 9,comments:[]},
//             {title: 'post 5', link:"#", upvotes: 4,comments:[]}
//         ]
//     };
//     return o;
// }]);

app.config([
    "$stateProvider",
    "$urlRouterProvider",
    function ($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state("posts",{
                url:"/posts/{id}",
                templateUrl:"/posts.html",
                controller:"PostsCtrl",
                resolve: {
                    postPromise: ['posts', function(posts){
                        return posts.getAll();
                    }]
                }
            })
            .state("home",{
                url:"/home",
                templateUrl:"/home.html",
                controller:"MainCtrl",
                resolve:{
                    postPromise:["post",function (posts) {
                        return posts.getAll();
                    }]
                }
            });
        $urlRouterProvider.otherwise("home");
    }
]);