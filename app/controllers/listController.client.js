'use strict';

$(function(){

  var container = $('ul.polls');

  $.get({
    url: '/polls',
    dataType: 'json'
  }, function(data) {
    data.forEach(item => {
      container.append(`<li class="poll col-sm-offset-3 col-sm-9 col-xs-12" data-id="${item._id}">` +
        `<a href="/polls/${item._id}" class="title">${item.poll.description}</a>` +
      `</li>`);
    });
  });

});
