import React, { useEffect, useState } from "react";
import API from "../services/api";
import { uploadImage } from "../services/upload";
import "./feed.css";

const Feed = ({ setUser }) => {
  const [posts, setPosts] = useState([]);
  const [showPostBox, setShowPostBox] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    let imageUrl = "";
    if (image) imageUrl = await uploadImage(image);

    await API.post("/posts", { text, imageUrl });

    setShowPostBox(false);
    setText("");
    setImage(null);
    fetchPosts();
  };

  const likePost = async (id) => {
    await API.put(`/posts/${id}/like`);
    fetchPosts();
  };

  const deletePost = async (id) => {
    await API.delete(`/posts/${id}`);
    fetchPosts();
  };

  const addComment = async (id, comment) => {
    await API.post(`/posts/${id}/comment`, { text: comment });
    fetchPosts();
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">InstaClone</div>
        <div className="profile" onClick={logout}>
          {user?.name} (Logout)
        </div>
      </div>

      <div className="feed-container">

        {/* CREATE POST BUTTON */}
        <div className="create-post-btn" onClick={() => setShowPostBox(true)}>
          +
        </div>

        {showPostBox && (
          <div>
            <input
              placeholder="Write something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={createPost}>Post</button>
          </div>
        )}

        {/* POSTS */}
        {posts.map((p) => (
          <div key={p._id} className="post-card">

            <div className="post-header">
              {p.username}
              {user.id === p.userId && (
                <button onClick={() => deletePost(p._id)}>🗑</button>
              )}
            </div>

            <div>{p.text}</div>

            {p.imageUrl && <img src={p.imageUrl} className="post-image" />}

            <div className="post-actions">
              <button onClick={() => likePost(p._id)}>
                ❤️ {p.likes.length}
              </button>
              <span>💬 {p.comments.length}</span>
            </div>

            <div className="comment-section">
              {p.comments.map((c, i) => (
                <div key={i} className="comment">
                  <b>{c.username}</b>: {c.text}
                </div>
              ))}

              <input
                placeholder="Add comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addComment(p._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>

          </div>
        ))}
      </div>
    </>
  );
};

export default Feed;