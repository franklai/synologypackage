Ext.ns('com.blogspot.fujirou2.QuickTimePlayer');

com.blogspot.fujirou2.QuickTimePlayer.launchFn = function (param) {
	var path = param[0].get("path");

	// path is
	// /volume1/video/ELECTRIC FIRE 2007~Tribute to BASARA & MYLENE~.avi

	SYNO.SDS.AppLaunch('com.blogspot.fujirou2.QuickTimePlayer.Application', {
		fb_recs: param
	});
};

com.blogspot.fujirou2.QuickTimePlayer.Application = Ext.extend(SYNO.SDS.AppInstance, {
	appWindowName: "com.blogspot.fujirou2.QuickTimePlayer.MainWindow",
	constructor: function (cfg) {
		com.blogspot.fujirou2.QuickTimePlayer.Application.superclass.constructor.apply(this, arguments);
	}
});

com.blogspot.fujirou2.QuickTimePlayer.MainWindow = Ext.extend(SYNO.SDS.AppWindow, {
	constructor: function (cfg) {
		config = this.getConfig(cfg);
		com.blogspot.fujirou2.QuickTimePlayer.MainWindow.superclass.constructor.call(this, config);
	},
	getConfig: function (cfg) {
		var config,
			divxHtml;

		divxHtml = 'show me the money';

		config = {
			width: 600,
			height: 500,
			border: false,
			layout: 'fit',
			items: [{
				itemId: 'main',
				html: divxHtml
			}]
		};

		return config;
	},
	bin2hex: function(bin) {

	},
	getMain: function () {
		return this.get('main');
	},
	getDownloadLink: function (path) {
		var fileName,
			sid;

		sid = Ext.util.Cookies.get('id');
		fileName = 'hello.' + path.substr(path.lastIndexOf('.'));
		return String.format(
			'/fbdownload/{0}?sid={1}&mime=1&dlink={2}',
			encodeURIComponent(fileName),
			encodeURIComponent(sid),
			SYNO.SDS.VideoPlayer.Util.bin2hex(path)
		)
	},
	getHtml: function(file_id) {
		var divxHtml,
			template,
			dlLink;

		dlLink = String.format(
			'{0}//{1}{2}',
			location.protocol,
			location.host,
			SYNO.SDS.VideoPlayer.Util.getDownloadLink(file_id)
		);

		template = [
			'<object classid="clsid:67DABFBF-D0AB-41fa-9C46-CC0F21721616"',
			' codebase="http://go.divx.com/plugin/DivXBrowserPlugin.cab"',
			' width="100%" height="100%">',
				'<param name="src" value="{0}"/>',
				'<param name="wmode" value="transparent"/>',

				'<embed type="video/divx" src="{0}"',
				' width="100%" height="100%"',
				' wmode="transparent"',
				'pluginspage="http://go.divx.com/plugin/download/">',
				'</embed>',
			'</object>'
		].join('');
		divxHtml = String.format(template, dlLink);

		return divxHtml;
	},
	playVideo: function (path, file_id) {
		this.getMain().update(this.getHtml(file_id));
	},
	onOpen: function () {
		com.blogspot.fujirou2.QuickTimePlayer.MainWindow.superclass.onOpen.apply(this, arguments);
		return this.onRequest.apply(this, arguments);
	},
	onRequest: function (param) {
		var rec;

		com.blogspot.fujirou2.QuickTimePlayer.MainWindow.superclass.onRequest.apply(this, arguments);

		if (param && param.path) {
			this.playVideo(a.path, a.file_id);
			return;
		}
		if (param  && param.fb_recs && param.fb_recs[0]) {
			rec = param.fb_recs[0];

			this.playVideo(rec.get('path'), rec.get('file_id'));
		}
	}
});

