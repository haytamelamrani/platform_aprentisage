"use client"

import { useState, useEffect } from "react"
import "../styles/CssPrincessGame.css"


// Import des images
import doorImage from "../assets/door.png"
import princessImage from "../assets/princess.png"
import mouseImage from "../assets/mouse.png"
import perocesImage from "../assets/peroces.png"
import pirateImage from "../assets/pirate.png"

const CssPrincessGame = () => {
  const [cssCommand, setCssCommand] = useState("")
  const [appliedCSS, setAppliedCSS] = useState({})
  const [message, setMessage] = useState(null)
  const [level, setLevel] = useState(1)
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState(false)
  const [history, setHistory] = useState([])
  const [isCollision, setIsCollision] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [chasersPosition, setChasersPosition] = useState({ pirate: 0, peroces: 0 })

  // Configuration des niveaux
  const levels = [
    {
      id: 1,
      title: "Fuite vers la droite",
      description: "Aidez la princesse et sa souris à fuir vers la porte à droite",
      hint: "Utilisez 'justify-content: flex-end' pour déplacer nos héros vers la droite",
      solution: ["justify-content: flex-end", "justify-content:flex-end"],
      story: "🏰 La princesse et sa fidèle souris doivent s'échapper ! Le pirate les poursuit. Vite, vers la porte !",
      initialCSS: { display: "flex", "justify-content": "flex-start", "align-items": "center" },
      doorPosition: { right: "10px", top: "50%", transform: "translateY(-50%)" },
      chasers: ["pirate"],
    },
    {
      id: 2,
      title: "Escalade vers le haut",
      description: "Montez vers la porte en haut pour échapper aux chasseurs",
      hint: "Utilisez 'align-items: flex-start' pour monter vers le haut",
      solution: ["align-items: flex-start", "align-items:flex-start"],
      story: "🪜 Les chasseurs arrivent par le bas ! La princesse et la souris doivent grimper vers la porte du haut !",
      initialCSS: { display: "flex", "justify-content": "center", "align-items": "flex-end" },
      doorPosition: { top: "10px", left: "50%", transform: "translateX(-50%)" },
      chasers: ["peroces"],
    },
    {
      id: 3,
      title: "Refuge au centre",
      description: "Trouvez refuge au centre, loin des chasseurs dans les coins",
      hint: "Utilisez 'justify-content: center' et 'align-items: center'",
      solution: ["justify-content: center", "justify-content:center"],
      story: "🎯 Les chasseurs sont dans tous les coins ! Seul le centre est sûr. La porte magique vous y attend !",
      initialCSS: { display: "flex", "justify-content": "flex-start", "align-items": "flex-start" },
      doorPosition: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      chasers: ["pirate", "peroces"],
    },
    {
      id: 4,
      title: "Changement de direction",
      description: "Changez de stratégie ! Utilisez la direction colonne",
      hint: "Utilisez 'flex-direction: column' pour changer l'axe principal",
      solution: ["flex-direction: column", "flex-direction:column"],
      story: "🔄 Les chasseurs bloquent le chemin horizontal ! Changez de direction pour atteindre la porte !",
      initialCSS: {
        display: "flex",
        "justify-content": "center",
        "align-items": "flex-start",
        "flex-direction": "row",
      },
      doorPosition: { bottom: "10px", left: "50%", transform: "translateX(-50%)" },
      chasers: ["pirate"],
    },
    {
      id: 5,
      title: "Contournement tactique",
      description: "Utilisez flex-wrap pour contourner les obstacles",
      hint: "Utilisez 'flex-wrap: wrap' pour contourner les chasseurs",
      solution: ["flex-wrap: wrap", "flex-wrap:wrap"],
      story: "🌊 Les chasseurs bloquent le passage direct ! Contournez-les avec une manœuvre tactique !",
      initialCSS: {
        display: "flex",
        "flex-direction": "row",
        "justify-content": "flex-start",
        "align-items": "flex-start",
      },
      doorPosition: { bottom: "10px", right: "10px" },
      chasers: ["pirate", "peroces"],
    },
    {
      id: 6,
      title: "L'évasion finale",
      description: "Dernière épreuve ! Inversez tout pour échapper définitivement !",
      hint: "Utilisez 'flex-direction: column-reverse' pour l'évasion finale",
      solution: ["flex-direction: column-reverse", "flex-direction:column-reverse"],
      story: "🏃‍♀️ C'est l'évasion finale ! Tous les chasseurs vous poursuivent ! Inversez tout pour vous échapper !",
      initialCSS: { display: "flex", "justify-content": "center", "align-items": "flex-start" },
      doorPosition: { top: "10px", left: "50%", transform: "translateX(-50%)" },
      chasers: ["pirate", "peroces"],
    },
  ]

  // Animation des chasseurs
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime((prev) => prev + 1)
      setChasersPosition((prev) => ({
        pirate: (prev.pirate + 2) % 100,
        peroces: (prev.peroces + 1.5) % 100,
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Initialiser le CSS du niveau actuel
  useEffect(() => {
    const currentLevel = levels[level - 1]
    setAppliedCSS(currentLevel.initialCSS)
    setMessage(null)
    setShowHint(false)
    setCssCommand("")
    setGameTime(0)
    setChasersPosition({ pirate: 0, peroces: 0 })
  }, [level])

  // Vérifier si la princesse a atteint la porte
  useEffect(() => {
    const checkCollision = () => {
      const princess = document.querySelector(".css-princess")
      const door = document.querySelector(".css-door")

      if (!princess || !door) return false

      const princessRect = princess.getBoundingClientRect()
      const doorRect = door.getBoundingClientRect()

      const collision = !(
        princessRect.right < doorRect.left ||
        princessRect.left > doorRect.right ||
        princessRect.bottom < doorRect.top ||
        princessRect.top > doorRect.bottom
      )

      return collision
    }

    const timer = setTimeout(() => {
      const collision = checkCollision()
      setIsCollision(collision)

      if (collision) {
        if (level === levels.length) {
          setSolved(true)
          setMessage({
            type: "success",
            text: "🎉 VICTOIRE ! La princesse et sa souris ont échappé à tous les chasseurs ! Elles sont libres !",
          })
        } else {
          setMessage({
            type: "success",
            text: "✅ Évasion réussie ! La princesse et sa souris sont en sécurité ! Niveau suivant !",
          })
        }
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [appliedCSS, level])

  // Appliquer la commande CSS
  const applyCSS = () => {
    if (!cssCommand.trim()) {
      setMessage({ type: "error", text: "Veuillez entrer une commande CSS pour aider nos héros !" })
      return
    }

    try {
      const [property, value] = cssCommand.split(":").map((part) => part.trim())

      if (!property || !value) {
        throw new Error("Format CSS invalide. Utilisez 'propriété: valeur'")
      }

      const newCSS = { ...appliedCSS, [property]: value.replace(";", "") }
      setAppliedCSS(newCSS)
      setHistory((prev) => [...prev, cssCommand])

      const currentLevel = levels[level - 1]
      if (currentLevel.solution.some((sol) => cssCommand.includes(sol))) {
        setMessage({ type: "info", text: "Bonne direction ! Aidez-les à atteindre la porte !" })
      } else {
        setMessage({ type: "info", text: "Commande appliquée ! Continuez à aider nos héros !" })
      }
    } catch (error) {
      setMessage({ type: "error", text: `Erreur: ${error.message}` })
    }
  }

  const nextLevel = () => {
    if (level < levels.length) {
      setLevel((prev) => prev + 1)
      setIsCollision(false)
    }
  }

  const resetGame = () => {
    setLevel(1)
    setCssCommand("")
    setAppliedCSS(levels[0].initialCSS)
    setMessage(null)
    setSolved(false)
    setShowHint(false)
    setHistory([])
    setIsCollision(false)
    setGameTime(0)
    setChasersPosition({ pirate: 0, peroces: 0 })
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      applyCSS()
    }
  }

  const currentLevel = levels[level - 1]

  return (
    <div className="css-game-container">
      <div className="css-game-header">
        <h1 className="css-game-title">🏰 La Grande Évasion CSS !</h1>
        <div className="css-level-info">
          <span className="css-level-badge">
            Niveau {level}/{levels.length}
          </span>
          <span className="css-level-title">{currentLevel.title}</span>
        </div>
      </div>

      <div className="css-game-content">
        <div className="css-game-left-panel">
          <div className="css-console-header">
            <h2 className="css-console-title">💻 Console de Sauvetage CSS</h2>
            <div className="css-level-description">{currentLevel.description}</div>
          </div>

          <div className="css-input-container">
            <div className="css-input-label">.css-heroes-container {`{`}</div>
            <div className="css-input-applied">
              {Object.entries(appliedCSS).map(([prop, value]) => (
                <div key={prop} className="css-property-line">
                  <span className="css-property">{prop}:</span> <span className="css-value">{value};</span>
                </div>
              ))}
            </div>
            <div className="css-input-wrapper">
              <input
                type="text"
                value={cssCommand}
                onChange={(e) => setCssCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Entrez une propriété CSS pour sauver nos héros ! (ex: justify-content: center)"
                className="css-input-field"
              />
            </div>
            <div className="css-input-label">{`}`}</div>
          </div>

          <div className="css-button-group">
            <button onClick={() => setShowHint(!showHint)} className="css-hint-button">
              {showHint ? "🙈 Cacher l'indice" : "💡 Indice de sauvetage"}
            </button>
            <button onClick={resetGame} className="css-reset-button">
              🔄 Nouvelle évasion
            </button>
            <button onClick={applyCSS} className="css-apply-button">
              🚀 Sauver nos héros !
            </button>
          </div>

          {showHint && (
            <div className="css-hint-box">
              <h4 className="css-hint-title">💡 Indice de sauvetage :</h4>
              <p className="css-hint-text">{currentLevel.hint}</p>
            </div>
          )}

          {message && (
            <div className={`css-message css-message-${message.type}`}>
              <span className="css-message-icon">
                {message.type === "error" ? "❌" : message.type === "success" ? "✅" : "ℹ️"}
              </span>
              <span className="css-message-text">{message.text}</span>
            </div>
          )}

          {isCollision && level < levels.length && (
            <button onClick={nextLevel} className="css-next-level-button">
              🚪 Prochaine évasion !
            </button>
          )}

          {solved && (
            <div className="css-victory-message">
              <h3 className="css-victory-title">🎉 LIBERTÉ TOTALE !</h3>
              <p className="css-victory-text">
                Bravo ! Vous avez aidé la princesse et sa fidèle souris à échapper à tous les chasseurs ! Grâce à vos
                compétences CSS, elles sont maintenant libres et en sécurité ! Vous êtes un véritable maître du CSS et
                un héros ! 🦸‍♂️✨
              </p>
              <button onClick={resetGame} className="css-play-again-button">
                🔄 Nouvelle aventure
              </button>
            </div>
          )}

          <div className="css-timer">⏱️ Temps d'évasion : {Math.floor(gameTime / 10)}s</div>
        </div>

        <div className="css-game-right-panel">
          <div className="css-story-section">
            <h2 className="css-story-title">📖 Mission d'évasion</h2>
            <p className="css-story-text">{currentLevel.story}</p>

            <div className="css-characters-info">
              <div className="css-hero-info">
                <img src={princessImage || "/placeholder.svg"} alt="Princesse" className="css-character-portrait" />
                <span>👸 Princesse</span>
              </div>
              <div className="css-hero-info">
                <img src={mouseImage || "/placeholder.svg"} alt="Souris" className="css-character-portrait" />
                <span>🐭 Souris fidèle</span>
              </div>
            </div>

            <div className="css-danger-info">
              <h4>⚠️ Chasseurs en approche :</h4>
              <div className="css-chasers-info">
                {currentLevel.chasers.includes("pirate") && (
                  <div className="css-chaser-info">
                    <img src={pirateImage || "/placeholder.svg"} alt="Pirate" className="css-chaser-portrait" />
                    <span>🏴‍☠️ Pirate chasseur</span>
                  </div>
                )}
                {currentLevel.chasers.includes("peroces") && (
                  <div className="css-chaser-info">
                    <img src={perocesImage || "/placeholder.svg"} alt="Monstre" className="css-chaser-portrait" />
                    <span>👹 Monstre Peroces</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="css-game-area" style={appliedCSS}>
            {/* Porte de sortie */}
            <div className="css-door" style={currentLevel.doorPosition}>
              <img src={doorImage || "/placeholder.svg"} alt="Porte de sortie" className="css-door-image" />
              <div className="css-door-glow"></div>
            </div>

            {/* Nos héros : Princesse et Souris */}
            <div className={`css-heroes-group ${isCollision ? "css-heroes-safe" : ""}`}>
              <div className="css-princess">
                <img src={princessImage || "/placeholder.svg"} alt="Princesse" className="css-character-image" />
              </div>
              <div className="css-mouse-companion">
                <img
                  src={mouseImage || "/placeholder.svg"}
                  alt="Souris"
                  className="css-character-image css-mouse-image"
                />
              </div>
            </div>

            {/* Chasseurs animés */}
            {currentLevel.chasers.includes("pirate") && (
              <div
                className="css-chaser css-pirate-chaser"
                style={{
                  left: `${chasersPosition.pirate}%`,
                  top: `${20 + Math.sin(gameTime / 20) * 10}%`,
                }}
              >
                <img src={pirateImage || "/placeholder.svg"} alt="Pirate chasseur" className="css-chaser-image" />
                <div className="css-chaser-shadow"></div>
              </div>
            )}

            {currentLevel.chasers.includes("peroces") && (
              <div
                className="css-chaser css-peroces-chaser"
                style={{
                  right: `${chasersPosition.peroces}%`,
                  bottom: `${20 + Math.cos(gameTime / 15) * 15}%`,
                }}
              >
                <img src={perocesImage || "/placeholder.svg"} alt="Monstre Peroces" className="css-chaser-image" />
                <div className="css-chaser-shadow"></div>
              </div>
            )}
          </div>

          <div className="css-info-section">
            <h3 className="css-info-title">🛠️ Outils de sauvetage CSS :</h3>
            <div className="css-info-grid">
              <div className="css-info-item">
                <strong>justify-content</strong>
                <span>Déplace horizontalement (flex-start, center, flex-end)</span>
              </div>
              <div className="css-info-item">
                <strong>align-items</strong>
                <span>Déplace verticalement (flex-start, center, flex-end)</span>
              </div>
              <div className="css-info-item">
                <strong>flex-direction</strong>
                <span>Change la direction (row, column, row-reverse, column-reverse)</span>
              </div>
              <div className="css-info-item">
                <strong>flex-wrap</strong>
                <span>Permet le contournement (nowrap, wrap, wrap-reverse)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="css-game-footer">
        <div className="css-progress-bar">
          <div className="css-progress-fill" style={{ width: `${(level / levels.length) * 100}%` }}></div>
        </div>
        <p className="css-progress-text">
          🏃‍♀️ Progression de l'évasion : {level}/{levels.length} niveaux
        </p>
      </div>
    </div>
  )
}

export default CssPrincessGame
