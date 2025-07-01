import React from 'react';

const Contact: React.FC = () => {
  return (
    <div>
      <h1>Contajhct Us</h1>
      <p>This is a React-generated page!</p>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Contact;