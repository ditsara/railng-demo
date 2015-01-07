class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :init_js_binding

  def js_bind(obj, name = nil, options = {})
    name ||= :obj
    @js_bind[name] = obj
    return obj
  end

  # Another option is to just bind all instance variables implicitly
  # to JS by calling / processing self.instance_variables. This might
  # have some security implications if we're messy with instance
  # variables, however, and we'd have to figure out a way to match
  # up resource URLs.

  def init_js_binding
    @js_bind = {}
  end
end
