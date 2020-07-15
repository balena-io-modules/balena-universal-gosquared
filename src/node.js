const GoSquared = require('gosquared');

module.exports = function (gosquaredId, apiKey, _debug) {
	let goSquared;

	return {
		boot: function () {
			if (goSquared) {
				return;
			}
			goSquared = new GoSquared({
				api_key: apiKey,
				site_token: gosquaredId,
			});
		},
		anonLogin: function () {
			this.boot();
		},
		login: function (userId) {
			if (!goSquared) {
				this.boot();
			}

			goSquared = goSquared.createPerson(userId);
		},
		logout: function () {
			goSquared = null;
		},
		track: function (prefix, type, data) {
			// if called before `login` create an event without user attached.
			this.boot();
			return new Promise(function (resolve, reject) {
				// node sdk doesn't support pageviews so no conditional here.
				// https://www.gosquared.com/docs/api/tracking/pageview/node/
				goSquared.trackEvent(
					'[' + prefix + '] ' + type,
					data,
					(err, result) => {
						if (err) {
							return reject(err);
						}
						resolve(result);
					},
				);
			});
		},
	};
};
