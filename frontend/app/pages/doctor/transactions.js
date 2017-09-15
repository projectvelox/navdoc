angular.module('doctorControllers')
    .controller('doctorTransactionsCtrl', function ($location, serverSv) {
        var transactions = this;
        transactions.loading = false;
        transactions.list = [];
        transactions.init = function () {
            transactions.loading = true;
            serverSv.request('/transaction/getall')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) throw data;
                    else transactions.list = data;
                    console.log(data);
                }).catch(function (err) {
                    $location.path('/');
                    throw  err;
                }).finally(function () {
                    transactions.loading = false;
                });
        };
        transactions.init();
    });