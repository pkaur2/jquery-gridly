// Generated by CoffeeScript 1.4.0

/*
jQuery Gridly
Copyright 2013 Kevin Sylvestre
*/


(function() {
  "use strict";

  var $, Animation, Gridly,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  Animation = (function() {

    function Animation() {}

    Animation.transitions = {
      "webkitTransition": "webkitTransitionEnd",
      "mozTransition": "mozTransitionEnd",
      "msTransition": "msTransitionEnd",
      "oTransition": "oTransitionEnd",
      "transition": "transitionend"
    };

    Animation.transition = function($el) {
      var el, result, type, _ref;
      el = $el[0];
      _ref = this.transitions;
      for (type in _ref) {
        result = _ref[type];
        if (el.style[type] != null) {
          return result;
        }
      }
    };

    Animation.execute = function($el, callback) {
      var transition;
      transition = this.transition($el);
      if (transition != null) {
        return $el.one(transition, callback);
      } else {
        return callback();
      }
    };

    return Animation;

  })();

  Gridly = (function() {

    Gridly.settings = {
      base: 60,
      gutter: 20,
      columns: 12,
      draggable: 'enable'
    };

    Gridly.gridly = function($el, options) {
      if (options == null) {
        options = {};
      }
      return new Gridly($el, options);
    };

    function Gridly($el, settings) {
      if (settings == null) {
        settings = {};
      }
      this.layout = __bind(this.layout, this);

      this.structure = __bind(this.structure, this);

      this.position = __bind(this.position, this);

      this.drag = __bind(this.drag, this);

      this.$sorted = __bind(this.$sorted, this);

      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);

      this.$ = __bind(this.$, this);

      this.$el = $el;
      this.settings = $.extend({}, Gridly.settings, settings);
    }

    Gridly.prototype.$ = function(selector) {
      return this.$el.find(selector);
    };

    Gridly.prototype.grow = function() {
      return this.grid.push();
    };

    Gridly.prototype.compare = function(d, s) {
      if (d.y > s.y + s.h) {
        return +1;
      }
      if (s.y > d.y + d.h) {
        return -1;
      }
      if ((d.x + (d.w / 2)) > (s.x + (s.w / 2))) {
        return +1;
      }
      if ((s.x + (s.w / 2)) > (d.x + (d.w / 2))) {
        return -1;
      }
      return 0;
    };

    Gridly.prototype.draggable = function() {
      return this.$('> *').draggable({
        zIndex: 800,
        drag: this.drag,
        start: this.start,
        stop: this.stop
      });
    };

    Gridly.prototype.swap = function(array, from, to) {
      var element;
      element = array[from];
      array.splice(from, 1);
      if (from < to) {
        to--;
      }
      array.splice(to, 0, element);
      return array;
    };

    Gridly.prototype.start = function(event, ui) {
      var $dragging, $element, $elements, i, _i, _ref, _results;
      $dragging = $(event.target);
      $elements = this.$('> *');
      $dragging.data('sort', 'target');
      _results = [];
      for (i = _i = 0, _ref = $elements.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        $element = $($elements[i]);
        _results.push($element.data('position', i));
      }
      return _results;
    };

    Gridly.prototype.stop = function(event, ui) {};

    Gridly.prototype.$sorted = function($elements) {
      if ($elements == null) {
        $elements = this.$('> *');
      }
      return $elements.sort(function(a, b) {
        var aVal, bVal;
        aVal = parseInt($(a).data('position'));
        bVal = parseInt($(b).data('position'));
        if (aVal < bVal) {
          return -1;
        }
        if (aVal > bVal) {
          return +1;
        }
        return 0;
      });
    };

    Gridly.prototype.drag = function(event, ui) {
      var $dragging, $element, $elements, coordinate, i, index, original, position, positions, _i, _ref;
      $dragging = $(event.target);
      $elements = this.$sorted();
      positions = this.structure($elements).positions;
      index = $dragging.data('position');
      original = index;
      coordinate = {
        x: $dragging.position().left,
        y: $dragging.position().top,
        w: $dragging.width(),
        h: $dragging.height()
      };
      for (i = _i = 0, _ref = $elements.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        $element = $($elements[i]);
        if ($element.is($dragging)) {
          continue;
        }
        position = positions[i];
        if (this.compare(coordinate, position) < 0) {
          index = i;
          break;
        }
      }
      if (index !== original) {
        console.debug(index);
        $dragging.data('position', index + 0.5);
        return this.layout(this.$sorted());
      }
    };

    Gridly.prototype.position = function($element, columns) {
      var column, height, i, max, size, _i, _j, _ref, _ref1;
      size = (($element.data('width') || $element.width()) + this.settings.gutter) / (this.settings.base + this.settings.gutter);
      height = Infinity;
      column = 0;
      for (i = _i = 0, _ref = columns.length - size; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        max = Math.max.apply(Math, columns.slice(i, i + size));
        if (max < height) {
          height = max;
          column = i;
        }
      }
      for (i = _j = column, _ref1 = column + size; column <= _ref1 ? _j < _ref1 : _j > _ref1; i = column <= _ref1 ? ++_j : --_j) {
        columns[i] = height + ($element.data('height') || $element.height()) + this.settings.gutter;
      }
      return {
        x: column * (this.settings.base + this.settings.gutter),
        y: height
      };
    };

    Gridly.prototype.structure = function($elements) {
      var columns, i, positions,
        _this = this;
      if ($elements == null) {
        $elements = this.$('> *');
      }
      positions = [];
      columns = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.settings.columns; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(0);
        }
        return _results;
      }).call(this);
      $elements.each(function(index, element) {
        var $element, position;
        $element = $(element);
        position = _this.position($element, columns);
        return positions.push({
          x: position.x,
          y: position.y,
          w: $element.width(),
          h: $element.height()
        });
      });
      return {
        height: Math.max.apply(Math, columns),
        positions: positions
      };
    };

    Gridly.prototype.layout = function($elements) {
      var structure,
        _this = this;
      if ($elements == null) {
        $elements = this.$('> *');
      }
      structure = this.structure($elements);
      $elements.each(function(index, element) {
        var $element, position;
        $element = $(element);
        position = structure.positions[index];
        return $element.css({
          position: 'absolute',
          left: position.x,
          top: position.y
        });
      });
      return this.$el.css({
        height: structure.height
      });
    };

    return Gridly;

  })();

  $.fn.extend({
    gridly: function(option) {
      if (option == null) {
        option = {};
      }
      return this.each(function() {
        var $this, action, options;
        $this = $(this);
        options = $.extend({}, $.fn.gridly.defaults, typeof option === "object" && option);
        action = typeof option === "string" ? option : option.action;
        if (action == null) {
          action = "layout";
        }
        return Gridly.gridly($this, options)[action]();
      });
    }
  });

}).call(this);
