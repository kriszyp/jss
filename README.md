This project is not complete, this is just a sketch right now
<h1>JSON Style Sheets</h1>
JSON Style Sheets (JSS) is a templating tool for rendering JSON/JavaScript data. JSS
is designed to provide a presentation layer as an extension to CSS, without incurring
the extra overhead and complexity of intermediate HTML generation. CSS is designed
to seperate the visual concerns from semantic data concerns of HTML. However,
with JSON templating, HTML often becomes completely abused, used as a semi-presentation
layer for the JSON data, muddying the separation of concerns and creating excessively 
complex relations and indirection between the data and the intended rendering. JSS 
extends CSS to provide the necessary facilities to render JSON with minimally sufficient 
embedded HTML layout information to properly present data, while still using standard
language syntax and semantics. All valid CSS is valid JSS, and most HTML is valid JSS 
as well.

data.json:
	{
	  "title": "Search for sedans",
	  "cars": [
	      {"make": "Honda", "model": "Accord"},
	      {"make": "Ford", "model": "Taurus"},
	    ]
	}
template.jss:
	
	/title {
		font-size: 24px;
	}
	/cars {
		border: 1px;
	}
	/cars/#/make {
		color: blue;
	};

To apply this template to the data:

	var templateString = loadTemplate();
	var compile = require("jss").compile;
	var template = compile(templateString);
	template.apply(targetDom);	
	
This would render the JSON with the given styles.

JSS allows for nested definitions as well:
	/cars {
		border: 1px;
		/make {
			color: blue;
		};
	}

Or even mixed with standards CSS selectors:
	.some-class {
		/title {
			font-size: 24px;
		}
		/cars {
			border: 1px;
		}
	}


However, when rendering JSON in application, we often need much more control over
the layout, we can utilize HTML directives to add information for layout and interpretation
of semantics directly within our style sheet (no need for a separate file). We can insert
HTML directly into JSS. We can also postpend HTML fragments with selector/rules to
define the styles for that element:

	<h1>My App</h1>
	<h2> /title {
		font-size: 24px;
	}
	
	<ul> {
		border: 1px;
		<li> /cars {
			/make {
				color: blue;
			}
		}
	}

We can also specify variables within the HTML:
	<ul> {
		border: 1px;
		<li><a href="{/id}"> /cars {
			/make {
				color: blue;
			}
		}
	}

