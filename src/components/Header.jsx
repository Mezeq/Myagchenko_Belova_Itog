import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Главная', id: 'home' },
    { name: 'Как это работает', id: 'how-it-works' },
    { name: 'Преимущества', id: 'advantages' },
    { name: 'Корзины', id: 'baskets' },
    { name: 'Отзывы', id: 'reviews' },
    { name: 'Заказать', id: 'order' },
    { name: 'Контакты', id: 'contacts' }
  ];

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <i className="fas fa-leaf"></i>
            <span>Green Basket</span>
          </div>
          
          {/* Мобильное меню */}
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          {/* Навигация */}
          <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
            {menuItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`} 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="header-actions">
            <a href="#order" className="btn">Заказать</a>
          </div>
        </nav>
      </div>
      
      <style jsx>{`
        .header {
          background-color: var(--white);
          box-shadow: var(--shadow);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 15px 0;
        }
        
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-dark);
          transition: var(--transition);
        }
        
        .logo:hover {
          color: var(--primary-color);
          transform: scale(1.05);
        }
        
        .logo i {
          color: var(--primary-color);
        }
        
        .nav-list {
          display: flex;
          list-style: none;
          gap: 30px;
        }
        
        .nav-link {
          text-decoration: none;
          color: var(--text-color);
          font-weight: 500;
          padding: 5px 0;
          position: relative;
          transition: var(--transition);
        }
        
        .nav-link:hover {
          color: var(--primary-color);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--primary-color);
          cursor: pointer;
        }
        
        /* Адаптивность */
        @media (max-width: 992px) {
          .nav-list {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background-color: var(--white);
            flex-direction: column;
            align-items: center;
            padding: 20px;
            box-shadow: var(--shadow);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
          }
          
          .nav-list.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .nav-list li {
            width: 100%;
            text-align: center;
          }
          
          .nav-link {
            display: block;
            padding: 15px;
            border-bottom: 1px solid var(--light-gray);
          }
          
          .menu-toggle {
            display: block;
          }
        }
        
        @media (max-width: 576px) {
          .header-actions .btn {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;