import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Advantages from '../components/Advantages';
import Baskets from '../components/Baskets';
import Reviews from '../components/Reviews';
import FormsSection from '../components/FormsSection';
import Footer from '../components/Footer';

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('greenBasketToken');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const smoothScroll = (e) => {
      if (e.target.hash) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        }
      }
    };

    const menuToggle = document.getElementById('menuToggle');
    const navList = document.querySelector('.nav-list');
    const handleToggle = () => navList?.classList.toggle('active');
    if (menuToggle) menuToggle.addEventListener('click', handleToggle);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', smoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', smoothScroll);
      });
      if (menuToggle) menuToggle.removeEventListener('click', handleToggle);
    };
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <i className="fas fa-leaf"></i>
              <span>Green Basket</span>
            </div>
            <button className="menu-toggle" id="menuToggle" aria-label="Меню">
              <i className="fas fa-bars"></i>
            </button>
            <ul className="nav-list">
              <li><a href="#home" className="nav-link">Главная</a></li>
              <li><a href="#how-it-works" className="nav-link">Как это работает</a></li>
              <li><a href="#advantages" className="nav-link">Преимущества</a></li>
              <li><a href="#baskets" className="nav-link">Корзины</a></li>
              <li><a href="#reviews" className="nav-link">Отзывы</a></li>
              <li><a href="#order" className="nav-link">Заказать</a></li>
              <li><a href="#contacts" className="nav-link">Контакты</a></li>
            </ul>
            <div className="header-actions">
              {isAuthenticated ? (
                <Link to="/admin" className="btn">Админ-панель</Link>
              ) : (
                <Link to="/login" className="btn">Войти</Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <HowItWorks />
        <Advantages />
        <Baskets />
        <Reviews />
        <FormsSection />
      </main>
      <Footer />

      <style>{`
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
        }
        .logo i { color: var(--primary-color); }
        .nav-list {
          display: flex;
          list-style: none;
          gap: 30px;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          text-decoration: none;
          color: var(--text-color);
          font-weight: 500;
          padding: 5px 0;
          position: relative;
          transition: var(--transition);
        }
        .nav-link:hover { color: var(--primary-color); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .header-actions { display: flex; align-items: center; gap: 20px; }
        .menu-toggle { display: none; background: none; border: none; font-size: 1.5rem; color: var(--primary-color); cursor: pointer; }
        @media (max-width: 992px) {
          .nav-list {
            position: fixed;
            top: 70px; left: 0; right: 0;
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
          .nav-list li { width: 100%; text-align: center; }
          .nav-link {
            display: block;
            padding: 15px;
            border-bottom: 1px solid var(--light-gray);
          }
          .menu-toggle { display: block; }
        }
        @media (max-width: 576px) {
          .header-actions .btn { display: none; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
