(function () {
	// files
	var pathRoot = '/shared/footer/v1/';
	var cssFile =  pathRoot + 'footer.css';
	var htmlFile = pathRoot + 'footer.html';
	// create footer element inline where script is called from
	document.write('<footer id="jsonline-footer"></footer>');
	// inject stylesheet, assumes page already has fonts
	var stylesheet = document.createElement('link');
	stylesheet.href = cssFile;
	stylesheet.type = 'text/css';
	stylesheet.rel = 'stylesheet';
	document.getElementsByTagName('head')[0].appendChild(stylesheet);
	// template function to generate related links
	var TemplateEngine = function(html, options) {
		var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
		var add = function(line, js) {
			js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
				(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
			return add;
		}
		while(match = re.exec(html)) {
			add(html.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}
		add(html.substr(cursor, html.length - cursor));
		code += 'return r.join("");';
		return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
	}
	// inject footer html
	var xhr = new XMLHttpRequest();
	xhr.open('GET', htmlFile, true);
	xhr.onreadystatechange= function() {
		if (this.readyState!==4) return;
		if (this.status!==200) return;
		var template = this.responseText;
		var scriptTag = document.getElementById('footer-script');
		document.getElementById('jsonline-footer').innerHTML = TemplateEngine(template, {
			firstLink: scriptTag.getAttribute('data-first-link'),
			firstImage: scriptTag.getAttribute('data-first-image'),
			firstHeadline: scriptTag.getAttribute('data-first-headline'),
			firstDesc: scriptTag.getAttribute('data-first-desc'),
			secondLink: scriptTag.getAttribute('data-second-link'),
			secondImage: scriptTag.getAttribute('data-second-image'),
			secondHeadline: scriptTag.getAttribute('data-second-headline'),
			secondDesc: scriptTag.getAttribute('data-second-desc'),
			year: new Date().getFullYear()
		});
	};
	xhr.send();
})();