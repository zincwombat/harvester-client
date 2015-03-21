(function () {
    'use strict';

    var queueFactory=function() {

        var fixedQueue={};

        fixedQueue.init= function(size) {
            var queue = Array.apply(null, []);

            queue.fixedSize=size;

            queue.push = fixedQueue.push;
            queue.splice = fixedQueue.splice;
            queue.unshift = fixedQueue.unshift;

            // Trim any initial excess from the queue.
            fixedQueue.trimTail.call( queue );

            return(queue);
        };

        fixedQueue.trimHead = function(){

            // Check to see if any trimming needs to be performed.
            if (this.length <= this.fixedSize){

                // No trimming, return out.
                return;

            }

            // Trim whatever is beyond the fixed size.
            Array.prototype.splice.call(
                this,
                0,
                (this.length - this.fixedSize)
            );

        };

        fixedQueue.trimTail = function(){

            // Check to see if any trimming needs to be performed.
            if (this.length <= this.fixedSize){

                // No trimming, return out.
                return;

            }

            // Trim whatever is beyond the fixed size.
            Array.prototype.splice.call(
                this,
                this.fixedSize,
                (this.length - this.fixedSize)
            );

        };

        fixedQueue.wrapMethod = function( methodName, trimMethod ){

            // Create a wrapper that calls the given method.
            var wrapper = function(){

                // Get the native Array method.
                var method = Array.prototype[ methodName ];

                // Call the native method first.
                var result = method.apply( this, arguments );

                // Trim the queue now that it's been augmented.
                trimMethod.call( this );

                // Return the original value.
                return( result );

            };

            // Return the wrapper method.
            return( wrapper );

        };

        // Wrap the native methods.
        fixedQueue.push = fixedQueue.wrapMethod(
            "push",
            fixedQueue.trimHead
        );

        fixedQueue.splice = fixedQueue.wrapMethod(
            "splice",
            fixedQueue.trimTail
        );

        fixedQueue.unshift = fixedQueue.wrapMethod(
            "unshift",
            fixedQueue.trimTail
        );

        /* return the constructor function */
        return fixedQueue;
    };

    angular.module('harvesterApp').factory('queueFactory', queueFactory);
})();
