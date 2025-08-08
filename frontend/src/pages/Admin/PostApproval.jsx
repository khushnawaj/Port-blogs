const PostApproval = () => {
  // In a real app, you'd fetch pending posts from an API
  const pendingPosts = [
    { id: 1, title: "New React Tutorial", author: "User123" },
    { id: 2, title: "CSS Grid Guide", author: "User456" }
  ];

  return (
    <div className="post-approval">
      <h2>Pending Blog Posts</h2>
      <ul>
        {pendingPosts.map(post => (
          <li key={post.id}>
            {post.title} by {post.author}
            <button>Approve</button>
            <button>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostApproval;