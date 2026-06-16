import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactsPage() {
  return (
    <div className="static-page container">
      <h1>Контакты</h1>
      <div className="contacts-grid">
        <div className="contact-card card">
          <MapPin size={28} />
          <h3>Адрес</h3>
          <p>г. Москва, ул. Технологическая, д. 1</p>
          <p>Пн–Пт: 10:00–20:00, Сб–Вс: 11:00–18:00</p>
        </div>
        <div className="contact-card card">
          <Phone size={28} />
          <h3>Телефон</h3>
          <p>+7 (800) 555-35-35</p>
          <p>+7 (495) 123-45-67</p>
        </div>
        <div className="contact-card card">
          <Mail size={28} />
          <h3>Email</h3>
          <p>info@techstore.ru</p>
          <p>support@techstore.ru</p>
        </div>
        <div className="contact-card card">
          <Clock size={28} />
          <h3>Поддержка</h3>
          <p>Онлайн-чат: 24/7</p>
          <p>Ответ на email: до 2 часов</p>
        </div>
      </div>

      <form className="contact-form card" onSubmit={(e) => { e.preventDefault(); alert('Сообщение отправлено!'); }}>
        <h2>Напишите нам</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Имя</label>
            <input required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
        </div>
        <div className="form-group">
          <label>Сообщение</label>
          <textarea rows={4} required />
        </div>
        <button type="submit" className="btn btn-primary">Отправить</button>
      </form>
    </div>
  );
}
