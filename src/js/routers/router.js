// http://backbonejs.org/#Router
(function(win, doc, App){

  /**
   * Router
   * @type {object}
   */
  App.Routers.Router = Backbone.Router.extend({

    routes: {
      '': 'root',
      'home': 'home',
		'contactForm2': 'contactForm2',
			'contactForm': 'contactForm',
      '*path': 'redirect404' // ALWAYS MUST BE THE LAST ROUTE
    },

    /**
     * Router init
     * @return {void}
     */
    initialize: function() {},

    /**
     * Used before every action
     * @return {void}
     */
    before: function() {},

    /**
     * Used after every action
     * @return {void}
     */
    after: function() {},

    root: function() {
      this.before();

      App.Views.Instances.rootIndex = new App.Views.RootIndex();
      App.Views.Instances.rootIndex.render();

      this.after();
    },

    home: function() {
      this.before();

      App.Views.Instances.homeIndex = new App.Views.HomeIndex();
      App.Views.Instances.homeIndex.render();

      this.after();
    },

    contactForm: function() {
			this.before();

			App.Views.Instances.contactForm = new App.Views.ContactForm();
			App.Views.Instances.contactForm.render();

			this.after();
		},

		contactForm2: function() {
		this.before();

		App.Views.Instances.contactForm2 = new App.Views.ContactForm2();
		App.Views.Instances.contactForm2.render();

		this.after();
		},

		//==route==//

    /**
     * Used when a page isn't found
     * @return {void}
     */
    redirect404: function() {
      console.log('Oops, 404!');
    }

  });

})(window, window.document, window.app || (window.app = {}));
