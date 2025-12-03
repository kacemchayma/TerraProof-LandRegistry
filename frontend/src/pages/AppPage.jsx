import { useState } from "react";
import { ethers } from "ethers";
import LandRegistryABI from "../abi/LandRegistry.json";
import LandNFTABI from "../abi/LandNFT.json";
import { LAND_REGISTRY_ADDRESS } from "../config";
import "./AppPage.css";

export default function AppPage() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [parcelResult, setParcelResult] = useState(null);
  const [parcelHistory, setParcelHistory] = useState([]);
  const [nftInfo, setNftInfo] = useState(null);

  // -----------------------------------------
  // Connexion MetaMask
  // -----------------------------------------
  const connect = async () => {
    try {
      if (!window.ethereum) return alert("Installe MetaMask !");

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
      alert("Connexion réussie !");
    } catch (err) {
      console.error("Erreur MetaMask :", err);
      alert("Erreur de connexion MetaMask");
    }
  };

  // -----------------------------------------
  // États formulaires
  // -----------------------------------------
  const [newParcel, setNewParcel] = useState({
    cadastreId: "",
    location: "",
    area: "",
    owner: "",
    metadataURI: "",
    did: "",
  });

  const [parcelIdQuery, setParcelIdQuery] = useState("");

  const [transfer, setTransfer] = useState({
    id: "",
    newOwner: "",
    did: "",
  });

  // -----------------------------------------
  // CRÉATION PARCELLE
  // -----------------------------------------
  const createParcel = async () => {
    if (!contract) return alert("Connecte MetaMask d'abord !");

    try {
      if (!newParcel.cadastreId || !newParcel.location)
        return alert("Champs obligatoires manquants !");

      const didHash = ethers.keccak256(
        ethers.toUtf8Bytes(newParcel.did || "")
      );

      const ownerAddress =
        newParcel.owner.trim() === "" ? account : newParcel.owner;

      const tx = await contract.createParcel(
        newParcel.cadastreId,
        newParcel.location,
        Number(newParcel.area),
        ownerAddress,
        newParcel.metadataURI,
        didHash
      );

      await tx.wait();
      alert("Parcelle créée !");
    } catch (err) {
      console.error("Erreur createParcel :", err);
      alert("Erreur lors de la création");
    }
  };

  // -----------------------------------------
  // LECTURE PARCELLE
  // -----------------------------------------
  const loadParcel = async () => {
    if (!contract) return alert("Connecte MetaMask !");

    try {
      const result = await contract.parcels(Number(parcelIdQuery));
      if (!result.exists) return alert("Cette parcelle n'existe pas !");

      setParcelResult(result);
      setParcelHistory([]);
      setNftInfo(null);
    } catch (err) {
      console.error("Erreur loadParcel :", err);
      alert("Erreur de lecture");
    }
  };

  // -----------------------------------------
  // HISTORIQUE
  // -----------------------------------------
  const loadHistory = async () => {
    if (!contract) return alert("Connecte MetaMask !");
    if (!parcelIdQuery) return alert("Charge une parcelle d'abord.");

    try {
      const filter = contract.filters.ParcelTransferred();
      const events = await contract.queryFilter(filter, 0, "latest");

      const filtered = events.filter(
        (ev) => ev.args[0].toString() === parcelIdQuery
      );

      const history = filtered.map((ev, idx) => ({
        index: idx,
        from: ev.args.from,
        to: ev.args.to,
        txHash: ev.transactionHash,
      }));

      setParcelHistory(history);
    } catch (err) {
      console.error("Erreur history :", err);
      alert("Erreur historique");
    }
  };

  // -----------------------------------------
  // AFFICHER NFT
  // -----------------------------------------
  const viewNft = async () => {
    if (!contract || !parcelResult)
      return alert("Charge une parcelle d'abord.");

    try {
      const id = parcelResult.id;
      const nftAddress = await contract.nft();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const nft = new ethers.Contract(nftAddress, LandNFTABI.abi, signer);
      const owner = await nft.ownerOf(id);

      setNftInfo({
        id: id.toString(),
        owner,
        metadataURI: parcelResult.metadataURI,
      });
    } catch (err) {
      console.error("Erreur NFT :", err);
      alert("Impossible de charger le NFT");
    }
  };

  // -----------------------------------------
  // BOUTON : AUTORISER LE REGISTRY
  // -----------------------------------------
  const authorizeRegistry = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const nftAddress = await contract.nft();
      const nft = new ethers.Contract(nftAddress, LandNFTABI.abi, signer);

      const tx = await nft.setApprovalForAll(LAND_REGISTRY_ADDRESS, true);
      await tx.wait();

      alert("Registry autorisé pour gérer vos NFT !");
    } catch (err) {
      console.error("Erreur approval :", err);
      alert("Impossible d'autoriser le Registry");
    }
  };

  // -----------------------------------------
  // TRANSFERT AVEC APPROVAL AUTOMATIQUE
  // -----------------------------------------
  const transferParcel = async () => {
    if (!contract) return alert("Connecte MetaMask !");

    try {
      const p = await contract.parcels(Number(transfer.id));

      if (!p.exists) return alert("Parcelle inexistante !");
      if (p.owner.toLowerCase() !== account.toLowerCase())
        return alert("Tu n'es pas le propriétaire actuel !");

      if (!ethers.isAddress(transfer.newOwner))
        return alert("Adresse invalide");

      const didHash = ethers.keccak256(
        ethers.toUtf8Bytes(transfer.did || "")
      );

      // Vérifier approval NFT
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nft = new ethers.Contract(
        await contract.nft(),
        LandNFTABI.abi,
        signer
      );

      const approved = await nft.isApprovedForAll(
        account,
        LAND_REGISTRY_ADDRESS
      );

      if (!approved) {
        const txA = await nft.setApprovalForAll(
          LAND_REGISTRY_ADDRESS,
          true
        );
        await txA.wait();
      }

      const tx = await contract.transferParcel(
        Number(transfer.id),
        transfer.newOwner,
        didHash
      );

      await tx.wait();
      alert("Transfert réussi !");
    } catch (err) {
      console.error("Erreur transfert :", err);
      alert("Erreur : " + err.message);
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="app-page">
      <button onClick={connect} className="connect-btn">
        {account ? "Wallet connecté" : "Connecter MetaMask"}
      </button>

      {account && <p><b>Compte :</b> {account}</p>}

      <div className="app-sections">

        {/* ***********************************
            CRÉATION
        ************************************ */}
        <div className="card">
          <h2>Créer une parcelle</h2>

          <input placeholder="Numéro cadastral"
            onChange={(e) => setNewParcel({ ...newParcel, cadastreId: e.target.value })} />

          <input placeholder="Localisation"
            onChange={(e) => setNewParcel({ ...newParcel, location: e.target.value })} />

          <input type="number" placeholder="Surface"
            onChange={(e) => setNewParcel({ ...newParcel, area: e.target.value })} />

          <input placeholder="Adresse propriétaire (optionnel)"
            onChange={(e) => setNewParcel({ ...newParcel, owner: e.target.value })} />

          <input placeholder="Metadata URI (ipfs://...)"
            onChange={(e) => setNewParcel({ ...newParcel, metadataURI: e.target.value })} />

          <input placeholder="DID"
            onChange={(e) => setNewParcel({ ...newParcel, did: e.target.value })} />

          <button className="action-btn" onClick={createParcel}>
            Enregistrer
          </button>
        </div>

        {/* ***********************************
            CONSULTATION
        ************************************ */}
        <div className="card">
          <h2>Consulter une parcelle</h2>

          <input placeholder="ID parcelle"
            onChange={(e) => setParcelIdQuery(e.target.value)} />

          <button className="action-btn" onClick={loadParcel}>Charger</button>

          {parcelResult && (
            <div className="result">
              <p><b>ID :</b> {parcelResult.id.toString()}</p>
              <p><b>Cadastral :</b> {parcelResult.cadastreId}</p>
              <p><b>Localisation :</b> {parcelResult.location}</p>
              <p><b>Propriétaire :</b> {parcelResult.owner}</p>
              <p><b>Surface :</b> {parcelResult.area.toString()} m²</p>
            </div>
          )}

          <div className="inline-buttons">
            <button className="mini-btn" onClick={loadHistory}>Historique</button>
            <button className="mini-btn" onClick={viewNft}>Voir NFT</button>
          </div>

          {parcelHistory.length > 0 && (
            <div className="history-list">
              <h3>Historique</h3>
              <ul>
                {parcelHistory.map((h, idx) => (
                  <li key={idx}>
                    #{idx + 1} — <code>{h.from}</code> → <code>{h.to}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {nftInfo && (
            <div className="nft-box">
              <h3>NFT associé</h3>
              <p><b>ID :</b> {nftInfo.id}</p>
              <p><b>Propriétaire :</b> {nftInfo.owner}</p>
              <p><b>URI :</b> {nftInfo.metadataURI}</p>
            </div>
          )}
        </div>

        {/* ***********************************
            TRANSFERT + APPROVAL BUTTON
        ************************************ */}
        <div className="card">
          <h2>Transférer une parcelle</h2>

          <input placeholder="ID"
            onChange={(e) => setTransfer({ ...transfer, id: e.target.value })} />

          <input placeholder="Nouveau propriétaire"
            onChange={(e) => setTransfer({ ...transfer, newOwner: e.target.value })} />

          <input placeholder="DID"
            onChange={(e) => setTransfer({ ...transfer, did: e.target.value })} />

          <button className="action-btn" onClick={transferParcel}>
            Transférer
          </button>

          <button className="mini-btn" onClick={authorizeRegistry} style={{ marginTop: "10px" }}>
            🔑 Autoriser le Registry (NFT)
          </button>
        </div>

      </div>
    </div>
  );
}
