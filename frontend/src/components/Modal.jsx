import React, { useState } from 'react';

export default function Modal({ title, fields, okText = 'Save', onSubmit, onClose }) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.k] = f.v !== undefined && f.v !== null ? f.v : (f.o ? f.o[0] : '');
    });
    return initial;
  });

  const [error, setError] = useState('');

  const handleChange = (k, val) => {
    setFormData((prev) => ({ ...prev, [k]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = await onSubmit(formData);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  return (
    <div className="ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="md" noValidate onSubmit={handleSubmit}>
        <h3>{title}</h3>
        {fields.map((f) => (
          <label key={f.k}>
            {f.l}
            {f.o ? (
              <select
                name={f.k}
                value={formData[f.k]}
                onChange={(e) => handleChange(f.k, e.target.value)}
              >
                {f.o.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={f.k}
                type={f.t || 'text'}
                value={formData[f.k]}
                step={f.t === 'number' ? 'any' : undefined}
                min={f.t === 'number' ? '0' : undefined}
                onChange={(e) => handleChange(f.k, e.target.value)}
              />
            )}
          </label>
        ))}
        <p className="err">{error}</p>
        <div className="row">
          <button className="btn">{okText}</button>
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
