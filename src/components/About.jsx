import React from "react";

function About() {
  return (
    <>
      <div className="about-container">
        <h1>About Our Website</h1>
        <p>
          Our website was created to provide users with a simple and convenient
          platform for managing and showcasing digital business cards. The
          system integrates modern technologies with a responsive user
          interface, designed for businesses, individuals, and administrators
          alike.
        </p>

        <section className="about-objectives">
          <h2>Website Objectives</h2>
          <ul>
            <li>
              Allow businesses to easily create and share digital business
              cards.
            </li>
            <li>
              Provide users with a platform to manage personal and business
              cards.
            </li>
            <li>
              Ensure an accessible and intuitive experience for users of all
              technical skill levels.
            </li>
          </ul>
        </section>

        <section className="key-features">
          <h2>Key Features</h2>
          <ul>
            <li>
              Create, edit, and delete business cards (CRUD functionality).
            </li>
            <li>Mark favorite cards and save them for future reference.</li>
            <li>
              Display detailed business card information, including Google Maps
              integration.
            </li>
            <li>
              Manage user accounts with specific roles (regular, business,
              admin).
            </li>
            <li>Dark Mode for users who prefer a darker screen display.</li>
          </ul>
        </section>

        <section className="usage-guide">
          <h2>How to Use the Website?</h2>
          <ol>
            <li>Sign up using the registration form.</li>
            <li>
              Log in with your email and password to access personalized
              features.
            </li>
            <li>
              Create business cards for your enterprises and manage them
              effortlessly.
            </li>
            <li>
              Mark cards that interest you as favorites for quick access later.
            </li>
          </ol>
        </section>

        <section className="technologies">
          <h2>Technologies Used</h2>
          <ul>
            <li>
              The website leverages modern technologies to ensure a smooth and
              efficient experience:
            </li>
            <li>React.js – for building the user interface.</li>
            <li>Axios – for API calls and server communication.</li>
            <li>JWT – for managing user authentication and authorization.</li>
            <li>Google Maps API – for dynamic map displays.</li>
            <li>
              Responsive CSS – for adapting the design to various screen sizes.
            </li>
          </ul>
        </section>

        <footer className="about-footer">
          <p>
            Thank you for using our website! We value your feedback and look
            forward to continuously improving our platform.
          </p>
        </footer>
      </div>
    </>
  );
}

export default About;
