import React, { useState } from 'react';

const Baskets = () => {
  const [cart, setCart] = useState([]);
  
  const baskets = [
    {
      id: 1,
      name: 'Овощная корзина',
      description: 'Свежие сезонные овощи для здорового питания',
      price: 1490,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'Фруктовая корзина',
      description: 'Сочные фрукты и ягоды, богатые витаминами',
      price: 1790,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Полная корзина',
      description: 'Овощи, фрукты, зелень и фермерские продукты',
      price: 2490,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Вегетарианская',
      description: 'Растительные продукты для вегетарианцев',
      price: 1990,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  const addToCart = (basket) => {
    const newCart = [...cart, basket];
    setCart(newCart);
    localStorage.setItem('greenBasketCart', JSON.stringify(newCart));
    
    // Анимация добавления
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
        .baskets {
          background-color: var(--white);
        }
        
        .cart-info {
          text-align: center;
          margin-bottom: 30px;
          font-size: 1.1rem;
          color: var(--primary-dark);
        }
        
        .cart-info i {
          margin-right: 10px;
          color: var(--primary-color);
        }
        
        .cart-count {
          display: inline-block;
          background-color: var(--secondary-color);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          line-height: 24px;
          font-size: 0.9rem;
          margin-right: 5px;
        }
        
        .baskets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }
        
        .basket-card {
          background-color: var(--white);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }
        
        .basket-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .basket-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .basket-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .basket-card:hover .basket-image img {
          transform: scale(1.1);
        }
        
        .basket-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(46, 125, 50, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition);
        }
        
        .basket-card:hover .basket-overlay {
          opacity: 1;
        }
        
        .basket-overlay .btn {
          background-color: var(--white);
          color: var(--primary-color);
        }
        
        .basket-overlay .btn:hover {
          background-color: var(--light-gray);
        }
        
        .basket-content {
          padding: 25px;
        }
        
        .basket-content h3 {
          margin-bottom: 10px;
          color: var(--primary-dark);
        }
        
        .basket-content p {
          margin-bottom: 15px;
          color: var(--text-color);
          opacity: 0.8;
          font-size: 0.95rem;
        }
        
        .basket-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .baskets-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default Baskets;