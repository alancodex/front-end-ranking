import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    const fetchRanking = () => {
      axios.get('http://localhost:5000/api/ranking')
        .then(response => {
          const jogadoresFiltrados = response.data.filter(jogador =>
            jogador.nickname &&  // nickname não pode estar vazio
            !["teste", "sem nome", "anonimo"].includes(jogador.nickname.toLowerCase())  // nomes a excluir
          )

          const ordenado = [...jogadoresFiltrados].sort((a, b) => b.tickets - a.tickets)
          setRanking(ordenado)
        })
        .catch(error => console.error('Erro ao buscar ranking:', error))
    }

    fetchRanking() // busca imediata

    const interval = setInterval(fetchRanking, 10000) // atualiza a cada 10s

    return () => clearInterval(interval) // limpa o intervalo se desmontar
  }, [])

  return (
    <div className="container">
      <h1>🏁 Ranking dos Funcionários</h1>
      <div className="pista">
        {ranking.map((jogador, index) => {
          let medalha = ''
          if (index === 0) medalha = '🥇'
          else if (index === 1) medalha = '🥈'
          else if (index === 2) medalha = '🥉'

          return (
            <div key={jogador.id} className={`carro-container ${index === 0 ? 'ouro' : index === 1 ? 'prata' : index === 2 ? 'bronze' : ''}`}>
              <div className="ranking-posicao">{index + 1}º {medalha}</div>
              <div className="nickname">{jogador.nickname}</div>
              <div className="carro">🚗</div>
              <div className={`container-ticket`}>
                <div className="tickets2">tickets: </div>
                <div className="tickets">{'     ' + jogador.tickets}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
