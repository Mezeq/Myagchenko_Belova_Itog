import React, { useState, useEffect } from 'react';
import { basketsAPI } from '../api';

const Baskets = () => {
  const [cart, setCart] = useState([]);
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    basketsAPI.getAll()
      .then(res => setBaskets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (basket) => {
    const newCart = [...cart, basket];
    setCart(newCart);
    localStorage.setItem('greenBasketCart', JSON.stringify(newCart));

    const button = document.querySelector(`.add-to-cart-${basket.id}`);
    if (button) {
      button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
      button.style.backgroundColor = 'var(--primary-dark)';

      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Добавить в заказ';
        button.style.backgroundColor = '';
      }, 2000);
    }
  };

  const cartCount = cart.length;

  if (loading) {
    return (
      <section id="baskets" className="baskets">
        <div className="container">
          <h2 className="section-title">Наши корзины</h2>
          <p style={{ textAlign: 'center', color: '#888' }}>Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="baskets" className="baskets">
      <div className="container">
        <h2 className="section-title">Наши корзины</h2>
        <div className="cart-info">
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-count">{cartCount}</span> товаров в корзине
        </div>

        <div className="baskets-grid">
          {baskets.map((basket) => (
            <div key={basket.id} className="basket-card fade-in">
              <div className="basket-image">
                <img src={basket.image} alt={basket.name} />
                <div className="basket-overlay">
                  <button
                    className={`btn add-to-cart add-to-cart-${basket.id}`}
                    onClick={() => addToCart(basket)}
                  >
                    <i className="fas fa-shopping-cart"></i> Добавить в заказ
                  </button>
                </div>
              </div>
              <div className="basket-content">
                <h3>{basket.name}</h3>
                <p>{basket.description}</p>
                <div className="basket-price">{basket.price} ₽</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .baskets { background-color: var(--white); }
        .cart-info { text-align: center; margin-bottom: 30px; font-size: 1.1rem; color: var(--primary-dark); }
        .cart-info i { margin-right: 10px; color: var(--primary-color); }
        .cart-count { display: inline-block; background-color: var(--secondary-color); color: white; width: 24px; height: 24px; border-radius: 50%; line-height: 24px; font-size: 0.9rem; margin-right: 5px; }
        .baskets-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
        .basket-card { background-color: var(--white); border-radius: 10px; overflow: hidden; box-shadow: var(--shadow); transition: var(--transition); }
        .basket-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); }
        .basket-image { position: relative; height: 200px; overflow: hidden; }
        .basket-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .basket-card:hover .basket-image img { transform: scale(1.1); }
        .basket-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(46, 125, 50, 0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition); }
        .basket-card:hover .basket-overlay { opacity: 1; }
        .basket-overlay .btn { background-color: var(--white); color: var(--primary-color); }
        .basket-overlay .btn:hover { background-color: var(--light-gray); }
        .basket-content { padding: 25px; }
        .basket-content h3 { margin-bottom: 10px; color: var(--primary-dark); }
        .basket-content p { margin-bottom: 15px; color: var(--text-color); opacity: 0.8; font-size: 0.95rem; }
        .basket-price { font-size: 1.5rem; font-weight: 700; color: var(--primary-color); }
        @media (max-width: 768px) { .baskets-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; } }
      `}</style>
    </section>
  );
};

export default Baskets;
