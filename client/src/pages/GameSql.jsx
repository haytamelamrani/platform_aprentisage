import React, { useState } from 'react';
import '../styles/GameSql.css';

const GameSql = () => {
  const [sql, setSql] = useState('');
  const [resultat, setResultat] = useState([]);

  // 🔧 Base de données virtuelle
  const baseDeDonnees = [
    { nom: 'Sara', magasin: 'M1', heure: '12:04' },
    { nom: 'Adam', magasin: 'M2', heure: '12:09' },
    { nom: 'Sara', magasin: 'M3', heure: '12:35' },
    { nom: 'Lina', magasin: 'M1', heure: '12:08' },
    { nom: 'Adam', magasin: 'M3', heure: '12:42' },
    { nom: 'Yassine', magasin: 'M5', heure: '13:10' },
  ];

  const executerCommande = () => {
    const requete = sql.toLowerCase().trim();

    if (requete === "select * from entrees") {
      setResultat(baseDeDonnees);
    } else if (requete === "select * from entrees where nom = 'sara'") {
      setResultat(baseDeDonnees.filter(r => r.nom.toLowerCase() === 'sara'));
    } else if (requete === "select distinct nom from entrees") {
      const nomsUniques = [...new Set(baseDeDonnees.map(r => r.nom))];
      setResultat(nomsUniques.map(nom => ({ nom })));
    } else {
      setResultat([]);
    }
  };

  return (
    <div className="sql-game-container">
      <div className="left-panel">
        <h2>💻 Console SQL</h2>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={6}
          placeholder="Écris ici ta commande SQL..."
        />
        <button onClick={executerCommande}>Exécuter</button>

        <div className="result-table">
          <h3>📊 Résultat</h3>
          {resultat.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(resultat[0]).map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultat.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(row).map(col => (
                      <td key={col}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun résultat.</p>
          )}
        </div>
      </div>

      <div className="right-panel">
        <div className="story">
          <h2>📖 L’histoire</h2>
          <p>
            Huit magasins de la ville ont été cambriolés durant les deux dernières semaines.
            Chaque fois, le voleur laisse un mystérieux logo rouge en forme de point d’interrogation.
            <br /><br />
            Heureusement, cinq magasins ont enregistré les entrées/sorties.
            À toi de jouer ! Interroge la base pour trouver les suspects...
          </p>
        </div>

        <div className="police-hint">
          <h3>👮 Indice du policier</h3>
          <p>Essaie cette commande :</p>
          <code>SELECT * FROM entrees</code>
        </div>
      </div>
    </div>
  );
};

export default GameSql;
