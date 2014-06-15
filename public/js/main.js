'use strict';

Handlebars.registerHelper('lc', function(text) {
    return text ? text.toLowerCase() : '';
});

function generateCards() {
    var url      = $('#url').val();
    var ids      = $('#ids').val().split(/\s*,\s*/).filter(function(id) {return id.match(/^\d+$/)});
    var template = Handlebars.compile( $('#cards-template').html() );

    if (!url || !ids.length) {
        alert('Check fields');
        return;
    }

    prepareTemplateData(url, ids).then(function(data) {
        $('#cards').html( template(data) );
    });
}

function init() {
    $('#submit').click(generateCards);
}

function prepareTemplateData(url, ids) {
    var api = new RedmineAPI({ url: url });

    var issuesPromises = ids.map(function(id) {
        return api.getIssueById(id);
    } );

    return Promise.all(issuesPromises).then(function(issues) {
        return { issues: splitArray(issues,2) };
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