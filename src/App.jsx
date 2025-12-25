import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Advantages from './components/Advantages';
import Baskets from './components/Baskets';
import Reviews from './components/Reviews';
import FormsSection from './components/FormsSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Плавная прокрутка к якорям
  useEffect(() => {
    const smoothScroll = (e) => {
      if (e.target.hash) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    // Добавляем обработчики для всех ссылок с якорями
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', smoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', smoothScroll);
      });
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Advantages />
        <Baskets />
        <Reviews />
        <FormsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;