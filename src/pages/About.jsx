import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>about</h1>
          <p>a little context about who i am and why this exists</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="about-content">
            <p>
              Hey there — I'm <strong>Devang Thesiya</strong>. Welcome to my little corner of the internet.
            </p>

            <p>
              I built <strong>Musing</strong> because I wanted a space that's entirely mine — no algorithms, no feeds, no engagement metrics. Just a quiet place to think out loud and share what I find interesting.
            </p>

            <h2>What you'll find here</h2>

            <p>
              A mix of everything, really. Long-form essays when something takes hold of my brain for long enough. Quick notes when I just need to get a thought down. Occasionally something technical, but mostly just observations about the world, work, and life in general.
            </p>

            <h2>The philosophy</h2>

            <p>
              This site is intentionally minimal. No tracking, no analytics, no cookies. Just words on a page. I think the best writing happens when you're not trying to optimize for anything other than clarity and honesty.
            </p>

            <p>
              If something here resonates with you, or if you just want to say hi — reach out on the <Link to="/contact">contact page</Link>. I'd love to hear from you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
