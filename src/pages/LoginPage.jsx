import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Пароли не совпадают');
        setLoading(false);
        return;
      }

      let response;
      if (isLogin) {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      const { user, token } = response.data;
      localStorage.setItem('greenBasketToken', token);
      localStorage.setItem('greenBasketUser', JSON.stringify(user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <i className="fas fa-leaf"></i> Green Basket
          </Link>
          <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email" id="email" name="email"
              value={formData.email} onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password" id="password" name="password"
              value={formData.password} onChange={handleChange}
              required minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Повторите пароль</label>
              <input
                type="password" id="confirmPassword" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                required minLength={6}
              />
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-login" disabled={loading}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="login-toggle">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button className="link-btn" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%);
          padding: 20px;
        }
        .login-container {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 420px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .login-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1b5e20;
          text-decoration: none;
          margin-bottom: 20px;
        }
        .login-logo i { color: #2e7d32; }
        .login-header h2 { color: #333; margin: 0; }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        .form-group input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #2e7d32;
          box-shadow: 0 0 0 3px rgba(46,125,50,0.1);
        }
        .form-error {
          background: #fde8e8;
          color: #c53030;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }
        .btn-login {
          width: 100%;
          padding: 14px;
          font-size: 1.1rem;
          margin-top: 10px;
        }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
        .login-toggle {
          text-align: center;
          margin-top: 25px;
          color: #666;
        }
        .link-btn {
          background: none;
          border: none;
          color: #2e7d32;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: underline;
        }
        .link-btn:hover { color: #1b5e20; }
        @media (max-width: 480px) {
          .login-container { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
