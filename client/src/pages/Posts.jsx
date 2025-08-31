import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Plus, Upload, X } from 'lucide-react';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

const Posts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    image: null
  });
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(buildApiUrl('api/posts'));
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('category', newPost.category);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

              const response = await axios.post(buildApiUrl('api/posts'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setPosts([response.data.post, ...posts]);
      setNewPost({ title: '', content: '', category: 'general', image: null });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
              const response = await axios.post(buildApiUrl(`api/posts/${postId}/like`));
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const content = newComment[postId];
    if (!content?.trim()) return;

    try {
              const response = await axios.post(buildApiUrl(`api/posts/${postId}/comment`), { content });
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const isLiked = (post) => {
    return post.likes.some(like => like.user === user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mental Health Posts</h1>
            <p className="text-gray-600 mt-2">Share knowledge and support each other</p>
          </div>
          
          {user.role === 'doctor' && user.isActive && (
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Post</span>
            </button>
          )}
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="awareness">Awareness</option>
                    <option value="tips">Tips</option>
                    <option value="article">Article</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    rows="6"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Write your post content here..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-md p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold">
                      {post.author?.name?.charAt(0) || 'D'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                      <span className="text-sm text-gray-500">{post.author?.specialization}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.category === 'awareness' ? 'bg-blue-100 text-blue-800' :
                    post.category === 'tips' ? 'bg-green-100 text-green-800' :
                    post.category === 'article' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.category}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  {post.image && (
                    <img
                      src={`https://neuroconnectserver.onrender.com${post.image}`}
                      alt="Post"
                      className="mt-4 w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-6 py-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className={`flex items-center space-x-2 ${
                      isLiked(post) ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                    } transition-colors`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked(post) ? 'fill-current' : ''}`} />
                    <span>{post.likes.length}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 text-sm font-semibold">
                          {comment.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 text-sm">{comment.user?.name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex space-x-3 pt-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 text-sm font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={newComment[post._id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {user.role === 'doctor' ? 
                  'Be the first to share helpful mental health content!' :
                  'Check back soon for helpful posts from our counsellors.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;