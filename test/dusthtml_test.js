'use strict';

var fs = require('fs');
var path = require('path');
var grunt = require('grunt');
var dusthtml = require('../tasks/lib/dusthtml');
var fixtures = path.join(__dirname, 'fixtures');

exports.dusthtml = {

  basic: function(test) {
    test.expect(1);

    dusthtml.render('test', function(err, html) {
      test.equal(html, 'test');
      test.done();
    });
  },

  contextAsString: function(test) {
    test.expect(1);

    dusthtml.render('Hello {firstname}', { context: { firstname: 'Eric' } }, function(err, html) {
      test.equal(html, 'Hello Eric');
      test.done();
    });
  },

  contextAsFile: function(test) {
    test.expect(1);

    dusthtml.render('Hello {firstname}', {
      context: path.join(__dirname, './fixtures/context.json')
    }, function(err, html) {
      test.equal(html, 'Hello Eric');
      test.done();
    });
  },

  contextAsArrayMixed: function(test) {
    test.expect(1);

    dusthtml.render('Hello {firstname} {lastname}', {
      context: [path.join(fixtures, 'context.json'), { lastname: 'Hynds' }]
    }, function(err, html) {
      test.equal(html, 'Hello Eric Hynds');
      test.done();
    });
  },

  contextAsArrayObjects: function(test) {
    test.expect(1);

    dusthtml.render('Hello {firstname} {lastname}', {
      context: [{ firstname: 'Eric' }, { lastname: 'Hynds' }]
    }, function(err, html) {
      test.equal(html, 'Hello Eric Hynds');
      test.done();
    });
  },

  partials: function(test) {
    test.expect(1);

    var opts = {
      partialsDir: fixtures,
      context: {
        header: 'foo',
        footer: 'bar',
        main: 'baz'
      }
    };

    fs.readFile(path.join(fixtures, 'layout.dust'), 'utf8', function(err, input) {
      dusthtml.render(input, opts, function(err, html) {
        test.equal(html, '<header>foo</header> <main>baz</main> <footer>bar</footer>');
        test.done();
      });
    });
  },
};
