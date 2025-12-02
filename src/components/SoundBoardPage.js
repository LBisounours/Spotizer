// /src/components/SoundBoardPage.js
import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSoundBoard } from '../contexts/SoundBoardContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SoundBoardPage = ({ soundDatabase }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const {
    soundBoards,
    createSoundBoard,
    deleteSoundBoard,
    updateSoundBoard,
    addSoundToBoard,
    removeSoundFromBoard,
    importSoundBoard,
    exportSoundBoard,
    addToSoundBoardHistory
  } = useSoundBoard();

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSoundModal, setShowAddSoundModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState(null);
  const [boardForOptions, setBoardForOptions] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  // Jouer un son
  const playSound = (sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(sound.audioUrl);
    audioRef.current = audio;
    setCurrentlyPlaying(sound.id);
    addToSoundBoardHistory(sound);

    audio.play().catch(err => console.log('Erreur lecture:', err));
    audio.onended = () => {
      setCurrentlyPlaying(null);
    };
  };

  // Arrêter tous les sons
  const stopAllSounds = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentlyPlaying(null);
    }
  };

  // Filtrer les sons disponibles
  const filteredSounds = soundDatabase.filter(sound =>
    sound.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sound.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gérer la réorganisation des sons
  const handleDragEnd = (result) => {
    if (!result.destination || !selectedBoard) return;

    const newSounds = [...selectedBoard.sounds];
    const [removed] = newSounds.splice(result.source.index, 1);
    newSounds.splice(result.destination.index, 0, removed);

    const updatedBoard = { ...selectedBoard, sounds: newSounds };
    updateSoundBoard(updatedBoard);
    setSelectedBoard(updatedBoard);
  };

  // Ouvrir les modals
  const openEditModal = (board) => {
    setBoardToEdit(board);
    setShowEditModal(true);
  };

  const openOptionsModal = (board) => {
    setBoardForOptions(board);
    setShowOptionsModal(true);
  };

  const handleCreateBoard = (name, description, cover) => {
    createSoundBoard(name, description, cover);
    setShowCreateModal(false);
  };

  const handleUpdateBoard = (updatedBoard) => {
    updateSoundBoard(updatedBoard);
    if (selectedBoard?.id === updatedBoard.id) {
      setSelectedBoard(updatedBoard);
    }
    setShowEditModal(false);
    setBoardToEdit(null);
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce SoundBoard ?')) {
      deleteSoundBoard(boardId);
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(null);
      }
      setShowOptionsModal(false);
      setBoardForOptions(null);
    }
  };

  const handleExportBoard = (board) => {
    exportSoundBoard(board);
    setShowOptionsModal(false);
    setBoardForOptions(null);
  };

  const handleImportBoard = (imported) => {
    importSoundBoard(imported);
    setShowCreateModal(false);
  };

  return (
    <div className="soundboard-layout">
      {/* Sidebar gauche avec liste des SoundBoards */}
      <div className="soundboard-sidebar">
        <div className="soundboard-sidebar-header">
          <h3 className="soundboard-sidebar-title">SoundBoards</h3>
          <button
            className="add-soundboard-btn"
            onClick={() => setShowCreateModal(true)}
            title="Créer un SoundBoard"
          >
            ➕
          </button>
        </div>

        <div className="soundboard-list">
          {soundBoards.map(board => (
            <div key={board.id} style={{ position: 'relative' }}>
              <button
                className={`soundboard-list-item ${selectedBoard?.id === board.id ? 'active' : ''}`}
                onClick={() => setSelectedBoard(board)}
                style={selectedBoard?.id === board.id ? { background: currentTheme.gradient } : {}}
              >
                <img
                  src={board.cover}
                  alt={board.name}
                  className="soundboard-list-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "SoundBoard/Images/default.png";
                  }}
                />
                <div className="soundboard-list-info">
                  <div className="soundboard-list-name">{board.name}</div>
                  <div className="soundboard-list-count">{board.sounds.length} sons</div>
                </div>
              </button>
              <button
                className="soundboard-options-list-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openOptionsModal(board);
                }}
                title="Options"
              >
                ⋮
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="soundboard-content">
        {!selectedBoard ? (
          // Vue d'accueil
          <div className="soundboard-empty-state">
            {soundBoards.length === 0 ? (
              <>
                <h2>🎵 Créez votre premier SoundBoard</h2>
                <p>Organisez vos sons préférés dans des boards personnalisés</p>
                <button
                  className="create-first-soundboard-btn"
                  onClick={() => setShowCreateModal(true)}
                  style={{ background: currentTheme.gradient }}
                >
                  ➕ Créer un SoundBoard
                </button>
              </>
            ) : (
              <>
                <h2>👈 Sélectionnez un SoundBoard</h2>
                <p>Choisissez un SoundBoard dans la liste à gauche pour commencer</p>
              </>
            )}
          </div>
        ) : (
          // Vue détaillée du SoundBoard sélectionné
          <div>
            <div className="soundboard-header">
              <img
                src={selectedBoard.cover}
                alt={selectedBoard.name}
                className="soundboard-cover-large"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "SoundBoard/Images/default.png";
                }}
              />
              <div className="soundboard-details">
                <p className="soundboard-type">SoundBoard</p>
                <h1 className="soundboard-title-large">{selectedBoard.name}</h1>
                <p className="soundboard-description-large">{selectedBoard.description}</p>
                <p className="soundboard-stats">{selectedBoard.sounds.length} sons</p>
                <div className="soundboard-actions">
                  <button
                    className="add-sound-btn"
                    onClick={() => setShowAddSoundModal(true)}
                    style={{ background: currentTheme.gradient }}
                  >
                    ➕ Ajouter des sons
                  </button>
                  {currentlyPlaying && (
                    <button
                      className="stop-all-btn"
                      onClick={stopAllSounds}
                      style={{ background: '#ef4444' }}
                    >
                      ⏹️ Arrêter
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="soundboard-sounds">
              {selectedBoard.sounds.length === 0 ? (
                <div className="empty-soundboard">
                  <p>Ce soundboard est vide</p>
                  <p>Ajoutez des sons depuis la bibliothèque</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="soundboard-sounds">
                    {(provided) => (
                      <div
                        className="sound-grid"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {selectedBoard.sounds.map((sound, index) => (
                          <Draggable
                            key={`${sound.id}-${index}`}
                            draggableId={`${sound.id}-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`sound-card ${snapshot.isDragging ? 'dragging' : ''} ${currentlyPlaying === sound.id ? 'playing' : ''}`}
                                onClick={() => playSound(sound)}
                                style={{
                                  ...provided.draggableProps.style,
                                  background: currentTheme.gradient,
                                  boxShadow: currentlyPlaying === sound.id
                                    ? `0 0 20px 10px ${currentTheme.primary}80`
                                    : 'none'
                                }}
                              >
                                <img
                                  src={sound.cover}
                                  alt={sound.title}
                                  className="sound-card-image"
                                />
                                <button
                                  className="remove-sound-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSoundFromBoard(selectedBoard.id, sound.id);
                                    // Mettre à jour l'état local
                                    const updatedBoard = {
                                      ...selectedBoard,
                                      sounds: selectedBoard.sounds.filter(s => s.id !== sound.id)
                                    };
                                    setSelectedBoard(updatedBoard);
                                  }}
                                  title="Retirer du soundboard"
                                >
                                  🗑️
                                </button>
                                <div className="sound-card-info">
                                  <h3 className="sound-card-title">{sound.title}</h3>
                                  <p className="sound-card-artist">{sound.artist}</p>
                                  <p className="sound-card-duration">{sound.duration}</p>
                                </div>
                                {currentlyPlaying === sound.id && (
                                  <div className="playing-indicator">▶️</div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSoundBoardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateBoard}
          onImport={handleImportBoard}
        />
      )}

      {showEditModal && boardToEdit && (
        <EditSoundBoardModal
          board={boardToEdit}
          onClose={() => {
            setShowEditModal(false);
            setBoardToEdit(null);
          }}
          onSave={handleUpdateBoard}
        />
      )}

      {showOptionsModal && boardForOptions && (
        <SoundBoardOptionsModal
          board={boardForOptions}
          onClose={() => {
            setShowOptionsModal(false);
            setBoardForOptions(null);
          }}
          onDelete={handleDeleteBoard}
          onEdit={(board) => {
            openEditModal(board);
            setShowOptionsModal(false);
          }}
          onExport={handleExportBoard}
        />
      )}

      {showAddSoundModal && selectedBoard && (
        <AddSoundModal
          soundDatabase={soundDatabase}
          selectedBoard={selectedBoard}
          onClose={() => {
            setShowAddSoundModal(false);
            setSearchQuery('');
          }}
          onAdd={(sound) => {
            addSoundToBoard(selectedBoard.id, sound);
            // Mettre à jour l'état local
            const updatedBoard = {
              ...selectedBoard,
              sounds: [...selectedBoard.sounds, sound]
            };
            setSelectedBoard(updatedBoard);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredSounds={filteredSounds}
        />
      )}
    </div>
  );
};

// Modal de création
const CreateSoundBoardModal = ({ onClose, onCreate, onImport }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim(), cover.trim());
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          onImport(imported);
        } catch (error) {
          alert('Erreur lors de l\'importation. Vérifiez le format du fichier.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Créer un nouveau SoundBoard</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nom du SoundBoard *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Mon SoundBoard"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Description du SoundBoard"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label className="form-label">URL de la cover (optionnel)</label>
            <input
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="form-input"
              placeholder="SoundBoard/Images/cover.jpg"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary" style={{ background: currentTheme.gradient }}>
              Créer
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
          </div>
        </form>
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            📥 Importer un SoundBoard
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal d'édition
const EditSoundBoardModal = ({ board, onClose, onSave }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const [name, setName] = useState(board.name || '');
  const [description, setDescription] = useState(board.description || '');
  const [cover, setCover] = useState(board.cover || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Le nom est obligatoire !");
      return;
    }
    onSave({ 
      ...board, 
      name: name.trim(), 
      description: description.trim(), 
      cover: cover.trim() || board.cover 
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Modifier le SoundBoard</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nom *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label className="form-label">URL de la cover</label>
            <input
              type="url"
              className="form-input"
              value={cover}
              onChange={e => setCover(e.target.value)}
              placeholder="SoundBoard/Images/cover.jpg"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary" style={{ background: currentTheme.gradient }}>
              Sauvegarder
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal d'options
const SoundBoardOptionsModal = ({ board, onClose, onDelete, onEdit, onExport }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Options pour "{board.name}"</h2>
        <div className="playlist-options">
          <button 
            className="option-btn edit-btn" 
            onClick={() => onEdit(board)}
          >
            ✏️ Éditer le SoundBoard
          </button>
          <button 
            className="option-btn export-btn" 
            onClick={() => onExport(board)}
          >
            📤 Exporter le SoundBoard
          </button>
          <button 
            className="option-btn delete-btn" 
            onClick={() => onDelete(board.id)}
          >
            🗑️ Supprimer le SoundBoard
          </button>
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">Annuler</button>
        </div>
      </div>
    </div>
  );
};

// Modal d'ajout de sons
const AddSoundModal = ({ soundDatabase, selectedBoard, onClose, onAdd, searchQuery, setSearchQuery, filteredSounds }) => {
  const { isDarkMode, currentTheme } = useTheme();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal modal-large ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Ajouter des sons à "{selectedBoard.name}"</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Rechercher des sons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="sound-selection-list">
          {filteredSounds.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
              Aucun son trouvé.
            </p>
          ) : (
            filteredSounds.map(sound => {
              const isAdded = selectedBoard.sounds.find(s => s.id === sound.id);
              return (
                <div key={sound.id} className="sound-selection-item">
                  <img 
                    src={sound.cover} 
                    alt={sound.title} 
                    className="sound-selection-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "SoundBoard/Images/default.png";
                    }}
                  />
                  <div className="sound-selection-info">
                    <div className="sound-selection-title">{sound.title}</div>
                    <div className="sound-selection-artist">{sound.artist}</div>
                  </div>
                  <div className="sound-selection-duration">{sound.duration}</div>
                  <button
                    className="btn btn-primary"
                    onClick={() => onAdd(sound)}
                    disabled={isAdded}
                    style={{
                      background: isAdded ? '#6b7280' : currentTheme.gradient,
                      cursor: isAdded ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isAdded ? '✓ Ajouté' : '➕ Ajouter'}
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default SoundBoardPage;