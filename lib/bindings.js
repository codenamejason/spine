// Generated by CoffeeScript 1.8.0
(function() {
  var BindingsClass, BindingsInstance, ValueSetter;

  BindingsClass = {
    model: 'model',
    bindings: {}
  };

  ValueSetter = (function() {
    function ValueSetter(context) {
      this.context = context;
    }

    ValueSetter.prototype.setValue = function(element, value, setter) {
      if (typeof setter === 'string') {
        setter = this.context.proxy(this.context[setter]);
      }
      setter = setter || (function(_this) {
        return function(e, v) {
          return _this._standardSetter(e, v);
        };
      })(this);
      return setter(element, value);
    };

    ValueSetter.prototype.getValue = function(element, getter) {
      if (typeof getter === 'string') {
        getter = this.context.proxy(this.context[getter]);
      }
      getter = getter || (function(_this) {
        return function(e, v) {
          return _this._standardGetter(e, v);
        };
      })(this);
      return getter(element);
    };

    ValueSetter.prototype._standardGetter = function(element) {
      var self, _name;
      self = this;
      return (typeof self[_name = "_" + (element.attr("type")) + "Get"] === "function" ? self[_name](element) : void 0) || element.val();
    };

    ValueSetter.prototype._standardSetter = function(element, value) {
      var self;
      self = this;
      return element.each(function() {
        var el, _name;
        el = $(this);
        return (typeof self[_name = "_" + (el.attr("type")) + "Set"] === "function" ? self[_name](el, value) : void 0) || el.val(value);
      });
    };

    ValueSetter.prototype._checkboxSet = function(element, value) {
      if (value) {
        return element.prop("checked", "checked");
      } else {
        return element.prop("checked", "");
      }
    };

    ValueSetter.prototype._checkboxGet = function(element) {
      return element.is(":checked");
    };

    return ValueSetter;

  })();

  BindingsInstance = {
    getModel: function() {
      return this[this.modelVar];
    },
    setModel: function(model) {
      return this[this.modelVar] = model;
    },
    walkBindings: function(fn) {
      var field, selector, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (selector in _ref) {
        field = _ref[selector];
        _results.push(fn(selector, field));
      }
      return _results;
    },
    applyBindings: function() {
      this.valueSetter = new ValueSetter(this);
      return this.walkBindings((function(_this) {
        return function(selector, field) {
          if (!field.direction || field.direction === 'model') {
            _this._bindModelToEl(_this.getModel(), field, selector);
          }
          if (!field.direction || field.direction === 'element') {
            return _this._bindElToModel(_this.getModel(), field, selector);
          }
        };
      })(this));
    },
    _getField: function(value) {
      if (typeof value === 'string') {
        return value;
      } else {
        return value.field;
      }
    },
    _forceModelBindings: function(model) {
      return this.walkBindings((function(_this) {
        return function(selector, field) {
          return _this.valueSetter.setValue(_this.$(selector), model[_this._getField(field)], field.setter);
        };
      })(this));
    },
    changeBindingSource: function(model) {
      this.getModel().unbind('change');
      this.walkBindings((function(_this) {
        return function(selector) {
          if (selector === 'self') {
            selector = false;
          }
          return _this.el.off('change', selector);
        };
      })(this));
      this.setModel(model);
      this._forceModelBindings(model);
      return this.applyBindings();
    },
    _bindModelToEl: function(model, field, selector) {
      var self;
      self = this;
      if (selector === 'self') {
        selector = false;
      }
      return this.el.on('change', selector, function() {
        return model[self._getField(field)] = self.valueSetter.getValue($(this), field.getter);
      });
    },
    _bindElToModel: function(model, field, selector) {
      return model.bind('change', (function(_this) {
        return function() {
          return _this.valueSetter.setValue(_this.$(selector), model[_this._getField(field)], field.setter);
        };
      })(this));
    }
  };

  Spine.Bindings = {
    extended: function() {
      this.extend(BindingsClass);
      return this.include(BindingsInstance);
    }
  };

}).call(this);
