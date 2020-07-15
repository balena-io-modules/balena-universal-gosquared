require('../vendor/gs-loader');

const TRACKER_NAME = 'resinAnalytics';

module.exports = function (gosquaredId, _apiKey, debug) {
	let loggedIn = false;
	let booted = false;

	return {
		boot: function () {
			if (booted) {
				return;
			}
			// automatically track pageviews in debug mode
			window._gs(gosquaredId, TRACKER_NAME, debug);
			// switch on tracking on local host in debug mode
			window._gs(TRACKER_NAME + '.set', 'trackLocal', debug);
			booted = true;
		},
		anonLogin: function () {
			this.boot();
		},
		login: function (userId) {
			if (!userId) {
				throw new Error('userId required call .login');
			}
			if (!booted) {
				this.boot();
			}

			window._gs(TRACKER_NAME + '.identify', {
				id: userId,
			});

			loggedIn = true;
		},
		logout: function () {
			if (booted && loggedIn) {
				window._gs(TRACKER_NAME + '.unidentify');
				loggedIn = false;
			}
		},
		track: function (prefix, type, data) {
			this.boot();
			if (type === 'Page Visit') {
				window._gs(
					TRACKER_NAME + '.track',
					data.url || window.location.pathname,
				);
			} else {
				window._gs(TRACKER_NAME + '.event', '[' + prefix + '] ' + type, data);
			}
			return Promise.resolve();
		},
	};
};
