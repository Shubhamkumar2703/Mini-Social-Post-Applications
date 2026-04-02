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

  <div className="create-post-card">

    {/* HEADER */}
    <div className="create-header">
      <h3>Create Post</h3>
      <div className="tabs">
        <span className="active">All Posts</span>
      </div>
    </div>

    {/* INPUT */}
    <div className="create-input">
      <input
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>

    {/* IMAGE NAME PREVIEW */}
    {image && (
      <div className="file-preview">
        📷 {image.name}
      </div>
    )}

    {/* ACTIONS */}
    <div className="create-actions">

      {/* LEFT SIDE ICONS */}
      <div className="left-icons">
        <label className="upload-btn">
          ➕ Upload
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      </div>

      {/* RIGHT SIDE POST BUTTON */}
      <button 
        className="post-btn"
        disabled={!text && !image}
        onClick={createPost}
      >
        Post
      </button>

    </div>

  </div>

</div>

        {/* POSTS */}
        {posts.map((p) => (
          <div key={p._id} className="post-card">

            <div className="post-header">
              {p.username}
              {user.id === p.userId && (
                <button onClick={() => deletePost(p._id)}>🗑️</button>
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
    </>
  );
};

export default Feed;