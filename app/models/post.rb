class Post < ActiveRecord::Base

  def as_json(options={})
    {
      id: self.id,
      title: self.title,
      body: self.body,
      url: self.url
    }
  end

  delegate :url_helpers, to: 'Rails.application.routes'
  def url
    url_helpers.post_url(self, format: :json)
  end

end
