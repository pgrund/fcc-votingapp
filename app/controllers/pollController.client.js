'use strict';
var polls = [];
(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var selectBox = document.querySelector('#options-select');
   var displayName = document.querySelector('#display-name');

   var pollsList = document.querySelector('#polls-list');
   var apiUrl = appUrl + '/polls';


   function createPollList( data ) {
     polls = JSON.parse(data);
     var subElement = '';
     polls.forEach(poll => {
      subElement += '<div class="poll" title="' +poll._id+ '">'+
        '<h2>' + poll.poll.description + '</h2>'+
        '<a href="/polls/'+poll._id+'">change</a>'+
      '</div>';
     });
     pollsList.innerHTML = subElement;
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
     console.log('pollController.client, ajax ready');
     createPollList(data);
   }));

   addButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function () {


      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);


})();
