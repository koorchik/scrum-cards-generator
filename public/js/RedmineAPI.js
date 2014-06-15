var RedmineAPI = (function() {
    'use strict';

    function RedmineAPI(args) {
        if (!args.url) throw "url required";

        this.url = args.url;
    }

    RedmineAPI.prototype = {
        getIssueById: function(id) {
            var self = this;
            if (!id) return;

            return this._fetchIssue(id).then(function(issue) {
                if (!issue.parent) return issue;

                return self._fetchIssue(issue.parent.id).then(function(parentIssue) {
                    issue.parent = parentIssue;
                    return issue;
                });
            });
        },

        _fetchIssue: function(id) {
            var url  = this.url + '/issues/' + id + '.json?include=children';
            console.log('FETCHING %s FROM %s', id, url);

            return Promise.resolve( $.ajax({
                url: url,
                jsonp: "callback",
                dataType: "jsonp"
            })).then(function(res) {
                return res.issue;
            });
        }
    };

    return RedmineAPI;
})();

