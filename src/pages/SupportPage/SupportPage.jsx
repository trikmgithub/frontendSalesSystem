import React, { useState } from "react";
import logo2 from '~/assets/logo2.png'
import "./support-page.css";

const faqs = [
  { id: 1, question: "Làm thế nào để đặt hàng?", answer: "Bạn có thể đặt hàng qua website hoặc ứng dụng của Hasaki." },
  { id: 2, question: "Chính sách đổi trả như thế nào?", answer: "Bạn có thể đổi trả trong vòng 7 ngày với điều kiện sản phẩm còn nguyên tem." },
  { id: 3, question: "Hasaki có giao hàng toàn quốc không?", answer: "Có, chúng tôi giao hàng trên toàn quốc." },
];

const SupportPage = () => {
  const [search, setSearch] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(faqs);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const results = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(query)
    );
    setFilteredFAQs(results);
    setSearch(query);
  };

  return (
    <div className="support-page">
      <header className="header">
        <img src={logo2} alt="Logo" className="logo" />
        <h1>Trang hỗ trợ khách hàng</h1>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="faq-list">
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>© 2025 Hasaki. Tất cả các quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default SupportPage;
