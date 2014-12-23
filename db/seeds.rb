# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
posts = Post.create([
  {
    title: "Test Post #1",
    body: "This is the first post. Lorem ipsum etc etc."
  },
  {
    title: "Second Post",
    body: "Another post. Yay!"
  }
])
