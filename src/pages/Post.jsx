import { useParams, Navigate } from 'react-router-dom';
import { POSTS } from '../data/posts';

export default function Post() {
  const { slug } = useParams();
  const post = POSTS.find(p => p.slug === slug);

  if (!post) return <Navigate to="/posts" replace />;

  return (
    <article className="post-article">
      <div className="container">
        <header className="post-article-header">
          <h1>{post.title}</h1>
          <div className="post-article-meta">
            <span>{post.displayDate}</span>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
            <span>&middot;</span>
            <span className="post-card-type">{post.type}</span>
          </div>
          <div className="post-article-tags">
            {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </header>

        <div
          className="post-article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
