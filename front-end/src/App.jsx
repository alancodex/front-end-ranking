// App.js
import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

import impala from './img/impala.png'
import palio from './img/palio-verde.png'
import s10 from './img/s10.png'
import delrey from './img/delrey.png'
import skyline from './img/skyline.png'
import mazda from './img/mazda.png'
import mustang from './img/mustang.png'
import defaultCar from './img/default.png'
import loja from './img/loja.png'

function App() {
  const [ranking, setRanking] = useState([])
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null)
  const [mostrarLoja, setMostrarLoja] = useState(false)
  const [dataDe, setDataDe] = useState('01/07/2025')
  const [dataAte, setDataAte] = useState('01/07/2025')

  const alturaPorCarro = {
    [impala]: 50, [delrey]: 50, [palio]: 50,
    [mustang]: 50, [skyline]: 50, [s10]: 50,
    [mazda]: 50, [defaultCar]: 50,
  }

  const larguraPorCarro = {
    [impala]: 70, [mazda]: 70, [mustang]: 70,
    [delrey]: 70, [palio]: 70, [skyline]: 70,
    [s10]: 80, [defaultCar]: 70,
  }

  const funcoes = {
    'Alan': 'Telefônico', 'Karol': 'Telefônico', 'Alex Aquino': 'Telefônico',
    'Lustosa': 'Telefônico', 'Tulio': 'Telefônico', 'Izabelly': 'Whatsapp',
    'Joao': 'Whatsapp', 'Vitor': 'Whatsapp', 'Erico': 'Whatsapp Nivel 2',
    'Alesson': 'Whatsapp Nivel 2', 'Jeiel': 'Whatsapp', 'Alves': 'Whatsapp',
    'Leo Rosa': 'Whatsapp', 'Clebson': 'Whatsapp Nivel 2',
  }

  const nomeCarro = {
    'Alan': 'mazda', 'Leo Rosa': 'impala', 'Alesson': 'palio',
    'Joao': 's10', 'Vitor': 'skyline', 'Karol': 'mustang', 'Izabelly': 'delrey',
  }

  const carros = {
    'Alan': mazda, 'Leo Rosa': impala, 'Alesson': palio, 'Joao': s10,
    'Vitor': skyline, 'Karol': mustang, 'Izabelly': delrey,
  }

  const fetchRanking = () => {
    axios.get('https://back-end-ranking.onrender.com/api/ranking', {
      params: { de: dataDe, ate: dataAte }
    })
      .then(response => {
        const jogadoresFiltrados = response.data.filter(jogador =>
          jogador.nickname && !['lemos', 'gerson', 'leonardo', 'wandson', 'gabi', 'athus', 'brum', 'karl', 'natália']
            .includes(jogador.nickname.toLowerCase())
        )
        const ordenado = [...jogadoresFiltrados].sort((a, b) => b.tickets - a.tickets)
        setRanking(ordenado)
      })
      .catch(error => console.error('Erro ao buscar ranking:', error))
  }

  function handleDataInput(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }

    e.target.value = value;

    // Atualiza o state correto
    if (e.target.name === 'de') {
      setDataDe(value);
    } else {
      setDataAte(value);
    }
  }


  useEffect(() => {
    fetchRanking()
  }, [])

  return (
    <div className="container">
      <div className='container2'>
        <button className="botao-loja" onClick={() => setMostrarLoja(true)}>
          <img src={loja} alt="" className='compra' />
        </button>
      </div>

      {/* Filtro de datas */}
      <div className='container2'>
        <div>
          <h1>🏁 Ranking dos Colaboradores</h1>
        </div>
        <div style={{ marginBottom: '2rem' }} className='filtro-data'>
          <label>
            De:
            <input
              type="text"
              name="de"
              value={dataDe}
              onChange={e => setDataDe(e.target.value)}
              onInput={handleDataInput}
              maxLength={10}
              placeholder="dd/mm/aaaa"
              style={{ marginLeft: '0.5rem' }}
            />
          </label>

          <label style={{ marginLeft: '1rem' }}>
            Até:
            <input
              type="text"
              name="ate"
              value={dataAte}
              onChange={e => setDataAte(e.target.value)}
              onInput={handleDataInput}
              maxLength={10}
              placeholder="dd/mm/aaaa"
              style={{ marginLeft: '0.5rem' }}
            />
          </label>

          <button onClick={() => fetchRanking(dataDe, dataAte)} style={{ marginLeft: '1rem' }} className='botao'>
            Filtrar
          </button>
        </div>
      </div>

      <div className="pista">
        {ranking.map((jogador, index) => {
          let medalha = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''
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
                  style={{
                    width: `${larguraPorCarro[carros[jogador.nickname] || defaultCar]}px`,
                    height: `${alturaPorCarro[carros[jogador.nickname] || defaultCar]}px`
                  }}
                />
              </div>
              <div className="container-ticket">
                <div className="tickets2">📏</div>
                <div className="tickets">{jogador.tickets} km</div>
              </div>
            </div>
          )
        })}
      </div>

      {jogadorSelecionado && (
        <div className="jogador-card">
          <div className="card-conteudo">
            <button onClick={() => setJogadorSelecionado(null)}>✖</button>
            <h2>Informações do Jogador</h2>
            <p><strong>👤Nome:</strong> {jogadorSelecionado.nickname}</p>
            <p><strong>🚘Carro:</strong> {nomeCarro[jogadorSelecionado.nickname] || "Ferrari"}</p>
            <img
              src={carros[jogadorSelecionado.nickname] || defaultCar}
              alt="Carro"
              className="carro"
              style={{
                width: `${larguraPorCarro[carros[jogadorSelecionado.nickname] || defaultCar]}px`,
                height: `${alturaPorCarro[carros[jogadorSelecionado.nickname] || defaultCar]}px`
              }}
            />
            <p><strong>🔧Atendimento:</strong> {funcoes[jogadorSelecionado.nickname] || "Não informada"}</p>
            <p><strong>✉️Tickets:</strong> {jogadorSelecionado.tickets}</p>
            <p><strong>📏Quilometragem:</strong> {jogadorSelecionado.tickets} km</p>
            <p><strong>🪙Pontos:</strong> {jogadorSelecionado.pontos}</p>
          </div>
        </div>
      )}

      <div className="linha-podios">
        <div className="podio">
          <h3>🏆 Pódio Geral</h3>
          {ranking.slice(0, 3).map((jogador, index) => (
            <div key={jogador.id} className="podio-item">
              <span>{index + 1}º 🏅</span> {jogador.nickname} ({jogador.pontos})
            </div>
          ))}
        </div>

        {["Whatsapp", "Whatsapp Nivel 2", "Telefônico"].map(tipo => {
          const titulo = {
            "Whatsapp": "📱 WhatsApp Nível 1",
            "Whatsapp Nivel 2": "⚙️ WhatsApp Nível 2",
            "Telefônico": "📞 Telefônico"
          }[tipo]
          const top3 = ranking
            .filter(j => funcoes[j.nickname] === tipo)
            .sort((a, b) => b.pontos - a.pontos)
            .slice(0, 3)
          return (
            <div key={tipo} className="podio">
              <h3>{titulo}</h3>
              {top3.map((jogador, index) => (
                <div key={jogador.id} className="podio-item">
                  <span>{index + 1}º 🏅</span> {jogador.nickname} ({jogador.pontos})
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {mostrarLoja && (
        <div className="telinha-loja">
          <div className="conteudo-loja">
            <button className="fechar-loja" onClick={() => setMostrarLoja(false)}>✖</button>
            <h2>Loja</h2>
            <div className="itens-loja">
              <button className="item-loja">🧪 <strong>Nitro</strong> – Quilometragem bônus</button>
              <button className="item-loja">🔫 <strong>Arma</strong> – Repassa um ticket</button>
              <button className="item-loja">💥 <strong>Munição</strong> – Tickets que pode repassar</button>
              <button className="item-loja">🛡️ <strong>Proteção</strong> – Bloqueia ataques</button>
              <button className="item-loja">🧰 <strong>Pitstop</strong> – Tempo de folga</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App