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
			var currentFrame = {};
			var stack = [currentFrame];
			this.parse(css, function(selector){
				parentFrame = currentFrame; 
				var frame = currentFrame = {};
				stack.push(frame);
				if(selector.charAt(0) == "/"){
					frame.data = data[selector.substring(1)];
				}
				var tag = selector.match(/<([^>]+)>/);
				if(tag){
					var spaceIndex = tag.indexOf(" ");
					if(spaceIndex > -1){
						var elementProperties = {};
						tag.replace(/ ([\w-]+)=(['][^']*[']|["][^"]*["]|[\w-]+)/g, function(name, value){
							if(value.charAt(0) == '"' || value.charAt(0) == "'"){
								value = value.substring(1, value.length - 1);
							}
							elementProperties[name] = value;
						});
						tag = tag.substring(0, spaceIndex);
					}
					var element = frame.element.document.createElement(tag);
					for(var name in elementProperties){
						element.setAttribute(name, elementProperties[name]);
					}
					parentFrame.element.appendChild(element);
				}
			}, function(properties){
				frame.element.style = properties;
			});
		}
	}
});