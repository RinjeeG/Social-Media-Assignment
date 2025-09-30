import React, { useEffect, useState } from 'react';
import './PostList.css';
import { useAuth } from '../context/AuthContext';

interface Post {
  id: string;
  user: number;
  image: string;
  caption: string;
  created_at: string;
  no_of_likes: number;
}

interface Comment {
    id: number;
    post: string;
    user: number;
    username: string;
    text: string;
    created_at: string;
}
const PostList: React.FC = () => {
  const { token, setToken } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]:Comment[] }>({});
  const [newComment, setNewComment ] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Current token in PostList:', token); // Debug
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetch('/api/posts/', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('Response status:', response.status); // Debug
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data); // Debug
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
        setLoading(false);
        data.forEach((post: Post) => fetchComments(post.id)); //Fetch initial comments
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [token]); // Re-run whenever token changes

    const fetchComments = async (postId: string) => {
    console.log('Fetching comments for postId:', postId); // Fixed typo
    const response = await fetch(`/api/comments/${postId}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Comments data for postId:', postId, data);
        setComments(prev => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }));
    } else {
        console.log('Failed to fetch comments for postId:', postId, response.status);
        setComments(prev => ({ ...prev, [postId]: [] }));
    }
    };
  const handleLike = async (postId: string) => {
    if (!token) return;

    try {
        const response = await  fetch(`/api/like/?post_id=${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Like failed');
        }
        const data = await response.json();
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, no_of_likes: 
                data.no_of_likes } : post
            ));
    } catch (error) {
        console.error('Like error:', error);
    }
  };

  const handleLogout = async () => {
    try {
        await fetch('api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        setToken(null); //Clear token in context
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Logout error', error)
    }
  };

 const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment[postId] || !token) return;
    try {
      const response = await fetch(`http://localhost:8000/api/comments/${postId}/`, { // Absolute URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: newComment[postId] }),
      });
      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newCommentData] }));
        setNewComment(prev => ({ ...prev, [postId]: '' }));
      } else {
        throw new Error('Comment submission failed');
      }
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="post-feed">
      <h1>Post Feed</h1>
      <button onClick={handleLogout}>Logout</button>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <p><strong>Caption:</strong> {post.caption}</p>
              {post.image && <img src={post.image} alt={post.caption} />}
              <p><strong>Likes:</strong> {post.no_of_likes}</p>
              <button onClick={() => handleLike(post.id)}>Like</button>
              <p><strong>Posted:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
              <div>
                <form onSubmit={(e) => handleCommentSubmit(post.id, e)}>
                  <input
                    type="text"
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Add a comment"
                  />
                  <button type="submit">Comment</button>
                </form>
                {comments[post.id] && (
                  <div>
                    {Array.isArray(comments[post.id]) ? (
                      comments[post.id].map((comment: Comment) => (
                        <p key={comment.id}><strong>{comment.username}:</strong> {comment.text}</p>
                      ))
                    ) : (
                      <p>No comments available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;