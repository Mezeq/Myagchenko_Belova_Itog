import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, basketsAPI, reviewsAPI, ordersAPI, contactsAPI } from '../api';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [baskets, setBaskets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBasket, setEditingBasket] = useState(null);
  const [basketForm, setBasketForm] = useState({ name: '', description: '', price: '', image: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: 5, image: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('greenBasketToken');
    const savedUser = localStorage.getItem('greenBasketUser');
    if (!token || !savedUser) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(savedUser));
    } catch { navigate('/login'); }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'orders') {
        const res = await ordersAPI.getAll();
        setOrders(res.data);
      } else if (tab === 'baskets') {
        const res = await basketsAPI.getAll();
        setBaskets(res.data);
      } else if (tab === 'reviews') {
        const res = await reviewsAPI.getAll();
        setReviews(res.data);
      } else if (tab === 'users') {
        const res = await authAPI.getUsers();
        setUsers(res.data);
      } else if (tab === 'contacts') {
        const res = await contactsAPI.getAll();
        setMessages(res.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('greenBasketToken');
        localStorage.removeItem('greenBasketUser');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('greenBasketToken');
    localStorage.removeItem('greenBasketUser');
    navigate('/');
  };

  const handleBasketSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBasket) {
        await basketsAPI.update(editingBasket.id, { ...basketForm, price: Number(basketForm.price) });
      } else {
        await basketsAPI.create({ ...basketForm, price: Number(basketForm.price) });
      }
      setEditingBasket(null);
      setBasketForm({ name: '', description: '', price: '', image: '' });
      const res = await basketsAPI.getAll();
      setBaskets(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка');
    }
  };

  const handleEditBasket = (basket) => {
    setEditingBasket(basket);
    setBasketForm({ name: basket.name, description: basket.description, price: basket.price.toString(), image: basket.image });
  };

  const handleDeleteBasket = async (id) => {
    if (!window.confirm('Удалить корзину?')) return;
    await basketsAPI.delete(id);
    const res = await basketsAPI.getAll();
    setBaskets(res.data);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewsAPI.create(reviewForm);
      setReviewForm({ name: '', text: '', rating: 5, image: '' });
      const res = await reviewsAPI.getAll();
      setReviews(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Удалить отзыв?')) return;
    await reviewsAPI.delete(id);
    const res = await reviewsAPI.getAll();
    setReviews(res.data);
  };

  const handleOrderStatus = async (id, status) => {
    await ordersAPI.updateStatus(id, status);
    const res = await ordersAPI.getAll();
    setOrders(res.data);
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Удалить заказ?')) return;
    await ordersAPI.delete(id);
    const res = await ordersAPI.getAll();
    setOrders(res.data);
  };

  if (!user) return null;

  const tabs = ['orders', 'baskets', 'reviews', 'users', 'contacts'];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/" className="admin-logo"><i className="fas fa-leaf"></i> Green Basket</Link>
        <div className="admin-user">
          <span>{user.name} ({user.role})</span>
          <button className="btn btn-logout" onClick={handleLogout}>Выйти</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {tabs.map(t => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'orders' && <><i className="fas fa-truck"></i> Заказы</>}
            {t === 'baskets' && <><i className="fas fa-shopping-basket"></i> Корзины</>}
            {t === 'reviews' && <><i className="fas fa-star"></i> Отзывы</>}
            {t === 'users' && <><i className="fas fa-users"></i> Пользователи</>}
            {t === 'contacts' && <><i className="fas fa-envelope"></i> Сообщения</>}
          </button>
        ))}
      </nav>

      <main className="admin-content">
        {loading && <div className="loading">Загрузка...</div>}

        {!loading && tab === 'orders' && (
          <div className="admin-section">
            <h2>Заказы ({orders.length})</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Имя</th><th>Телефон</th><th>Корзина</th><th>Дата</th><th>Статус</th><th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.name}</td>
                      <td>{o.phone}</td>
                      <td>{o.basket_type}</td>
                      <td>{new Date(o.delivery_date).toLocaleDateString('ru-RU')}</td>
                      <td><span className={`status status-${o.status}`}>{o.status === 'pending' ? 'Ожидает' : o.status === 'confirmed' ? 'Подтвержден' : o.status === 'delivered' ? 'Доставлен' : 'Отменен'}</span></td>
                      <td className="actions">
                        <button className="btn-sm btn-confirm" onClick={() => handleOrderStatus(o.id, 'confirmed')}>Подтв.</button>
                        <button className="btn-sm btn-deliver" onClick={() => handleOrderStatus(o.id, 'delivered')}>Дост.</button>
                        <button className="btn-sm btn-cancel" onClick={() => handleOrderStatus(o.id, 'cancelled')}>Отм.</button>
                        <button className="btn-sm btn-danger" onClick={() => handleDeleteOrder(o.id)}>Уд.</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === 'baskets' && (
          <div className="admin-section">
            <h2>{editingBasket ? 'Редактировать корзину' : 'Добавить корзину'}</h2>
            <form onSubmit={handleBasketSubmit} className="admin-form">
              <input placeholder="Название" value={basketForm.name} onChange={e => setBasketForm({...basketForm, name: e.target.value})} required />
              <input placeholder="Описание" value={basketForm.description} onChange={e => setBasketForm({...basketForm, description: e.target.value})} />
              <input type="number" placeholder="Цена" value={basketForm.price} onChange={e => setBasketForm({...basketForm, price: e.target.value})} required />
              <input placeholder="URL изображения" value={basketForm.image} onChange={e => setBasketForm({...basketForm, image: e.target.value})} />
              <div className="form-actions">
                <button type="submit" className="btn">{editingBasket ? 'Сохранить' : 'Добавить'}</button>
                {editingBasket && <button type="button" className="btn btn-secondary" onClick={() => { setEditingBasket(null); setBasketForm({ name: '', description: '', price: '', image: '' }); }}>Отмена</button>}
              </div>
            </form>

            <h2>Все корзины ({baskets.length})</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>ID</th><th>Название</th><th>Цена</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {baskets.map(b => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.name}</td>
                      <td>{b.price} ₽</td>
                      <td className="actions">
                        <button className="btn-sm btn-edit" onClick={() => handleEditBasket(b)}>Ред.</button>
                        <button className="btn-sm btn-danger" onClick={() => handleDeleteBasket(b.id)}>Уд.</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === 'reviews' && (
          <div className="admin-section">
            <h2>Добавить отзыв</h2>
            <form onSubmit={handleReviewSubmit} className="admin-form">
              <input placeholder="Имя" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} required />
              <textarea placeholder="Текст отзыва" value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} required rows={3} />
              <div className="form-row">
                <label>Рейтинг: </label>
                <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}>
                  {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input placeholder="URL фото" value={reviewForm.image} onChange={e => setReviewForm({...reviewForm, image: e.target.value})} />
              </div>
              <button type="submit" className="btn">Добавить отзыв</button>
            </form>

            <h2>Все отзывы ({reviews.length})</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Имя</th><th>Рейтинг</th><th>Текст</th><th>Действия</th></tr></thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td><td>{r.name}</td><td>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</td>
                      <td className="text-preview">{r.text.substring(0, 60)}...</td>
                      <td><button className="btn-sm btn-danger" onClick={() => handleDeleteReview(r.id)}>Уд.</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === 'users' && (
          <div className="admin-section">
            <h2>Пользователи ({users.length})</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th><th>Дата</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td>
                      <td><span className={`role-${u.role}`}>{u.role === 'admin' ? 'Админ' : 'Пользователь'}</span></td>
                      <td>{new Date(u.created_at).toLocaleDateString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === 'contacts' && (
          <div className="admin-section">
            <h2>Сообщения ({messages.length})</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Сообщение</th><th>Дата</th></tr></thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td><td>{m.name}</td><td>{m.email}</td>
                      <td className="text-preview">{m.message.substring(0, 80)}...</td>
                      <td>{new Date(m.created_at).toLocaleDateString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .admin-page { min-height: 100vh; background: #f0f2f5; }
        .admin-header {
          background: #1b5e20; color: white; padding: 15px 30px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .admin-logo { color: white; text-decoration: none; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .admin-user { display: flex; align-items: center; gap: 20px; }
        .btn-logout { background: rgba(255,255,255,0.2); color: white; padding: 8px 20px; font-size: 0.9rem; }
        .btn-logout:hover { background: rgba(255,255,255,0.3); }
        .admin-tabs {
          display: flex; gap: 0; background: white;
          border-bottom: 2px solid #e0e0e0; padding: 0 20px;
        }
        .admin-tab {
          padding: 15px 25px; border: none; background: none;
          cursor: pointer; font-size: 0.95rem; color: #666;
          border-bottom: 3px solid transparent; transition: all 0.3s;
          display: flex; align-items: center; gap: 8px;
        }
        .admin-tab:hover { color: #2e7d32; background: #f5f5f5; }
        .admin-tab.active { color: #2e7d32; border-bottom-color: #2e7d32; font-weight: 600; }
        .admin-content { padding: 30px; max-width: 1200px; margin: 0 auto; }
        .admin-section { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 30px; }
        .admin-section h2 { color: #333; font-size: 1.3rem; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
        .admin-form { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; max-width: 500px; }
        .admin-form input, .admin-form textarea, .admin-form select {
          padding: 10px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95rem;
        }
        .admin-form input:focus, .admin-form textarea:focus { outline: none; border-color: #2e7d32; }
        .form-row { display: flex; align-items: center; gap: 15px; }
        .form-row select { width: 80px; }
        .form-actions { display: flex; gap: 10px; }
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
        th { background: #f8f9fa; color: #555; font-weight: 600; }
        tr:hover { background: #f8f9fa; }
        .text-preview { color: #888; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .actions { display: flex; gap: 5px; flex-wrap: wrap; }
        .btn-sm {
          padding: 5px 12px; border: none; border-radius: 5px;
          cursor: pointer; font-size: 0.8rem; transition: all 0.2s;
        }
        .btn-confirm { background: #e3f2fd; color: #1565c0; }
        .btn-deliver { background: #e8f5e9; color: #2e7d32; }
        .btn-cancel { background: #fff3e0; color: #e65100; }
        .btn-edit { background: #f3e5f5; color: #7b1fa2; }
        .btn-danger { background: #ffebee; color: #c62828; }
        .btn-sm:hover { opacity: 0.8; }
        .status { display: inline-block; padding: 3px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: 500; }
        .status-pending { background: #fff3e0; color: #e65100; }
        .status-confirmed { background: #e3f2fd; color: #1565c0; }
        .status-delivered { background: #e8f5e9; color: #2e7d32; }
        .status-cancelled { background: #ffebee; color: #c62828; }
        .role-admin { color: #7b1fa2; font-weight: 600; }
        .role-user { color: #1565c0; }
        .loading { text-align: center; padding: 60px; color: #888; font-size: 1.2rem; }
        @media (max-width: 768px) {
          .admin-header { padding: 15px; flex-direction: column; gap: 10px; text-align: center; }
          .admin-tabs { flex-wrap: wrap; padding: 0 10px; }
          .admin-tab { padding: 12px 15px; font-size: 0.85rem; }
          .admin-content { padding: 15px; }
          .admin-section { padding: 15px; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
