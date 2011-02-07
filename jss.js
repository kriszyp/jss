define([], function(){
	return {
		parse: function(css, onRuleStart, onRuleEnd){
			var fullProperties;
			css.replace(/\/\*.*?\*\//g,'') // remove comments
				.replace(/\s*([^{;]+{)?\s*([^{}]+;)?\s*(})?/g, function(full, selector, properties, close){
				if(selector){
					onRuleStart(selector);
					fullProperties = "";
				}
				if(properties){
					fullProperties += properties;
				}
				if(close){
					onRuleClose(fullProperties);
				}
			});
		},
		apply: function(css, domNode, data){
			var currentFrame = {data: data};
			function Frame(){
				
			}
			var outputCss = [];
			var stack = [currentFrame];
			this.parse(css, function(selector){
				Frame.prototype = parentFrame = currentFrame; 
				var frame = currentFrame = new Frame();
				var element;
				stack.push(frame);
				if(selector.charAt(0) == "<"){
					// its an HTML layout element, separate HTML from selector
					var html = selector.match(/(.+?)(\s[^\s])?/);
					selector = html[1].substring(1);
					html = html[0];
					// insert HTML, with a marker to find target element
					parentFrame.element.innerHTML += html + '<span id="__jss_marker__" data-path="' + selector + '"></span>';
					parentFrame.laidout = true;
					element = parentFrame.element.getElementById("__jss_marker__");
					delete element.id;
				}
				if(selector.indexOf("/") > -1){
					// a data selector
					// drill down into the selected path
					var paths = selector.split("/");
					var target = parentFrame;
					for(var i = 0; i < paths.length; i++){
						target = target && (typeof target.get == "function" ? target.get(paths[i]) : target[paths[i]]);
					}
					if(!parentFrame.laidout && !parentFrame["child_" + selector]){
						parentFrame["child_" + selector] = frame;
						// set the new local variable/path
						frame[paths[0]] = target;
						if(!frame.element){
							element = parentFrame.element.appendChild(document.createElement("div"));
							element.setAttribute("data-path", selector);
						}
					}
				}else{
					// a regular CSS selector
					// TODO: split on commas
					frame.selector = parentFrame.selector + selector;
				}
				if(element){
					frame.selector = "span[data-path='" + selector + "']";
				}
				
			}, function(properties){
				outputCss.push(frame.selector + '{' + properties + ';}');
				if(!frame.laidout){
					var data = frame.data;
					for(var i in data){
						if(frame["child_" + i]){
							frame.element.appendChild(document.createElement("div"));
							
							
						}
						
					}
					frame.laidout = true;
				}
			});
			// TODO: create a style tag for the CSS
			outputCss
		}
	}
});