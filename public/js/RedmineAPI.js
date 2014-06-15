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
                return new Promise(function(resolve, reject) {
                    if (issue.parent) {
                        console.log('LOAD PARENT %s', issue.parent.id);

                        self._fetchIssue(issue.parent.id).then(function(parentIssue) {
                            issue.parent = parentIssue;
                            resolve(issue);
                        }).catch(reject);
                    } else {
                        resolve(issue);
                    }
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

