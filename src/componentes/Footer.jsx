import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">
          <img src="/logo.png" alt="JMarinho" />
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} JMarinho. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer