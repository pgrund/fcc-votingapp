'use strict';

(function () {

   var selectBox = document.querySelector('#options-select');
   var displayName = document.querySelector('#display-name');
   var voteButton = document.querySelector('.btn-vote');
   var apiUrl = appUrl + window.location.pathname;


   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (result) {

     console.log('pollControllerSingle.client, ajax ready');
      var data = JSON.parse(result)[0];

      console.log(displayName, selectBox);
      displayName.innerHTML = data.poll.description;
      displayName.setAttribute('data-id', data._id);

      selectBox.innerHTML = data.poll.options.map( o => `<option value="${o._id}" key="${o.key}">${o.name}</option>`).join('\n');
   }, true));

   voteButton.addEventListener('click', function () {

      var oid = selectBox.options[selectBox.selectedIndex].value;
      var pid = displayName.getAttribute('data-id');

      console.log(pid, oid);
      ajaxFunctions.ajaxRequest('POST', `/polls/${pid}/options/${oid}`, function (data) {
         console.log('success', data);
      });

   }, false);

})();
