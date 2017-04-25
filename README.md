showdown-react-escaper
==============================

# NOTE: You probably don't have a usage case for this

Plugin for the [showdown](https://github.com/showdownjs/showdown) markdown parser to escape things that look like React components.

This:

```
## Header
Some text
<MyComponent>
 [some markdown](http://somewhere.org)
</MyComponent>
```

Will be rendered as:

```html
<p><h2>Some text</h2></p>
<MyComponent>
  <a href="http://somewhere.org">some markdown</a>
</MyComponent>
```

## Why?
We built a front-end to [ghost](https://github.com/TryGhost/Ghost) in React using [react-showdown](https://github.com/jerolimov/react-showdown) to allow inline React components in blog posts. The [ghost-admin](https://github.com/TryGhost/Ghost-Admin) tool doesn't know anything about our React components though and tries to render them as html tags, and this means they disappear from the editor preview pane.

## Usage
```javascript
var Showdown = require('showdown');
var reactEscaper = require('showdown-react-escaper');
// on the server side
var converter = new showdown.Converter({ extensions: [reactEscaper] });
// on the client side (or with global.showdown set)
var converter = new showdown.Converter({ extensions: ['react-escaper'] });
```

## Installation

```
$ npm install --save showdown-react-escaper
```
