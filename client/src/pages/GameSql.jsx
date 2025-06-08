import React, { useState, useEffect } from 'react';
import '../styles/GameSql.css';

const SqlGame = () => {
  const [sql, setSql] = useState('');
  const [resultat, setResultat] = useState([]);
  const [message, setMessage] = useState(null);
  const [level, setLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [history, setHistory] = useState([]);

  // Base de données virtuelle étendue
  const entrees = [
    { id: 1, nom: 'Sara', magasin: 'M1', heure: '12:04', date: '2023-05-10' },
    { id: 2, nom: 'Adam', magasin: 'M2', heure: '12:09', date: '2023-05-10' },
    { id: 3, nom: 'Sara', magasin: 'M3', heure: '12:35', date: '2023-05-10' },
    { id: 4, nom: 'Lina', magasin: 'M1', heure: '12:08', date: '2023-05-10' },
    { id: 5, nom: 'Adam', magasin: 'M3', heure: '12:42', date: '2023-05-10' },
    { id: 6, nom: 'Yassine', magasin: 'M5', heure: '13:10', date: '2023-05-10' },
    { id: 7, nom: 'Sara', magasin: 'M4', heure: '14:22', date: '2023-05-11' },
    { id: 8, nom: 'Karim', magasin: 'M2', heure: '10:15', date: '2023-05-11' },
    { id: 9, nom: 'Lina', magasin: 'M3', heure: '11:30', date: '2023-05-11' },
    { id: 10, nom: 'Adam', magasin: 'M1', heure: '09:45', date: '2023-05-12' },
    { id: 11, nom: 'Yassine', magasin: 'M4', heure: '16:20', date: '2023-05-12' },
    { id: 12, nom: 'Karim', magasin: 'M5', heure: '17:05', date: '2023-05-12' },
    { id: 13, nom: 'Sara', magasin: 'M2', heure: '14:50', date: '2023-05-13' },
    { id: 14, nom: 'Lina', magasin: 'M5', heure: '13:25', date: '2023-05-13' },
    { id: 15, nom: 'Adam', magasin: 'M4', heure: '15:40', date: '2023-05-13' },
  ];

  const vols = [
    { id: 1, magasin: 'M2', date: '2023-05-10', heure: '19:30', montant: 1500 },
    { id: 2, magasin: 'M5', date: '2023-05-11', heure: '20:15', montant: 2200 },
    { id: 3, magasin: 'M1', date: '2023-05-12', heure: '18:45', montant: 1800 },
    { id: 4, magasin: 'M3', date: '2023-05-13', heure: '21:10', montant: 3000 },
    { id: 5, magasin: 'M4', date: '2023-05-14', heure: '19:20', montant: 2500 },
  ];

  const suspects = [
    { nom: 'Sara', description: 'Étudiante en informatique, 22 ans', alibi: 'Cours du soir' },
    { nom: 'Adam', description: 'Vendeur dans un magasin d\'électronique, 28 ans', alibi: 'Aucun' },
    { nom: 'Lina', description: 'Professeure de mathématiques, 35 ans', alibi: 'Réunion parents' },
    { nom: 'Yassine', description: 'Chauffeur de taxi, 42 ans', alibi: 'Service de nuit' },
    { nom: 'Karim', description: 'Consultant en sécurité, 31 ans', alibi: 'Mission client' },
  ];

  // Configuration des niveaux
  const levels = [
    {
      id: 1,
      title: 'Premiers pas',
      description: 'Découvrez les données disponibles',
      hint: 'Essayez d\'afficher toutes les entrées avec SELECT * FROM entrees',
      solution: ['select * from entrees'],
      story: 'Huit magasins de la ville ont été cambriolés durant les deux dernières semaines. Chaque fois, le voleur laisse un mystérieux logo rouge en forme de point d\'interrogation. Heureusement, cinq magasins ont enregistré les entrées/sorties. À toi de jouer !'
    },
    {
      id: 2,
      title: 'Les vols',
      description: 'Examinez les détails des cambriolages',
      hint: 'Affichez les informations sur les vols avec SELECT * FROM vols',
      solution: ['select * from vols'],
      story: 'Maintenant que vous avez les données des entrées, il est temps d\'examiner les détails des cambriolages pour établir une chronologie des événements.'
    },
    {
      id: 3,
      title: 'Les suspects',
      description: 'Identifiez les suspects potentiels',
      hint: 'Consultez la liste des suspects avec SELECT * FROM suspects',
      solution: ['select * from suspects'],
      story: 'Vous avez maintenant une chronologie des vols. Il est temps d\'examiner les suspects potentiels qui pourraient être impliqués dans ces cambriolages.'
    },
    {
      id: 4,
      title: 'Recoupement des données',
      description: 'Trouvez qui était présent avant les vols',
      hint: 'Utilisez WHERE pour comparer les entrées et les vols du même jour',
      solution: ['select e.nom, e.magasin, e.date from entrees e, vols v where e.magasin = v.magasin and e.date = v.date'],
      story: 'Vous avez maintenant toutes les informations nécessaires. Il est temps de recouper les données pour trouver qui était présent dans les magasins le jour des vols.'
    },
    {
      id: 5,
      title: 'Le coupable',
      description: 'Identifiez le criminel',
      hint: 'Comptez combien de fois chaque personne était présente dans un magasin le jour d\'un vol',
      solution: ['select e.nom, count(*) as visites from entrees e, vols v where e.magasin = v.magasin and e.date = v.date group by e.nom order by visites desc'],
      story: 'Vous êtes sur le point de résoudre l\'affaire ! Qui est le criminel qui a visité le plus de magasins les jours des vols ?'
    }
  ];

  // Analyseur SQL amélioré
  const executerCommande = () => {
    if (!sql.trim()) {
      setMessage({ type: 'error', text: 'Veuillez entrer une commande SQL.' });
      return;
    }

    setHistory(prev => [...prev, sql]);
    const requete = sql.toLowerCase().trim();

    try {
      let result = [];

      if (requete.includes('select') && requete.includes('from')) {
        // Déterminer la table source
        if (requete.includes('from entrees')) {
          result = parseSelectQuery(requete, entrees);
        } else if (requete.includes('from vols')) {
          result = parseSelectQuery(requete, vols);
        } else if (requete.includes('from suspects')) {
          result = parseSelectQuery(requete, suspects);
        } else if (requete.includes('entrees') && requete.includes('vols')) {
          result = handleJoinQuery(requete);
        } else {
          throw new Error('Table non reconnue');
        }

        setResultat(result);
        setMessage({ type: 'success', text: `Requête exécutée avec succès. ${result.length} résultat(s) trouvé(s).` });

        // Vérifier si le niveau est complété
        const currentLevel = levels[level - 1];
        if (currentLevel.solution.some(sol => requete.includes(sol.toLowerCase()))) {
          if (level === levels.length) {
            setSolved(true);
            setMessage({ type: 'success', text: 'Félicitations ! Vous avez résolu l\'enquête ! Le coupable est Adam.' });
          } else {
            setLevel(prev => prev + 1);
            setMessage({ type: 'success', text: 'Niveau complété ! Passez au niveau suivant.' });
          }
        }
      } else {
        throw new Error('Commande non reconnue. Utilisez SELECT ... FROM ...');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
      setResultat([]);
    }
  };

  // Parser pour les requêtes SELECT
  const parseSelectQuery = (query, data) => {
    let result = [...data];

    // Gestion WHERE
    if (query.includes('where')) {
      const whereClause = query.split('where')[1].split('group by')[0].split('order by')[0].trim();
      result = filterByWhereClause(result, whereClause);
    }

    // Gestion GROUP BY
    if (query.includes('group by')) {
      result = handleGroupBy(result, query);
    }

    // Gestion ORDER BY
    if (query.includes('order by')) {
      result = handleOrderBy(result, query);
    }

    // Gestion DISTINCT
    if (query.includes('select distinct')) {
      const field = query.split('select distinct')[1].split('from')[0].trim();
      result = handleDistinct(result, field);
    }

    // Sélection des colonnes
    if (!query.includes('select *')) {
      result = selectColumns(result, query);
    }

    return result;
  };

  // Filtrage avec WHERE
  const filterByWhereClause = (data, whereClause) => {
    return data.filter(item => {
      if (whereClause.includes('=')) {
        const conditions = whereClause.split('and');
        return conditions.every(condition => {
          const [field, value] = condition.split('=').map(s => s.trim());
          const cleanField = field.includes('.') ? field.split('.')[1] : field;
          const cleanValue = value.replace(/'/g, '').replace(/"/g, '');
          return item[cleanField] && item[cleanField].toString().toLowerCase() === cleanValue.toLowerCase();
        });
      }
      return true;
    });
  };

  // Gestion GROUP BY
  const handleGroupBy = (data, query) => {
    const groupByField = query.split('group by')[1].split('order by')[0].trim();
    const cleanField = groupByField.includes('.') ? groupByField.split('.')[1] : groupByField;
    const groups = {};

    data.forEach(item => {
      const key = item[cleanField];
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    if (query.includes('count(*)')) {
      return Object.keys(groups).map(key => ({
        [cleanField]: key,
        visites: groups[key].length
      }));
    }

    return Object.keys(groups).map(key => groups[key][0]);
  };

  // Gestion ORDER BY
  const handleOrderBy = (data, query) => {
    const orderByClause = query.split('order by')[1].trim();
    const [field, direction] = orderByClause.split(' ');
    const cleanField = field.includes('.') ? field.split('.')[1] : field;

    return [...data].sort((a, b) => {
      const aVal = a[cleanField] || 0;
      const bVal = b[cleanField] || 0;
      
      if (direction && direction.toLowerCase() === 'desc') {
        return aVal > bVal ? -1 : 1;
      }
      return aVal > bVal ? 1 : -1;
    });
  };

  // Gestion DISTINCT
  const handleDistinct = (data, field) => {
    const uniqueValues = new Set(data.map(item => item[field]));
    return Array.from(uniqueValues).map(value => ({ [field]: value }));
  };

  // Sélection des colonnes
  const selectColumns = (data, query) => {
    const columnsStr = query.split('select')[1].split('from')[0].trim();
    const columns = columnsStr.split(',').map(c => c.trim());

    return data.map(item => {
      const newItem = {};
      columns.forEach(col => {
        if (col.includes('as')) {
          const [originalCol, alias] = col.split('as').map(c => c.trim());
          const cleanCol = originalCol.includes('.') ? originalCol.split('.')[1] : originalCol;
          newItem[alias] = item[cleanCol];
        } else {
          const cleanCol = col.includes('.') ? col.split('.')[1] : col;
          newItem[cleanCol] = item[cleanCol];
        }
      });
      return newItem;
    });
  };

  // Gestion des jointures
  const handleJoinQuery = (query) => {
    const result = [];

    entrees.forEach(entree => {
      vols.forEach(vol => {
        if (entree.magasin === vol.magasin && entree.date === vol.date) {
          result.push({
            ...entree,
            date_vol: vol.date,
            heure_vol: vol.heure,
            montant: vol.montant
          });
        }
      });
    });

    let processedResult = result;

    if (query.includes('where')) {
      const whereClause = query.split('where')[1].split('group by')[0].split('order by')[0].trim();
      processedResult = filterByWhereClause(processedResult, whereClause);
    }

    if (query.includes('group by')) {
      processedResult = handleGroupBy(processedResult, query);
    }

    if (query.includes('order by')) {
      processedResult = handleOrderBy(processedResult, query);
    }

    return processedResult;
  };

  // Gestion des touches
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      executerCommande();
    }
  };

  // Reset du jeu
  const resetGame = () => {
    setLevel(1);
    setSql('');
    setResultat([]);
    setMessage(null);
    setSolved(false);
    setShowHint(false);
  };

  const currentLevel = levels[level - 1];

  return (
    <div className="sql-game-main-container">
      <div className="sql-game-left-panel">
        <div className="sql-console-header">
          <h2 className="sql-console-title">💻 Console SQL</h2>
          <div className="sql-level-info">
            <span className="sql-level-badge">Niveau {level}/{levels.length}</span>
            <span className="sql-level-title">{currentLevel.title}</span>
          </div>
        </div>

        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={6}
          placeholder="Écris ici ta commande SQL... (Ctrl+Enter pour exécuter)"
          className="sql-input-textarea"
        />

        <div className="sql-button-group">
          <button onClick={() => setShowHint(!showHint)} className="sql-hint-button">
            {showHint ? '🙈 Cacher l\'indice' : '💡 Afficher l\'indice'}
          </button>
          <button onClick={resetGame} className="sql-reset-button">🔄 Recommencer</button>
          <button onClick={executerCommande} className="sql-execute-button">▶️ Exécuter</button>
        </div>

        {showHint && (
          <div className="sql-hint-box">
            <h4 className="sql-hint-title">💡 Indice:</h4>
            <p className="sql-hint-text">{currentLevel.hint}</p>
          </div>
        )}

        {message && (
          <div className={`sql-message sql-message-${message.type}`}>
            <span className="sql-message-icon">{message.type === 'error' ? '❌' : '✅'}</span>
            <span className="sql-message-text">{message.text}</span>
          </div>
        )}

        <div className="sql-result-section">
          <h3 className="sql-result-title">📊 Résultat</h3>
          {resultat.length > 0 ? (
            <div className="sql-table-container">
              <table className="sql-result-table">
                <thead className="sql-table-header">
                  <tr className="sql-table-header-row">
                    {Object.keys(resultat[0]).map(col => (
                      <th key={col} className="sql-table-header-cell">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="sql-table-body">
                  {resultat.map((row, i) => (
                    <tr key={i} className={`sql-table-row ${i % 2 === 0 ? 'sql-table-row-even' : 'sql-table-row-odd'}`}>
                      {Object.keys(row).map(col => (
                        <td key={col} className="sql-table-cell">{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="sql-no-result">Aucun résultat.</p>
          )}
        </div>
      </div>

      <div className="sql-game-right-panel">
        <div className="sql-story-section">
          <h2 className="sql-story-title">📖 L'enquête - {currentLevel.description}</h2>
          <p className="sql-story-text">{currentLevel.story}</p>
          
          {solved && (
            <div className="sql-victory-message">
              <h3 className="sql-victory-title">🎉 Félicitations !</h3>
              <p className="sql-victory-text">Vous avez résolu l'enquête ! Le criminel est <strong>Adam</strong>, qui était présent dans tous les magasins le jour des vols.</p>
            </div>
          )}
        </div>

        <div className="sql-tabs-container">
          <div className="sql-tab-buttons">
            <button className="sql-tab-button sql-tab-active" onClick={() => {
              document.querySelectorAll('.sql-tab-content').forEach((tab, i) => {
                tab.style.display = i === 0 ? 'block' : 'none';
              });
              document.querySelectorAll('.sql-tab-button').forEach((btn, i) => {
                btn.classList.toggle('sql-tab-active', i === 0);
              });
            }}>
              📋 Tables
            </button>
            <button className="sql-tab-button" onClick={() => {
              document.querySelectorAll('.sql-tab-content').forEach((tab, i) => {
                tab.style.display = i === 1 ? 'block' : 'none';
              });
              document.querySelectorAll('.sql-tab-button').forEach((btn, i) => {
                btn.classList.toggle('sql-tab-active', i === 1);
              });
            }}>
              💻 Commandes
            </button>
            <button className="sql-tab-button" onClick={() => {
              document.querySelectorAll('.sql-tab-content').forEach((tab, i) => {
                tab.style.display = i === 2 ? 'block' : 'none';
              });
              document.querySelectorAll('.sql-tab-button').forEach((btn, i) => {
                btn.classList.toggle('sql-tab-active', i === 2);
              });
            }}>
              🗺️ Carte
            </button>
          </div>

          <div className="sql-tab-content">
            <h3 className="sql-tab-content-title">Tables disponibles:</h3>
            <div className="sql-table-info">
              <div className="sql-table-item">
                <strong className="sql-table-item-name">entrees</strong>
                <span className="sql-table-item-description"> - Enregistrements des entrées dans les magasins</span>
                <br />
                <code className="sql-table-item-schema">(id, nom, magasin, heure, date)</code>
              </div>
              <div className="sql-table-item">
                <strong className="sql-table-item-name">vols</strong>
                <span className="sql-table-item-description"> - Détails des cambriolages</span>
                <br />
                <code className="sql-table-item-schema">(id, magasin, date, heure, montant)</code>
              </div>
              <div className="sql-table-item">
                <strong className="sql-table-item-name">suspects</strong>
                <span className="sql-table-item-description"> - Informations sur les suspects</span>
                <br />
                <code className="sql-table-item-schema">(nom, description, alibi)</code>
              </div>
            </div>
          </div>

          <div className="sql-tab-content" style={{display: 'none'}}>
            <h3 className="sql-tab-content-title">Commandes SQL utiles:</h3>
            <div className="sql-commands-list">
              <div className="sql-command-item">
                <strong className="sql-command-name">Sélectionner toutes les colonnes:</strong>
                <code className="sql-command-code">SELECT * FROM table</code>
              </div>
              <div className="sql-command-item">
                <strong className="sql-command-name">Sélectionner des colonnes spécifiques:</strong>
                <code className="sql-command-code">SELECT col1, col2 FROM table</code>
              </div>
              <div className="sql-command-item">
                <strong className="sql-command-name">Filtrer avec WHERE:</strong>
                <code className="sql-command-code">SELECT * FROM table WHERE condition</code>
              </div>
              <div className="sql-command-item">
                <strong className="sql-command-name">Joindre des tables:</strong>
                <code className="sql-command-code">SELECT * FROM table1, table2 WHERE table1.col = table2.col</code>
              </div>
              <div className="sql-command-item">
                <strong className="sql-command-name">Grouper et compter:</strong>
                <code className="sql-command-code">SELECT col, COUNT(*) FROM table GROUP BY col</code>
              </div>
              <div className="sql-command-item">
                <strong className="sql-command-name">Trier les résultats:</strong>
                <code className="sql-command-code">SELECT * FROM table ORDER BY col [ASC|DESC]</code>
              </div>
            </div>
          </div>

          <div className="sql-tab-content" style={{display: 'none'}}>
            <div className="sql-city-map">
              <div className="sql-store" style={{top: '20%', left: '25%'}}>
                <span className="sql-store-marker">📍</span>
                <span className="sql-store-label">M1</span>
              </div>
              <div className="sql-store" style={{top: '30%', right: '30%'}}>
                <span className="sql-store-marker">📍</span>
                <span className="sql-store-label">M2</span>
              </div>
              <div className="sql-store" style={{bottom: '40%', left: '30%'}}>
                <span className="sql-store-marker">📍</span>
                <span className="sql-store-label">M3</span>
              </div>
              <div className="sql-store" style={{top: '50%', left: '50%'}}>
                <span className="sql-store-marker">📍</span>
                <span className="sql-store-label">M4</span>
              </div>
              <div className="sql-store" style={{bottom: '20%', right: '25%'}}>
                <span className="sql-store-marker">📍</span>
                <span className="sql-store-label">M5</span>
              </div>
              <div className="sql-map-title">Carte de la ville</div>
            </div>
          </div>
        </div>

        <div className="sql-progress-section">
          <div className="sql-progress-bar">
            <div className="sql-progress-fill" style={{width: `${(level / levels.length) * 100}%`}}></div>
          </div>
          <p className="sql-progress-text">Progression: {level}/{levels.length} niveaux</p>
        </div>
      </div>
    </div>
  );
};

export default SqlGame;