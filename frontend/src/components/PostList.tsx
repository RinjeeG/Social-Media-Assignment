import React, { useEffect, useState } from 'react';
import './PostList.css';

interface Post{
    id: string;
    user: number;
    image: string;
    caption: string;
    created_at: string;
    no_of_likes: number;
}

const PostList: React.FC = () => {
    console.log('PostList componenet mounted');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Fetch posts from Django API and update state
    useEffect(() => {
        const token = localStorage.getItem('token'); //get token from login
        if (!token) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }
        fetch('/api/posts/', {
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (Array.isArray(data)){
                setPosts(data);
            } else {
                setPosts([]);
            }
            setLoading(false);
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Post Feed</h1>
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} style={{ margin: '10px 0', border:'1px solid #ccc', padding: '10px'}}>
                        <p><strong>Caption:</strong> {post.caption}</p>
                        {post.image && <img src={post.image} alt={post.caption} style={{ maxWidth:'300px' }} />}
                        <p><strong>Likes:</strong> {post.no_of_likes}</p>
                        <p><strong>Posted:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default PostList;