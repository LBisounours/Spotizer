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

    audio.play();
    audio.onended = () => {
      setCurrentlyPlaying(null);
    };
  };

  // Arrêter le son en cours
  const stopSound = () => {
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

  // Gérer la réorganisation des sons dans un board
  const handleDragEnd = (result) => {
    if (!result.destination || !selectedBoard) return;

    const newSounds = [...selectedBoard.sounds];
    const [removed] = newSounds.splice(result.source.index, 1);
    newSounds.splice(result.destination.index, 0, removed);

    const updatedBoard = { ...selectedBoard, sounds: newSounds };
    updateSoundBoard(updatedBoard);
    setSelectedBoard(updatedBoard);
  };

  return (
    <div className="page-container">
      {selectedBoard ? (
        // Vue détaillée d'un soundboard
        <div>
          <button className="back-btn" onClick={() => setSelectedBoard(null)}>
            ← Retour
          </button>

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
                    onClick={stopSound}
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
      ) : (
        // Vue liste des soundboards
        <div>
          <div className="library-header">
            <h1 className="page-title">🎵 SoundBoards</h1>
            <button
              className="create-playlist-btn"
              onClick={() => setShowCreateModal(true)}
              style={{ background: currentTheme.gradient }}
            >
              ➕ Créer un SoundBoard
            </button>
          </div>

          {soundBoards.length === 0 ? (
            <div className="empty-state">
              <p>Aucun SoundBoard pour le moment</p>
              <p>Créez votre premier SoundBoard pour commencer !</p>
            </div>
          ) : (
            <div className="section">
              <h2 className="section-title">Mes SoundBoards ({soundBoards.length})</h2>
              <div className="grid grid-cols-4">
                {soundBoards.map(board => (
                  <div
                    key={board.id}
                    className="card"
                    style={{ background: currentTheme.gradient }}
                  >
                    <img 
                      src={board.cover} 
                      alt={board.name} 
                      className="card-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "SoundBoard/Images/default.png";
                      }}
                    />
                    <button
                      className="soundboard-options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoardForOptions(board);
                        setShowOptionsModal(true);
                      }}
                      title="Options"
                    >
                      ⋮
                    </button>
                    <h3 className="card-title">{board.name}</h3>
                    <p className="card-subtitle">{board.description}</p>
                    <p className="card-info">{board.sounds.length} sons</p>
                    <button
                      className="view-playlist-btn"
                      onClick={() => setSelectedBoard(board)}
                    >
                      Ouvrir le SoundBoard
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateSoundBoardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createSoundBoard}
          onImport={importSoundBoard}
        />
      )}

      {showEditModal && boardToEdit && (
        <EditSoundBoardModal
          board={boardToEdit}
          onClose={() => {
            setShowEditModal(false);
            setBoardToEdit(null);
          }}
          onSave={(updated) => {
            updateSoundBoard(updated);
            if (selectedBoard?.id === updated.id) {
              setSelectedBoard(updated);
            }
          }}
        />
      )}

      {showOptionsModal && boardForOptions && (
        <SoundBoardOptionsModal
          board={boardForOptions}
          onClose={() => {
            setShowOptionsModal(false);
            setBoardForOptions(null);
          }}
          onDelete={(id) => {
            deleteSoundBoard(id);
            if (selectedBoard?.id === id) {
              setSelectedBoard(null);
            }
          }}
          onEdit={(board) => {
            setBoardToEdit(board);
            setShowEditModal(true);
            setShowOptionsModal(false);
          }}
        />
      )}

      {showAddSoundModal && selectedBoard && (
        <AddSoundModal
          soundDatabase={soundDatabase}
          selectedBoard={selectedBoard}
          onClose={() => setShowAddSoundModal(false)}
          onAdd={(sound) => addSoundToBoard(selectedBoard.id, sound)}
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
      onClose();
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
          onClose();
        } catch (error) {
          alert('Erreur lors de l\'importation.');
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
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Description"
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
    onSave({ ...board, name: name.trim(), description: description.trim(), cover: cover.trim() || board.cover });
    onClose();
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
const SoundBoardOptionsModal = ({ board, onClose, onDelete, onEdit }) => {
  const { isDarkMode } = useTheme();

  const exportBoard = () => {
    const dataStr = JSON.stringify(board, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${board.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Options pour "{board.name}"</h2>
        <div className="playlist-options">
          <button className="option-btn edit-btn" onClick={() => onEdit(board)}>
            ✏️ Éditer le SoundBoard
          </button>
          <button className="option-btn export-btn" onClick={exportBoard}>
            📤 Exporter le SoundBoard
          </button>
          <button className="option-btn delete-btn" onClick={() => {
            if (window.confirm('Êtes-vous sûr de vouloir supprimer ce SoundBoard ?')) {
              onDelete(board.id);
              onClose();
            }
          }}>
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
            <p>Aucun son trouvé.</p>
          ) : (
            filteredSounds.map(sound => (
              <div key={sound.id} className="sound-selection-item">
                <img src={sound.cover} alt={sound.title} className="sound-selection-cover" />
                <div className="sound-selection-info">
                  <div className="sound-selection-title">{sound.title}</div>
                  <div className="sound-selection-artist">{sound.artist}</div>
                </div>
                <div className="sound-selection-duration">{sound.duration}</div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onAdd(sound);
                  }}
                  disabled={selectedBoard.sounds.find(s => s.id === sound.id)}
                  style={{ 
                    background: selectedBoard.sounds.find(s => s.id === sound.id) 
                      ? '#6b7280' 
                      : currentTheme.gradient 
                  }}
                >
                  {selectedBoard.sounds.find(s => s.id === sound.id) ? '✓ Ajouté' : '➕ Ajouter'}
                </button>
              </div>
            ))
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