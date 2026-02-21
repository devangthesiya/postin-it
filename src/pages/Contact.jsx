export default function Contact() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>contact</h1>
          <p>want to connect? here's where you can find me</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-grid">
            <a href="mailto:devangthesiya16@gmail.com" className="contact-card">
              <div className="contact-card-info">
                <h3>Email</h3>
                <p>devangthesiya16@gmail.com</p>
              </div>
            </a>

            <a href="https://x.com/devangthesiya" target="_blank" rel="noopener noreferrer" className="contact-card">
              <div className="contact-card-info">
                <h3>X (Twitter)</h3>
                <p>@devangthesiya</p>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/devang-thesiya/" target="_blank" rel="noopener noreferrer" className="contact-card">
              <div className="contact-card-info">
                <h3>LinkedIn</h3>
                <p>/in/devang-thesiya</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
