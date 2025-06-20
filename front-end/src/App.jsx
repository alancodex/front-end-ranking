import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Importação das imagens
import impala from './img/impala.png'
import palio from './img/palio-verde.png'
import s10 from './img/s10.png'

import defaultCar from './img/default.png'

function App() {
  const [ranking, setRanking] = useState([])
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null)

  const alturaPorCarro = {
  [impala]: 50,
  [palio]: 50,
  [s10]: 50,
  [defaultCar]: 50,
}

  const larguraPorCarro = {
  [impala]: 70,
  [palio]: 70,
  [s10]: 80,
  [defaultCar]: 70,
}


  // Funções de cada jogador
  const funcoes = {
    'Alan': 'Telefônico',
    'Karol': 'Telefônico',
    'Alex Aquino': 'Telefônico',
    'Lustosa': 'Telefônico',
    'Tulio': 'Telefônico',
    'Izabelly': 'Whatsapp',
    'Joao': 'Whatsapp',
    'Vitor': 'Whatsapp',
    'Erico': 'Whatsapp Nivel 2',
    'Alesson': 'Whatsapp Nivel 2',
    'Jeiel': 'Whatsapp',
    'Alves': 'Whatsapp',
    'Leo Rosa': 'Whatsapp',
    'Clebson': 'Whatsapp Nivel 2',
  }

  // Carros de cada jogador
  const carros = {
    'Alan': impala,
    'Leo Rosa': impala,
    'Alesson': palio,
    'Joao': s10
    // outros nomes...
  }

  useEffect(() => {
    const fetchRanking = () => {
      axios.get('https://back-end-ranking.onrender.com/api/ranking')
        .then(response => {
          const jogadoresFiltrados = response.data.filter(jogador =>
            jogador.nickname &&
            !['lemos', 'gerson', 'leonardo', 'wandson', 'gabi', 'athus'].includes(jogador.nickname.toLowerCase())
          )

          const ordenado = [...jogadoresFiltrados].sort((a, b) => b.tickets - a.tickets)
          setRanking(ordenado)
        })
        .catch(error => console.error('Erro ao buscar ranking:', error))
    }

    fetchRanking()
    const interval = setInterval(fetchRanking, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container">
      <h1>🏁 Ranking dos Colaboradores</h1>

      <div className="pista">
        {ranking.map((jogador, index) => {
          let medalha = ''
          if (index === 0) medalha = '🥇'
          else if (index === 1) medalha = '🥈'
          else if (index === 2) medalha = '🥉'

          return (
            <div
              key={jogador.id}
              onClick={() => setJogadorSelecionado(jogador)}
              style={{ cursor: 'pointer' }}
              className={`carro-container ${index === 0 ? 'ouro' : index === 1 ? 'prata' : index === 2 ? 'bronze' : ''}`}
            >
              <div className="ranking-posicao">{index + 1}º {medalha}</div>
              <div className="nickname">{jogador.nickname}</div>
              <div>
                <img
                  src={carros[jogador.nickname] || defaultCar}
                  alt="Carro"
                  className="carro"
                  style={{ width: `${larguraPorCarro[carros[jogador.nickname] || defaultCar]}px`, 
                  height: `${alturaPorCarro[carros[jogador.nickname] || defaultCar]}px` }}
                />
              </div>
              <div className="container-ticket">
                <div className="tickets2">🪙</div>
                <div className="tickets">{jogador.pontos}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Card de informações */}
      {jogadorSelecionado && (
        <div className="jogador-card">
          <div className="card-conteudo">
            <button onClick={() => setJogadorSelecionado(null)}>✖</button>
            <h2>Informações do Jogador</h2>
            <p><strong>👤Nome:</strong> {jogadorSelecionado.nickname}</p>
            <p><strong>✉️Tickets:</strong> {jogadorSelecionado.tickets}</p>
            <p><strong>🔧Atendimento:</strong> {funcoes[jogadorSelecionado.nickname] || "Não informada"}</p>
            <p><strong>🪙Pontos:</strong> {jogadorSelecionado.pontos}</p>
          </div>
        </div>
      )}

      {/* Linha de Pódios por Função */}
      <div className="linha-podios">
        {["Whatsapp", "Whatsapp Nivel 2", "Telefônico"].map(tipo => {
          const titulo = {
            "Whatsapp": "📱 WhatsApp Nível 1",
            "Whatsapp Nivel 2": "⚙️ WhatsApp Nível 2",
            "Telefônico": "📞 Telefônico",
            "Geral": "📱 WhatsApp Nível 1" && "⚙️ WhatsApp Nível 2" && "📞 Telefônico"
          }[tipo]

          const top3 = ranking
            .filter(j => funcoes[j.nickname] === tipo)
            .sort((a, b) => b.pontos - a.pontos)
            .slice(0, 3)

          return (
            <div key={tipo} className="podio">
              <h3>{titulo}</h3>
              {top3.map((jogador, index) => (
                <div key={jogador.id} className={"podio-item"} >
                  <span>{index + 1}º 🏅</span> {jogador.nickname} ({jogador.pontos})

                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
