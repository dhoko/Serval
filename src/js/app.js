/**
 * This is where all begins
 */
(function(win, doc, App){

    var swiftclick = SwiftClick.attach (doc.body);
    swiftclick.addNodeNamesToTrack (["a","button"]);

    var $doc = $(doc);

    $doc.ready(function() {
        App.Routers.Instances.router = new App.Routers.Router();
        Backbone.history.start();
    });

})(window, window.document, window.app || (window.app = {}));

