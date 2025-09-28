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

const PostList: React.FC = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
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
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [token]); // Re-run whenever token changes

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

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="post-feed">
      <h1>Post Feed</h1>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;