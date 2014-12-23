require 'test_helper'

class PostsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should create one post" do
    assert_difference('Post.count', 1) do
      post :create, {
        format: 'json',
        post: {
          title: "individual create",
          body: "abc",
          not_allowed: "this should be filtered out"
        }
      }
    end
    assert_template :show
  end

  test "should update one post" do
    assert_no_difference('Post.count') do
      put :update, {
        format: 'json',
        post: {
          id: posts(:one).id,
          title: "individual update",
          body: "abc",
          not_allowed: "this should be filtered out"
        }
      }
    end
    assert_template :show
  end

  test "should create one and update one post" do
    assert_difference('Post.count', 1) do
      put :update, {
        format: 'json',
        posts: [
          {
            title: "new post",
            body: "this is a new post",
            not_allowed: "this should be filtered"
          },
          {
            id: posts(:one).id,
            title: "update post",
            body: "this is an updated post",
            not_allowed: "this should be filtered"
          }
        ]
      }
    end
    assert_template :index
  end

end
