'use strict';

Handlebars.registerHelper('lc', function(text) {
    return text ? text.toLowerCase() : '';
});

function generateCards( url, ids ) {
    if (!Promise) {
        alert('Use modern browser with Promise support http://caniuse.com/#search=promise');
        return;
    }

    var api = new RedmineAPI({ url: url });

    var issuesPromises = ids.map(function(id) {
        return api.getIssueById(id);
    } );

    var template = Handlebars.compile( $('#cards-template').html() );

    Promise.all(issuesPromises).then(function(issues) {
        var context = { issues: splitArray(issues,2) };
        var html = template(context);


        $('#cards').html(html);
    }).catch(console.error);
}


function splitArray(array, step) {
    var newArray = [];

    for (var i = 0; i < array.length; i+= step) {
        var newSubArray = [];

        for (var j = i; j < i+step; j++) {
            if (j>array.length) break;

            newSubArray.push(array[j]);
        };

        newArray.push(newSubArray);
    }

    return newArray;
}


function init() {
    $('#submit').click(function() {
        var url = $('#url').val();
        var ids = $('#ids').val();

        if (url && ids) {
            var ids = ids.split(/\s*,\s*/);
            generateCards(url, ids);
        }
    });
}

