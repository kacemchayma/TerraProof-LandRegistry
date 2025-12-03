import { useState } from "react";
import { ethers } from "ethers";
import LandRegistryABI from "../abi/LandRegistry.json";
import { LAND_REGISTRY_ADDRESS } from "../config";
import "./ParcellesPage.css";

export default function ParcellesPage() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [allParcels, setAllParcels] = useState([]);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    try {
      if (!window.ethereum) {
        alert("Installe MetaMask !");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const c = new ethers.Contract(
        LAND_REGISTRY_ADDRESS,
        LandRegistryABI.abi,
        signer
      );
      setContract(c);
      alert("Connexion réussie (page parcelles) !");
    } catch (err) {
      console.error("Erreur MetaMask (parcelles):", err);
      alert("Erreur de connexion MetaMask");
    }
  };

  const loadAllParcels = async () => {
    if (!contract) return alert("Connecte MetaMask d'abord !");
    try {
      setLoading(true);
      const nextId = await contract.nextId();
      const count = Number(nextId);
      const rows = [];

      for (let i = 0; i < count; i++) {
        const p = await contract.parcels(i);
        if (p.exists) {
          rows.push(p);
        }
      }

      setAllParcels(rows);
    } catch (err) {
      console.error("Erreur loadAllParcels :", err);
      alert("Erreur lors du chargement des parcelles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parcelles-page">
      <div className="parcelles-header">
        <div>
          <h1>Liste des parcelles</h1>
          <p className="subtitle">
            Vue globale de toutes les parcelles enregistrées dans le registre.
          </p>
        </div>

        <div className="parcelles-actions">
          <button className="btn-outline" onClick={connect}>
            {account ? "Wallet connecté" : "Connecter MetaMask"}
          </button>
          <button className="btn-primary" onClick={loadAllParcels}>
            {loading ? "Chargement..." : "Charger les parcelles"}
          </button>
        </div>
      </div>

      {account && (
        <p className="current-account">
          Connecté en tant que <code>{account}</code>
        </p>
      )}

      <div className="parcelles-table-wrapper">
        {allParcels.length === 0 ? (
          <p className="empty-info">
            Aucune parcelle chargée pour le moment. Clique sur{" "}
            <b>“Charger les parcelles”</b> pour récupérer les données on-chain.
          </p>
        ) : (
          <table className="parcelles-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cadastre</th>
                <th>Surface</th>
                <th>Propriétaire</th>
                <th>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {allParcels.map((p, idx) => {
                const id = p.id.toString();
                const area = p.area.toString();
                const meta = p.metadataURI;
                let metaShort = meta;

                if (meta && meta.length > 22) {
                  metaShort = meta.slice(0, 22) + "...";
                }

                let ipfsLink = null;
                if (meta && meta.startsWith("ipfs://")) {
                  ipfsLink =
                    "https://ipfs.io/ipfs/" + meta.replace("ipfs://", "");
                }

                return (
                  <tr key={idx}>
                    <td>
                      <span className="badge-id">#{id}</span>
                    </td>
                    <td>{p.cadastreId}</td>
                    <td>{area} m²</td>
                    <td>
                      <span className="addr-cell">
                        {p.owner.slice(0, 6)}...{p.owner.slice(-4)}
                      </span>
                    </td>
                    <td>
                      {meta ? (
                        ipfsLink ? (
                          <a
                            href={ipfsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="meta-link"
                          >
                            {metaShort}
                          </a>
                        ) : (
                          <span className="meta-text">{metaShort}</span>
                        )
                      ) : (
                        <span className="meta-empty">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
