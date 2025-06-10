"use client"

import { useState } from "react"
import '../styles/SecurityGame.css';

const SecurityGame = ({ darkMode ,toggleMode}) => {
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState([])
  const [message, setMessage] = useState(null)
  const [level, setLevel] = useState(1)
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState(false)
  const [history, setHistory] = useState([])

  // Base de données simulée du système
  const processes = [
    { pid: 1234, name: "chrome.exe", cpu: "2.1%", memory: "156MB", user: "admin", status: "running" },
    { pid: 5678, name: "notepad.exe", cpu: "0.1%", memory: "12MB", user: "admin", status: "running" },
    { pid: 9999, name: "backdoor.exe", cpu: "15.3%", memory: "89MB", user: "system", status: "running" },
    { pid: 2468, name: "explorer.exe", cpu: "1.2%", memory: "45MB", user: "admin", status: "running" },
    { pid: 1357, name: "malware.exe", cpu: "25.7%", memory: "234MB", user: "unknown", status: "running" },
    { pid: 8642, name: "antivirus.exe", cpu: "3.4%", memory: "67MB", user: "system", status: "stopped" },
    { pid: 7531, name: "keylogger.exe", cpu: "8.9%", memory: "23MB", user: "guest", status: "running" },
    { pid: 4826, name: "firefox.exe", cpu: "4.2%", memory: "178MB", user: "admin", status: "running" },
  ]

  const networkConnections = [
    {
      local: "192.168.1.100:80",
      remote: "203.45.67.89:443",
      protocol: "TCP",
      state: "ESTABLISHED",
      process: "chrome.exe",
    },
    {
      local: "192.168.1.100:443",
      remote: "185.199.108.153:443",
      protocol: "TCP",
      state: "ESTABLISHED",
      process: "firefox.exe",
    },
    {
      local: "192.168.1.100:8080",
      remote: "45.33.32.156:6667",
      protocol: "TCP",
      state: "ESTABLISHED",
      process: "backdoor.exe",
    },
    { local: "192.168.1.100:22", remote: "192.168.1.1:22", protocol: "TCP", state: "LISTEN", process: "sshd" },
    {
      local: "192.168.1.100:9999",
      remote: "123.45.67.89:1337",
      protocol: "TCP",
      state: "ESTABLISHED",
      process: "malware.exe",
    },
    { local: "192.168.1.100:3389", remote: "0.0.0.0:0", protocol: "TCP", state: "LISTEN", process: "rdp" },
  ]

  const systemLogs = [
    { time: "14:23:15", level: "INFO", source: "System", message: "User admin logged in successfully" },
    {
      time: "14:25:32",
      level: "WARNING",
      source: "Firewall",
      message: "Suspicious connection attempt from 45.33.32.156",
    },
    { time: "14:27:45", level: "ERROR", source: "Antivirus", message: "Malware detected: backdoor.exe" },
    { time: "14:28:12", level: "CRITICAL", source: "Security", message: "Unauthorized process execution: malware.exe" },
    { time: "14:30:01", level: "WARNING", source: "Network", message: "Data exfiltration detected on port 9999" },
    { time: "14:31:18", level: "INFO", source: "System", message: "Antivirus service stopped unexpectedly" },
    { time: "14:32:45", level: "CRITICAL", source: "Security", message: "Keylogger activity detected" },
    { time: "14:33:22", level: "ERROR", source: "Firewall", message: "Multiple failed login attempts detected" },
  ]

  const fileSystem = [
    { path: "/home/admin/documents", name: "report.pdf", size: "2.3MB", permissions: "rw-r--r--", owner: "admin" },
    { path: "/tmp", name: "backdoor.exe", size: "1.2MB", permissions: "rwxrwxrwx", owner: "unknown" },
    { path: "/usr/bin", name: "malware.exe", size: "3.4MB", permissions: "rwxr-xr-x", owner: "root" },
    { path: "/var/log", name: "system.log", size: "45KB", permissions: "rw-r--r--", owner: "root" },
    { path: "/home/admin", name: "passwords.txt", size: "156B", permissions: "rw-------", owner: "admin" },
    { path: "/etc", name: "shadow", size: "2.1KB", permissions: "r--------", owner: "root" },
  ]

  // Configuration des niveaux
  const levels = [
    {
      id: 1,
      title: "Détection d'intrusion",
      description: "Analysez les processus en cours",
      hint: 'Utilisez la commande "ps" pour voir tous les processus actifs',
      solution: ["ps"],
      story:
        "🚨 ALERTE SÉCURITÉ ! Notre système a été compromis. Des processus suspects s'exécutent sur le serveur. Vous êtes notre expert en cybersécurité, trouvez et éliminez la menace !",
    },
    {
      id: 2,
      title: "Analyse réseau",
      description: "Vérifiez les connexions réseau suspectes",
      hint: 'Utilisez "netstat" pour voir les connexions réseau actives',
      solution: ["netstat"],
      story:
        "Vous avez identifié des processus suspects. Maintenant, vérifiez s'ils communiquent avec l'extérieur. Les attaquants utilisent souvent des connexions réseau pour exfiltrer des données.",
    },
    {
      id: 3,
      title: "Consultation des logs",
      description: "Examinez les logs système pour comprendre l'attaque",
      hint: 'Utilisez "tail /var/log/system.log" pour voir les derniers événements',
      solution: ["tail /var/log/system.log", "tail system.log"],
      story:
        "Les connexions réseau confirment une intrusion. Consultez les logs système pour comprendre comment l'attaque s'est déroulée et quels dommages ont été causés.",
    },
    {
      id: 4,
      title: "Recherche de fichiers malveillants",
      description: "Trouvez les fichiers suspects sur le système",
      hint: 'Utilisez "find" ou "ls" pour chercher des fichiers avec des noms suspects',
      solution: ['find . -name "*malware*"', 'find . -name "*backdoor*"', "ls -la /tmp"],
      story:
        "Les logs révèlent la présence de fichiers malveillants. Localisez ces fichiers pour comprendre l'étendue de l'infection et préparer leur suppression.",
    },
    {
      id: 5,
      title: "Élimination de la menace",
      description: "Arrêtez les processus malveillants",
      hint: 'Utilisez "kill" avec le PID du processus malveillant (ex: kill 9999)',
      solution: ["kill 9999", "kill 1357", "kill 7531"],
      story:
        "C'est le moment décisif ! Éliminez les processus malveillants avant qu'ils ne causent plus de dégâts. Arrêtez tous les processus suspects identifiés.",
    },
    {
      id: 6,
      title: "Sécurisation finale",
      description: "Redémarrez l'antivirus et bloquez les connexions",
      hint: 'Utilisez "systemctl start antivirus" et "iptables" pour bloquer les IPs suspectes',
      solution: ["systemctl start antivirus", "iptables -A INPUT -s 45.33.32.156 -j DROP"],
      story:
        "Dernière étape : sécurisez le système en redémarrant les services de protection et en bloquant les adresses IP malveillantes.",
    },
  ]

  // Analyseur de commandes
  const executeCommand = () => {
    if (!command.trim()) {
      setMessage({ type: "error", text: "Veuillez entrer une commande." })
      return
    }

    setHistory((prev) => [...prev, `$ ${command}`])
    const cmd = command.toLowerCase().trim()
    let result = []

    try {
      // Commande ps - liste des processus
      if (cmd === "ps" || cmd === "ps -aux" || cmd === "ps aux") {
        result = processes.map(
          (p) =>
            `${p.pid.toString().padEnd(8)} ${p.name.padEnd(15)} ${p.cpu.padEnd(8)} ${p.memory.padEnd(10)} ${p.user.padEnd(10)} ${p.status}`,
        )
        result.unshift("PID      NAME            CPU      MEMORY     USER       STATUS")
        result.unshift("─".repeat(70))
      }

      // Commande netstat - connexions réseau
      else if (cmd === "netstat" || cmd === "netstat -an" || cmd === "netstat -tulpn") {
        result = networkConnections.map(
          (conn) =>
            `${conn.protocol.padEnd(8)} ${conn.local.padEnd(20)} ${conn.remote.padEnd(20)} ${conn.state.padEnd(12)} ${conn.process}`,
        )
        result.unshift("PROTO    LOCAL ADDRESS        REMOTE ADDRESS       STATE        PROCESS")
        result.unshift("─".repeat(80))
      }

      // Commande tail pour les logs
      else if (cmd.includes("tail") && (cmd.includes("system.log") || cmd.includes("/var/log"))) {
        result = systemLogs.map((log) => `${log.time} [${log.level.padEnd(8)}] ${log.source.padEnd(10)} ${log.message}`)
        result.unshift("=== SYSTEM LOGS ===")
      }

      // Commande find pour chercher des fichiers
      else if (cmd.includes("find") && (cmd.includes("malware") || cmd.includes("backdoor"))) {
        result = fileSystem
          .filter((file) => file.name.includes("malware") || file.name.includes("backdoor"))
          .map((file) => `${file.path}/${file.name}`)
        if (result.length === 0) result = ["Aucun fichier trouvé"]
      }

      // Commande ls
      else if (cmd.includes("ls") && cmd.includes("/tmp")) {
        result = fileSystem
          .filter((file) => file.path === "/tmp")
          .map((file) => `${file.permissions} ${file.owner.padEnd(8)} ${file.size.padEnd(8)} ${file.name}`)
        result.unshift("PERMISSIONS OWNER    SIZE     NAME")
        result.unshift("─".repeat(40))
      }

      // Commande kill
      else if (cmd.includes("kill")) {
        const pidMatch = cmd.match(/kill\s+(\d+)/)
        if (pidMatch) {
          const pid = Number.parseInt(pidMatch[1])
          const process = processes.find((p) => p.pid === pid)
          if (
            process &&
            (process.name.includes("malware") ||
              process.name.includes("backdoor") ||
              process.name.includes("keylogger"))
          ) {
            result = [`Processus ${pid} (${process.name}) arrêté avec succès`]
            process.status = "killed"
          } else if (process) {
            result = [`Attention: Arrêt du processus légitime ${process.name}`]
          } else {
            result = [`Erreur: Processus ${pid} introuvable`]
          }
        }
      }

      // Commandes système
      else if (cmd.includes("systemctl start antivirus")) {
        result = ["Service antivirus démarré avec succès"]
        const antivirus = processes.find((p) => p.name === "antivirus.exe")
        if (antivirus) antivirus.status = "running"
      } else if (cmd.includes("iptables") && cmd.includes("45.33.32.156")) {
        result = ["Règle firewall ajoutée: IP 45.33.32.156 bloquée"]
      }

      // Commandes d'aide
      else if (cmd === "help" || cmd === "--help") {
        result = [
          "Commandes disponibles:",
          "  ps                    - Lister les processus",
          "  netstat              - Voir les connexions réseau",
          "  tail /var/log/system.log - Consulter les logs",
          '  find . -name "pattern" - Chercher des fichiers',
          "  ls -la /path         - Lister les fichiers",
          "  kill <PID>           - Arrêter un processus",
          "  systemctl start service - Démarrer un service",
          "  iptables -A INPUT -s IP -j DROP - Bloquer une IP",
        ]
      } else {
        throw new Error(`Commande non reconnue: ${command}`)
      }

      setOutput(result)
      setMessage({ type: "success", text: `Commande exécutée. ${result.length} ligne(s) de sortie.` })

      // Vérifier si le niveau est complété
      const currentLevel = levels[level - 1]
      if (currentLevel.solution.some((sol) => cmd.includes(sol.toLowerCase()))) {
        if (level === levels.length) {
          setSolved(true)
          setMessage({
            type: "success",
            text: "🎉 Félicitations ! Vous avez neutralisé l'attaque et sécurisé le système !",
          })
        } else {
          setLevel((prev) => prev + 1)
          setMessage({ type: "success", text: "✅ Niveau complété ! Passez à l'étape suivante." })
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message })
      setOutput([])
    }
  }

  // Gestion des touches
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      executeCommand()
    }
  }

  // Reset du jeu
  const resetGame = () => {
    setLevel(1)
    setCommand("")
    setOutput([])
    setMessage(null)
    setSolved(false)
    setShowHint(false)
    setHistory([])
    // Reset des statuts des processus
    processes.forEach((p) => {
      if (p.name === "antivirus.exe") p.status = "stopped"
      else if (p.name.includes("malware") || p.name.includes("backdoor") || p.name.includes("keylogger")) {
        p.status = "running"
      }
    })
  }

  const currentLevel = levels[level - 1]

  return (
    <div className="security-game-main-container">
      <div className="security-game-left-panel">
        <div className="security-console-header">
          <h2 className="security-console-title">🛡️ Terminal de Sécurité</h2>
          <div className="security-level-info">
            <span className="security-level-badge">
              Niveau {level}/{levels.length}
            </span>
            <span className="security-level-title">{currentLevel.title}</span>
          </div>
        </div>

        <div className="security-terminal">
          <div className="security-terminal-header">
            <span className="security-terminal-title">root@security-server:~#</span>
          </div>

          <div className="security-command-input">
            <span className="security-prompt">$ </span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeCommand()
                } else {
                  handleKeyDown(e)
                }
              }}
              placeholder="Tapez votre commande ici... (Enter pour exécuter)"
              className="security-command-field"
              autoFocus
            />
          </div>
        </div>

        <div className="security-button-group">
          <button onClick={() => setShowHint(!showHint)} className="security-hint-button">
            {showHint ? "🙈 Cacher l'indice" : "💡 Afficher l'indice"}
          </button>
          <button onClick={resetGame} className="security-reset-button">
            🔄 Recommencer
          </button>
          <button onClick={executeCommand} className="security-execute-button">
            ▶️ Exécuter
          </button>
        </div>

        {showHint && (
          <div className="security-hint-box">
            <h4 className="security-hint-title">💡 Indice:</h4>
            <p className="security-hint-text">{currentLevel.hint}</p>
          </div>
        )}

        {message && (
          <div className={`security-message security-message-${message.type}`}>
            <span className="security-message-icon">{message.type === "error" ? "❌" : "✅"}</span>
            <span className="security-message-text">{message.text}</span>
          </div>
        )}

        <div className="security-output-section">
          <h3 className="security-output-title">📟 Sortie Terminal</h3>
          <div className="security-terminal-output">
            {history.length > 0 && (
              <div className="security-command-history">
                {history.slice(-3).map((cmd, i) => (
                  <div key={i} className="security-history-item">
                    {cmd}
                  </div>
                ))}
              </div>
            )}
            {output.length > 0 ? (
              <pre className="security-output-content">{output.join("\n")}</pre>
            ) : (
              <p className="security-no-output">Aucune sortie. Tapez une commande pour commencer.</p>
            )}
          </div>
        </div>
      </div>

      <div className="security-game-right-panel">
        <div className="security-story-section">
          <h2 className="security-story-title">🚨 Mission - {currentLevel.description}</h2>
          <p className="security-story-text">{currentLevel.story}</p>

          {solved && (
            <div className="security-victory-message">
              <h3 className="security-victory-title">🎉 Mission Accomplie !</h3>
              <p className="security-victory-text">
                Excellent travail ! Vous avez réussi à détecter l'intrusion, identifier les processus malveillants,
                analyser les logs, localiser les fichiers suspects et neutraliser complètement la menace. Le système est
                maintenant sécurisé ! 🛡️
              </p>
            </div>
          )}
        </div>

        <div className="security-tabs-container">
          <div className="security-tab-buttons">
            <button
              className="security-tab-button security-tab-active"
              onClick={() => {
                document.querySelectorAll(".security-tab-content").forEach((tab, i) => {
                  tab.style.display = i === 0 ? "block" : "none"
                })
                document.querySelectorAll(".security-tab-button").forEach((btn, i) => {
                  btn.classList.toggle("security-tab-active", i === 0)
                })
              }}
            >
              💻 Commandes
            </button>
            <button
              className="security-tab-button"
              onClick={() => {
                document.querySelectorAll(".security-tab-content").forEach((tab, i) => {
                  tab.style.display = i === 1 ? "block" : "none"
                })
                document.querySelectorAll(".security-tab-button").forEach((btn, i) => {
                  btn.classList.toggle("security-tab-active", i === 1)
                })
              }}
            >
              🔍 Analyse
            </button>
            <button
              className="security-tab-button"
              onClick={() => {
                document.querySelectorAll(".security-tab-content").forEach((tab, i) => {
                  tab.style.display = i === 2 ? "block" : "none"
                })
                document.querySelectorAll(".security-tab-button").forEach((btn, i) => {
                  btn.classList.toggle("security-tab-active", i === 2)
                })
              }}
            >
              🌐 Réseau
            </button>
          </div>

          <div className="security-tab-content">
            <h3 className="security-tab-content-title">Commandes de sécurité:</h3>
            <div className="security-commands-list">
              <div className="security-command-item">
                <strong className="security-command-name">ps</strong>
                <span className="security-command-description"> - Lister tous les processus actifs</span>
                <br />
                <code className="security-command-code">ps aux</code>
              </div>
              <div className="security-command-item">
                <strong className="security-command-name">netstat</strong>
                <span className="security-command-description"> - Afficher les connexions réseau</span>
                <br />
                <code className="security-command-code">netstat -tulpn</code>
              </div>
              <div className="security-command-item">
                <strong className="security-command-name">tail</strong>
                <span className="security-command-description"> - Consulter les logs système</span>
                <br />
                <code className="security-command-code">tail /var/log/system.log</code>
              </div>
              <div className="security-command-item">
                <strong className="security-command-name">find</strong>
                <span className="security-command-description"> - Rechercher des fichiers suspects</span>
                <br />
                <code className="security-command-code">find . -name "*malware*"</code>
              </div>
              <div className="security-command-item">
                <strong className="security-command-name">kill</strong>
                <span className="security-command-description"> - Arrêter un processus malveillant</span>
                <br />
                <code className="security-command-code">kill &lt;PID&gt;</code>
              </div>
              <div className="security-command-item">
                <strong className="security-command-name">iptables</strong>
                <span className="security-command-description"> - Bloquer des adresses IP</span>
                <br />
                <code className="security-command-code">iptables -A INPUT -s IP -j DROP</code>
              </div>
            </div>
          </div>

          <div className="security-tab-content" style={{ display: "none" }}>
            <h3 className="security-tab-content-title">Indicateurs de compromission:</h3>
            <div className="security-indicators">
              <div className="security-indicator-item security-indicator-critical">
                <strong>🔴 Processus suspects:</strong>
                <ul>
                  <li>backdoor.exe (PID: 9999)</li>
                  <li>malware.exe (PID: 1357)</li>
                  <li>keylogger.exe (PID: 7531)</li>
                </ul>
              </div>
              <div className="security-indicator-item security-indicator-warning">
                <strong>🟡 Connexions suspectes:</strong>
                <ul>
                  <li>45.33.32.156:6667 (C&C Server)</li>
                  <li>123.45.67.89:1337 (Data Exfiltration)</li>
                </ul>
              </div>
              <div className="security-indicator-item security-indicator-info">
                <strong>🔵 Services arrêtés:</strong>
                <ul>
                  <li>antivirus.exe (Protection désactivée)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="security-tab-content" style={{ display: "none" }}>
            <h3 className="security-tab-content-title">Topologie réseau:</h3>
            <div className="security-network-map">
              <div className="security-network-node security-node-server">
                <span className="security-node-icon">🖥️</span>
                <span className="security-node-label">
                  Serveur
                  <br />
                  192.168.1.100
                </span>
              </div>
              <div className="security-network-connection security-connection-malicious"></div>
              <div className="security-network-node security-node-attacker">
                <span className="security-node-icon">💀</span>
                <span className="security-node-label">
                  Attaquant
                  <br />
                  45.33.32.156
                </span>
              </div>
              <div className="security-network-legend">
                <div className="security-legend-item">
                  <span className="security-legend-color security-legend-red"></span>
                  <span>Connexion malveillante</span>
                </div>
                <div className="security-legend-item">
                  <span className="security-legend-color security-legend-green"></span>
                  <span>Connexion légitime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="security-progress-section">
          <div className="security-progress-bar">
            <div className="security-progress-fill" style={{ width: `${(level / levels.length) * 100}%` }}></div>
          </div>
          <p className="security-progress-text">
            Progression: {level}/{levels.length} étapes
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecurityGame
