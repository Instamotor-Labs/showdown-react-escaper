(function (extension) {
  'use strict'

  if (typeof showdown === 'object') {
    // global (browser or nodejs global)
    showdown.extension('react-escaper', extension())
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define('react-escaper', extension())
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension()
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library')
  }

}(function() {
  return [
    {
      type: 'listener',
      listeners: {
        'blockGamut.before': function(name, text, converter, options, globals) {
          // basically the code from https://github.com/showdownjs/showdown/blob/master/src/subParsers/hashHTMLBlocks.js
          var reactComponents = []
          // any xml tag that starts with a capital letter, hah!
          var reactComponentRe = /<([A-Z][A-Za-z0-9]*?)\b[^/>]*\/?>/mg
          var result
          while ((result = reactComponentRe.exec(text)) !== null) {
            if (reactComponents.indexOf(result[1]) === -1) {
              reactComponents.push(result[1])
            }
          }

          var repFunc = function (wholeMatch, match, left, right) {
            // always convert to markdown
            var txt = wholeMatch
            txt = left.replace(/</, "&lt;").replace(/>/, "&gt;") + converter.makeHtml(match) + right.replace(/</, "&lt;").replace(/>/, "&gt;")
            return '\n\n¨K' + (globals.gHtmlBlocks.push(txt) - 1) + 'K\n\n'
          }

          // TODO - this will blow up in node unless we have showdown set globally
          for (var i = 0; i < reactComponents.length; ++i) {
            // handle case with opening / closing tags
            text = showdown.helper.replaceRecursiveRegExp(text, repFunc, '^\s*?<' + reactComponents[i] + '\\b[^>]*>', '</' + reactComponents[i] + '>', 'gim')
            // handle self closing tag
            text = text.replace(new RegExp('^ {0,3}(<' + reactComponents[i] + '.*?/>)', 'gm'),
              function(wholeMatch, m1) {
                return showdown.subParser('hashElement')(text, options, globals)(wholeMatch, m1.replace(/</, '&lt;').replace(/\s?\/>/, ' /&gt;'))
              })
          }

          return text
        }
      }
    }
  ]
}))
