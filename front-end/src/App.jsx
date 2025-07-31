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
import livre from './img/livre.jpg'


function App() {
  const [ranking, setRanking] = useState([])
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null)
  const [mostrarLoja, setMostrarLoja] = useState(false)
  const [senhaPremiacao, setSenhaPremiacao] = useState('')
  const [mostrarPremiacao, setMostrarPremiacao] = useState(false)
  const [tituloPremiacao, setTituloPremiacao] = useState('🏆 Parabéns aos campeões!')
  const [imagemPremiacao, setImagemPremiacao] = useState('https://i.imgur.com/0Z6P9oN.png')

  const [modoEdicao, setModoEdicao] = useState(false)
  const [senhaEdicao, setSenhaEdicao] = useState('')
  const [senhaConfirmada, setSenhaConfirmada] = useState(false)

  const [novoTitulo, setNovoTitulo] = useState('')
  const [novaImagem, setNovaImagem] = useState('')



  const [dataDe, setDataDe] = useState(() => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  })

  const [dataAte, setDataAte] = useState(() => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  })

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
    'Lustosa': 'Telefônico', 'Tulio': 'Telefônico', 'Izabelly': 'Whatsapp Nivel 1',
    'Joao': 'Whatsapp Nivel 1', 'Vitor': 'Whatsapp Nivel 1', 'Erico': 'Whatsapp Nivel 2',
    'Alesson': 'Whatsapp Nivel 2', 'Jeiel': 'Whatsapp Nivel 1', 'Alves': 'Whatsapp Nivel 1',
    'Leo Rosa': 'Whatsapp Nivel 1', 'Clebson': 'Whatsapp Nivel 2',
  }

  const nomeCarro = {
    'Alan': 'mazda', 'Leo Rosa': 'impala', 'Alesson': 'palio',
    'Joao': 's10', 'Vitor': 'skyline', 'Karol': 'mustang', 'Izabelly': 'delrey',
  }

  const carros = {
    'Alan': mazda, 'Leo Rosa': impala, 'Alesson': palio, 'Joao': s10,
    'Vitor': skyline, 'Karol': mustang, 'Izabelly': delrey,
  }

  const formatarDataParaBR = (dataISO) => {
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}/${mes}/${ano}`
  }

  const fetchRanking = () => {
    axios.get('https://back-end-ranking.onrender.com/api/ranking', {
      params: {
        de: formatarDataParaBR(dataDe),
        ate: formatarDataParaBR(dataAte)
      }
    })
      .then(response => {
        const jogadoresFiltrados = response.data.filter(jogador =>
          jogador.nickname && !['lemos', 'gerson', 'leonardo', 'wandson', 'gabi', 'athus', 'brum', 'karl', 'natália']
            .includes(jogador.nickname.toLowerCase())
        ).map(jogador => {
          const isTelefonico = funcoes[jogador.nickname] === 'Telefônico'
          const ticketsComBonus = isTelefonico ? jogador.tickets : jogador.tickets
          return { ...jogador, ticketsComBonus }
        })

        const ordenado = [...jogadoresFiltrados].sort((a, b) => b.ticketsComBonus - a.ticketsComBonus)
        setRanking(ordenado)
      })
      .catch(error => console.error('Erro ao buscar ranking:', error))
  }

  useEffect(() => {
    const tituloSalvo = localStorage.getItem('tituloPremiacao')
    const imagemSalva = localStorage.getItem('imagemPremiacao')

    if (tituloSalvo) setTituloPremiacao(tituloSalvo)
    if (imagemSalva) setImagemPremiacao(imagemSalva)
  }, [])


  useEffect(() => {
    fetchRanking()
    const intervalo = setInterval(() => {
      fetchRanking()
    }, 30000)
    return () => clearInterval(intervalo)
  }, [dataDe, dataAte])

  useEffect(() => {
    const hoje = new Date()
    let dataAtual = hoje.toDateString()

    const intervaloDia = setInterval(() => {
      const novaData = new Date().toDateString()
      if (novaData !== dataAtual) {
        const novoHoje = new Date()
        const ano = novoHoje.getFullYear()
        const mes = String(novoHoje.getMonth() + 1).padStart(2, '0')
        const dia = String(novoHoje.getDate()).padStart(2, '0')
        const novaDataFormatada = `${ano}-${mes}-${dia}`

        setDataDe(novaDataFormatada)
        setDataAte(novaDataFormatada)
        fetchRanking()
        dataAtual = novaData
      }
    }, 60000)

    return () => clearInterval(intervaloDia)
  }, [])

  const totalGeralTickets = ranking.reduce((acc, jogador) => acc + jogador.ticketsComBonus, 0)

  const totaisPorSetor = ranking.reduce((acc, jogador) => {
    const setor = funcoes[jogador.nickname] || 'Não informada'
    if (!acc[setor]) acc[setor] = 0
    acc[setor] += jogador.ticketsComBonus
    return acc
  }, {})

  const fullText = 'Desenvolvido por Alan Sobral'
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(fullText.substring(0, index + 1))
        setIndex((prev) => prev + 1)
        if (index + 1 === fullText.length) {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        setText(fullText.substring(0, index - 1))
        setIndex((prev) => prev - 1)
        if (index === 0) {
          setIsDeleting(false)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [index, isDeleting, fullText])

  return (
    <div className="container">


      <div className='container2'>
        <div>
          <h1>🏁 Ranking dos Colaboradores</h1>
        </div>
        <div style={{ marginBottom: '2rem' }} className='filtro-data'>
          <label>
            De:
            <input
              type="date"
              name="de"
              value={dataDe}
              onChange={e => setDataDe(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>

          <label style={{ marginLeft: '1rem' }}>
            Até:
            <input
              type="date"
              name="ate"
              value={dataAte}
              onChange={e => setDataAte(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>

          <button onClick={fetchRanking} style={{ marginLeft: '1rem' }} className='botao'>
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
                <div className="tickets">
                  {`${Math.round(jogador.ticketsComBonus)} km`}
                </div>
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
            <p><strong>📏Quilometragem:</strong> {Math.round(jogadorSelecionado.ticketsComBonus)} km</p>
            <p><strong>🪙Pontos:</strong> {jogadorSelecionado.pontos}</p>
          </div>
        </div>
      )}
      <div className="linha-podios">
        {/* Pódio Geral */}
        <div className="podio">
          <p className="premiacao-texto">🎁 1º lugar geral: 1 dia de Folga</p>
          <h3>🏆 Pódio Geral</h3>
          {ranking.slice(0, 3).map((jogador, index) => (
            <div key={jogador.id} className="podio-item">
              <span>{index + 1}º 🏅</span> {jogador.nickname} ({jogador.pontos})
            </div>
          ))}
        </div>



        {["Whatsapp Nivel 1", "Whatsapp Nivel 2", "Telefônico"].map(tipo => {
          const premiacoes = {
            "Whatsapp Nivel 1": "🎁 1º lugar: Lata de pitú",
            "Whatsapp Nivel 2": "🎁 1º lugar: Coxinha",
            "Telefônico": "🎁 1º lugar: 1 dia de folga"
          }

          const titulo = {
            "Whatsapp Nivel 1": "📱 WhatsApp Nível 1",
            "Whatsapp Nivel 2": "⚙️ WhatsApp Nível 2",
            "Telefônico": "📞 Telefônico"
          }[tipo]
          const top3 = ranking
            .filter(j => funcoes[j.nickname] === tipo)
            .sort((a, b) => b.pontos - a.pontos)
            .slice(0, 3)
          return (
            <div key={tipo} className="podio">
              <p className="premiacao-texto">{premiacoes[tipo]}</p>
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

      {/* TOTALIZADORES ABAIXO DOS PÓDIOS */}
      <div className="totalizadores">
        <div className="total-geral">
          <strong>Total Geral:</strong> {Math.round(totalGeralTickets)} km
        </div>
        <br />
        <div className="setores-totais">
          {Object.entries(totaisPorSetor).map(([setor, total]) => (
            <div key={setor} className="setor-total">
              <strong>{setor}:</strong> {Math.round(total)} km
            </div>
          ))}
        </div>
      </div>


      <div>
        <h1 style={{ fontFamily: 'monospace' }} className='criadores'>
          {text}
          <span className="cursor">|</span>
        </h1>
      </div>
    </div>
  )
}

export default App
