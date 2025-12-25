import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (email && /\S+@\S+\.\S+/.test(email)) {
      // Сохраняем в localStorage
      const subscriptions = JSON.parse(localStorage.getItem('greenBasketSubscriptions') || '[]');
      subscriptions.push({ email, date: new Date().toISOString() });
      localStorage.setItem('greenBasketSubscriptions', JSON.stringify(subscriptions));
      
      setIsSubscribed(true);
      setEmail('');
      
      // Сбросить сообщение через 3 секунды
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer id="contacts" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-leaf"></i>
              <span>Green Basket</span>
            </div>
            <p className="footer-description">
              Доставляем свежие фермерские продукты прямо к вашему столу. 
              Поддерживаем локальных производителей и заботимся о вашем здоровье.
            </p>
            <div className="social-links">
              <a href="#!" className="social-link" aria-label="ВКонтакте">
                <i className="fab fa-vk"></i>
              </a>
              <a href="#!" className="social-link" aria-label="Telegram">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#!" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#!" className="social-link" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Контакты</h3>
            <ul className="contact-list">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>г. Москва, ул. Фермерская, д. 15</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <a href="tel:+79991234567">+7 (999) 123-45-67</a>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:info@greenbasket.ru">info@greenbasket.ru</a>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span>Ежедневно с 9:00 до 21:00</span>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Быстрые ссылки</h3>
            <ul className="footer-links">
              <li><a href="#home">Главная</a></li>
              <li><a href="#how-it-works">Как это работает</a></li>
              <li><a href="#baskets">Корзины</a></li>
              <li><a href="#order">Оформить заказ</a></li>
              <li><a href="#contacts">Контакты</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Подписаться на рассылку</h3>
            <p>Узнавайте первыми о новых продуктах и акциях</p>
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
            {isSubscribed && (
              <p className="subscribe-success">Спасибо за подписку!</p>
            )}
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Green Basket. Все права защищены.</p>
          <p>
            <a href="#!">Политика конфиденциальности</a> | 
            <a href="#!"> Пользовательское соглашение</a>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: var(--primary-dark);
          color: var(--white);
          padding: 60px 0 20px;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 50px;
        }
        
        .footer-section h3 {
          color: var(--white);
          margin-bottom: 20px;
          font-size: 1.3rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        .footer-logo i {
          color: var(--primary-light);
        }
        
        .footer-description {
          margin-bottom: 20px;
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .social-links {
          display: flex;
          gap: 15px;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: var(--white);
          font-size: 1.2rem;
          transition: var(--transition);
        }
        
        .social-link:hover {
          background-color: var(--primary-light);
          transform: translateY(-3px);
        }
        
        .contact-list {
          list-style: none;
        }
        
        .contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 15px;
        }
        
        .contact-list i {
          color: var(--primary-light);
          margin-top: 3px;
        }
        
        .contact-list a {
          color: var(--white);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .contact-list a:hover {
          color: var(--primary-light);
        }
        
        .footer-links {
          list-style: none;
        }
        
        .footer-links li {
          margin-bottom: 12px;
        }
        
        .footer-links a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .footer-links a:hover {
          color: var(--primary-light);
          padding-left: 5px;
        }
        
        .subscribe-form {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .subscribe-form input {
          flex: 1;
          padding: 12px 15px;
          border: none;
          border-radius: 5px;
          font-family: inherit;
        }
        
        .subscribe-form input:focus {
          outline: none;
          box-shadow: 0 0 0 2px var(--primary-light);
        }
        
        .subscribe-form .btn {
          padding: 12px 20px;
          background-color: var(--secondary-color);
        }
        
        .subscribe-form .btn:hover {
          background-color: #e68900;
        }
        
        .subscribe-success {
          margin-top: 10px;
          color: var(--primary-light);
          font-weight: 500;
        }
        
        .footer-bottom {
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          opacity: 0.8;
        }
        
        .footer-bottom p {
          margin-bottom: 10px;
        }
        
        .footer-bottom a {
          color: var(--white);
          text-decoration: none;
          margin: 0 5px;
          transition: var(--transition);
        }
        
        .footer-bottom a:hover {
          color: var(--primary-light);
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .subscribe-form {
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;