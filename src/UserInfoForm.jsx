import React, { useState } from 'react';

const UserInfoForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onSubmit({ name, email });
    } else {
      alert('Por favor, preencha nome e e-mail corretamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nome:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">E-mail:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Começar Quiz
      </button>
    </form>
  );
};

export default UserInfoForm;
