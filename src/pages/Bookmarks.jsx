import { BOOKMARKS } from '../data/bookmarks';

export default function Bookmarks() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>bookmarks</h1>
          <p>things i've found interesting enough to save</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {BOOKMARKS.map(category => (
            <div key={category.category} className="bookmarks-section">
              <h2>{category.category}</h2>
              <div className="bookmarks-list">
                {category.items.map(item => (
                  <a
                    key={item.url}
                    className="bookmark-card"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="bookmark-url">{new URL(item.url).hostname}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
