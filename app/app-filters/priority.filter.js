angular.module('app')
    .filter('toPriorityText', function(){
        return function(input){
            switch (input) {
                case 1:
                    return 'Critical';
                case 2:
                    return 'High';
                case 3:
                    return 'Average';
                case 4:
                    return 'Low';
            }
        }
    });