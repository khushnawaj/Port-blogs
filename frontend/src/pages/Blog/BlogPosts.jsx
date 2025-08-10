import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import './BlogPosts.scss';
// import post1 from '../../assets/task1';
// import post2 from '../../assets/task2';
// import post3 from '../../assets/ecom';

export default function BlogPosts() {
  const posts = [
    {
      id: 1,
      title: "Modern React Patterns Every Developer Should Know",
      excerpt: "Explore advanced React patterns that will elevate your component architecture and state management.",
      // image: post1,
      date: "May 15, 2023",
      readTime: "8 min read",
      tags: ["React", "JavaScript", "Frontend"],
      slug: "modern-react-patterns"
    },
    {
      id: 2,
      title: "Building Scalable Node.js Microservices",
      excerpt: "Learn how to design and implement microservices architecture with Node.js and Docker.",
      // image: post2,
      date: "June 2, 2023",
      readTime: "12 min read",
      tags: ["Node.js", "Backend", "Microservices"],
      slug: "nodejs-microservices"
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to Use Each",
      excerpt: "A practical guide to choosing the right layout system for your web projects.",
      // image: post3,
      date: "June 18, 2023",
      readTime: "6 min read",
      tags: ["CSS", "Frontend", "Design"],
      slug: "css-grid-flexbox"
    }
  ];

  return (
    <div className="blog-posts">
      <div className="blog-posts-header">
        <h1>Latest Articles</h1>
        <p>Thoughts, tutorials and insights about modern web development and design principles.</p>
      </div>

      <div className="blog-posts-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-posts-card">
            <div className="blog-posts-card-image">
              <img src={post.image} alt={post.title} loading="lazy" />
            </div>
            <div className="blog-posts-card-content">
              <div className="meta">
                <span><FiCalendar /> {post.date}</span>
                <span><FiClock /> {post.readTime}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="blog-posts-card-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a href={`/blog/${post.slug}`} className="read-more">
                Read more <FiArrowRight />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}