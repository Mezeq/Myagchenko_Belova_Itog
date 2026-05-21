import React, { useState } from 'react';
import { contactsAPI, authAPI } from '../api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Имя обязательно';
    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const result = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = result.data;
      localStorage.setItem('greenBasketToken', token);
      localStorage.setItem('greenBasketUser', JSON.stringify(user));

      setSubmissionData(user);
      setIsSubmitted(true);

      if (formData.message.trim()) {
        await contactsAPI.send({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }).catch(() => {});
      }

      setFormData({ name: '', email: '', password: '', confirmPassword: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      if (err.response?.data?.error) {
        setErrors({ general: err.response.data.error });
      } else if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach(e => { apiErrors[e.param || 'general'] = e.msg; });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'Ошибка сервера' });
      }
    }
  };

  return (
    <div className="contact-form">
      <form onSubmit={handleSubmit} noValidate>
        {errors.general && <div className="form-error">{errors.general}</div>}
        <div className="form-group">
          <label htmlFor="name">Имя *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={errors.name ? 'error' : ''} />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={errors.email ? 'error' : ''} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль *</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" className={errors.password ? 'error' : ''} />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Повторите пароль *</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={errors.confirmPassword ? 'error' : ''} />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="message">Сообщение</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" />
        </div>
        <button type="submit" className="btn">Отправить / Зарегистрироваться</button>
      </form>

      {isSubmitted && submissionData && (
        <div className="success-message fade-in">
          <h4>✅ Регистрация успешна!</h4>
          <p>Спасибо, <strong>{submissionData.name}</strong>!</p>
          <p>Ваш email: <strong>{submissionData.email}</strong></p>
          <p>Данные сохранены в системе.</p>
        </div>
      )}

      <style jsx>{`
        .contact-form { width: 100%; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-color); }
        input, textarea { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-family: inherit; font-size: 1rem; transition: var(--transition); }
        input:focus, textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
        input.error, textarea.error { border-color: #e74c3c; background-color: #fff8f8; }
        .error-message { display: block; color: #e74c3c; font-size: 0.875rem; margin-top: 5px; }
        .form-error { background: #fde8e8; color: #c53030; padding: 12px; border-radius: 5px; margin-bottom: 20px; font-size: 0.9rem; text-align: center; }
        textarea { resize: vertical; }
        button[type="submit"] { width: 100%; margin-top: 10px; }
        .success-message { margin-top: 25px; padding: 20px; background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; color: #155724; text-align: center; }
        .success-message h4 { color: #155724; margin-bottom: 10px; }
        .success-message p { margin-bottom: 5px; }
      `}</style>
    </div>
  );
};

export default ContactForm;
