import { Link } from 'react-router-dom'

function GameCard({ title, description, link }) {
  return (
    <div style={{
      background: "#121826",
      padding: "20px",
      borderRadius: "16px"
    }}>
      <h3>{title}</h3>

      <p style={{ color: "#9CA3AF" }}>
        {description}
      </p>

      <Link to={link}>
        <button style={{
          marginTop: "10px",
          background: "#7C3AED",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          Ver teste
        </button>
      </Link>
    </div>
  )
}

export default GameCard