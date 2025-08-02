import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Grande base de données de musiques (même que précédemment)
const musicDatabase = [
  // Pop Hits
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:22", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", genre: "Pop" },
  { id: 2, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", genre: "Pop" },
  { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", cover: "https://images.unsplash.com/photo-1535992165812-68d1861aa71e?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", genre: "Pop" },
  { id: 4, title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: "2:58", cover: "https://images.pexels.com/photos/6862590/pexels-photo-6862590.jpeg?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", genre: "Pop Rock" },
  { id: 5, title: "Stay", artist: "The Kid LAROI, Justin Bieber", album: "F*CK LOVE 3+", duration: "2:21", cover: "https://images.pexels.com/photos/6826021/pexels-photo-6826021.jpeg?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", genre: "Pop" },
  { id: 6, title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:47", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", genre: "Pop" },
  { id: 7, title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights", duration: "3:20", cover: "https://images.unsplash.com/photo-1560800452-f2d475982b96?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", genre: "Pop" },
  { id: 8, title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation", duration: "3:20", cover: "https://images.pexels.com/photos/6865913/pexels-photo-6865913.jpeg?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", genre: "Pop" },
  { id: 9, title: "Unholy", artist: "Sam Smith ft. Kim Petras", album: "Gloria", duration: "2:36", cover: "https://images.unsplash.com/photo-1623018035813-9cfb5b502e04?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", genre: "Pop" },
  
  // Rock/Alternative
  { id: 10, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: "3:58", cover: "https://images.unsplash.com/photo-1657042855066-7f09c6c2c350?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", genre: "Indie Rock" },
  { id: 11, title: "Shivers", artist: "Ed Sheeran", album: "=", duration: "3:27", cover: "https://images.unsplash.com/photo-1575285113814-f770cb8c796e?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", genre: "Pop Rock" },
  { id: 12, title: "Ghost", artist: "Justice", album: "Woman", duration: "4:12", cover: "https://images.unsplash.com/photo-1720887237251-f46eb98416c8?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", genre: "Electronic Rock" },
  
  // Hip-Hop/Rap
  { id: 13, title: "Industry Baby", artist: "Lil Nas X, Jack Harlow", album: "MONTERO", duration: "3:32", cover: "https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", genre: "Hip-Hop" },
  { id: 14, title: "Bad Habit", artist: "Steve Lacy", album: "Gemini Rights", duration: "3:52", cover: "https://images.pexels.com/photos/6865913/pexels-photo-6865913.jpeg?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", genre: "R&B" },
  { id: 15, title: "First Class", artist: "Jack Harlow", album: "Come Home The Kids Miss You", duration: "2:52", cover: "https://images.unsplash.com/photo-1623018035231-ebe361a64c76?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", genre: "Hip-Hop" },
  
  // Electronic/Dance
  { id: 16, title: "About Damn Time", artist: "Lizzo", album: "Special", duration: "3:12", cover: "https://images.unsplash.com/photo-1569411309162-52a667749a49?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", genre: "Pop" },
  { id: 17, title: "Running Up That Hill", artist: "Kate Bush", album: "Hounds of Love", duration: "4:58", cover: "https://images.pexels.com/photos/6862590/pexels-photo-6862590.jpeg?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", genre: "Alternative" },
  { id: 18, title: "I'm Good (Blue)", artist: "David Guetta & Bebe Rexha", album: "Single", duration: "2:55", cover: "https://images.pexels.com/photos/6826021/pexels-photo-6826021.jpeg?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", genre: "Electronic" },
  
  // R&B/Soul
  { id: 19, title: "Break My Soul", artist: "Beyoncé", album: "Renaissance", duration: "4:38", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3", genre: "R&B" },
  { id: 20, title: "Glimpse of Us", artist: "Joji", album: "Smithereens", duration: "3:53", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3", genre: "R&B" },
  
  // Alternative/Indie
  { id: 21, title: "Something in the Orange", artist: "Zach Bryan", album: "American Heartbreak", duration: "3:48", cover: "https://images.unsplash.com/photo-1535992165812-68d1861aa71e?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3", genre: "Country" },
  { id: 22, title: "Tití Me Preguntó", artist: "Bad Bunny", album: "Un Verano Sin Ti", duration: "4:02", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3", genre: "Latin" },
  { id: 23, title: "Me Porto Bonito", artist: "Bad Bunny x Chencho Corleone", album: "Un Verano Sin Ti", duration: "2:58", cover: "https://images.unsplash.com/photo-1657042855066-7f09c6c2c350?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3", genre: "Latin" },
  { id: 24, title: "Left and Right", artist: "Charlie Puth ft. Jung Kook", album: "Single", duration: "2:34", cover: "https://images.unsplash.com/photo-1560800452-f2d475982b96?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3", genre: "Pop" },
  
  // Plus de variété
  { id: 25, title: "Enemy", artist: "Imagine Dragons x JID", album: "Mercury - Act 1", duration: "2:53", cover: "https://images.unsplash.com/photo-1575285113814-f770cb8c796e?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3", genre: "Alternative Rock" },
  { id: 26, title: "Calm Down", artist: "Rema", album: "Rave & Roses", duration: "3:59", cover: "https://images.unsplash.com/photo-1720887237251-f46eb98416c8?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3", genre: "Afrobeats" },
  { id: 27, title: "Sunroof", artist: "Nicky Youre & dazy", album: "Single", duration: "2:42", cover: "https://images.pexels.com/photos/6865913/pexels-photo-6865913.jpeg?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3", genre: "Pop" },
  { id: 28, title: "2 Be Loved (Am I Ready)", artist: "Lizzo", album: "Special", duration: "3:30", cover: "https://images.unsplash.com/photo-1623018035813-9cfb5b502e04?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3", genre: "Pop" },
  { id: 29, title: "Wait for U", artist: "Future ft. Drake & Tems", album: "I Never Liked You", duration: "4:36", cover: "https://images.unsplash.com/photo-1623018035231-ebe361a64c76?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3", genre: "Hip-Hop" },
  { id: 30, title: "Music For a Sushi Restaurant", artist: "Harry Styles", album: "Harry's House", duration: "3:13", cover: "https://images.unsplash.com/photo-1569411309162-52a667749a49?w=300&h=300&fit=crop", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3", genre: "Pop Rock" }
];

// Playlists par défaut
const defaultPlaylists = [
  {
    id: 'default-1',
    name: "Mes favoris",
    description: "Ma playlist personnelle",
    cover: "https://images.unsplash.com/photo-1623018035813-9cfb5b502e04?w=300&h=300&fit=crop",
    tracks: [],
    isDefault: true
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [trackToAdd, setTrackToAdd] = useState(null);
  const [showPlaylistOptionsModal, setShowPlaylistOptionsModal] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState(null);
  
  // Nouveaux états pour le mode aléatoire
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [isRepeatMode, setIsRepeatMode] = useState(false); // 0: off, 1: repeat all, 2: repeat one
  
  const audioRef = useRef(null);

  // Charger les playlists depuis localStorage au démarrage
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('deezer-playlists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    } else {
      setPlaylists(defaultPlaylists);
    }
  }, []);

  // Sauvegarder les playlists dans localStorage à chaque modification
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem('deezer-playlists', JSON.stringify(playlists));
    }
  }, [playlists]);

  // Gestion du lecteur audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Gestion de la répétition et du passage à la chanson suivante
      if (isRepeatMode === 2) {
        // Répéter la chanson actuelle
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, isRepeatMode]);

  // Contrôle du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Fonction pour mélanger un tableau
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const playTrack = (track, playlist = null) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Définir la queue de lecture
    let queue = [];
    if (playlist && playlist.tracks.length > 0) {
      queue = playlist.tracks;
    } else if (selectedPlaylist && selectedPlaylist.tracks.length > 0) {
      queue = selectedPlaylist.tracks;
    } else {
      queue = musicDatabase;
    }
    
    // Appliquer le mélange si activé
    if (isShuffleMode) {
      const shuffledQueue = shuffleArray(queue);
      // S'assurer que la chanson actuelle est en première position
      const currentIndex = shuffledQueue.findIndex(t => t.id === track.id);
      if (currentIndex > 0) {
        [shuffledQueue[0], shuffledQueue[currentIndex]] = [shuffledQueue[currentIndex], shuffledQueue[0]];
      }
      setCurrentQueue(shuffledQueue);
    } else {
      setCurrentQueue(queue);
    }
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Erreur de lecture:', e));
      }
    }, 100);
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log('Erreur de lecture:', e));
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const nextTrack = () => {
    const queue = currentQueue.length > 0 ? currentQueue : musicDatabase;
    const currentIndex = queue.findIndex(track => track.id === currentTrack?.id);
    
    let nextIndex;
    if (isRepeatMode === 1 && currentIndex === queue.length - 1) {
      // Si on répète toute la playlist et qu'on est à la fin, revenir au début
      nextIndex = 0;
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    
    if (queue[nextIndex]) {
      playTrack(queue[nextIndex]);
    }
  };

  const previousTrack = () => {
    const queue = currentQueue.length > 0 ? currentQueue : musicDatabase;
    const currentIndex = queue.findIndex(track => track.id === currentTrack?.id);
    
    let prevIndex;
    if (isRepeatMode === 1 && currentIndex === 0) {
      // Si on répète toute la playlist et qu'on est au début, aller à la fin
      prevIndex = queue.length - 1;
    } else {
      prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    }
    
    if (queue[prevIndex]) {
      playTrack(queue[prevIndex]);
    }
  };

  const toggleShuffle = () => {
    setIsShuffleMode(!isShuffleMode);
    
    // Réorganiser la queue actuelle
    if (currentQueue.length > 0) {
      if (!isShuffleMode) {
        // Activer le mélange
        const shuffledQueue = shuffleArray(currentQueue);
        const currentIndex = shuffledQueue.findIndex(t => t.id === currentTrack?.id);
        if (currentIndex > 0) {
          [shuffledQueue[0], shuffledQueue[currentIndex]] = [shuffledQueue[currentIndex], shuffledQueue[0]];
        }
        setCurrentQueue(shuffledQueue);
      } else {
        // Désactiver le mélange - remettre dans l'ordre original
        if (selectedPlaylist) {
          setCurrentQueue(selectedPlaylist.tracks);
        } else {
          setCurrentQueue(musicDatabase);
        }
      }
    }
  };

  const toggleRepeat = () => {
    setIsRepeatMode((prev) => (prev + 1) % 3); // 0 -> 1 -> 2 -> 0
  };

  const getRepeatIcon = () => {
    switch (isRepeatMode) {
      case 0: return '🔁'; // Pas de répétition
      case 1: return '🔁'; // Répéter tout
      case 2: return '🔂'; // Répéter un
      default: return '🔁';
    }
  };

  const getRepeatTitle = () => {
    switch (isRepeatMode) {
      case 0: return 'Répétition désactivée';
      case 1: return 'Répéter toute la playlist';
      case 2: return 'Répéter la chanson actuelle';
      default: return 'Répétition désactivée';
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = musicDatabase.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()) ||
        track.album.toLowerCase().includes(query.toLowerCase()) ||
        track.genre.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Gestion des playlists
  const createPlaylist = (name, description) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      cover: "https://images.unsplash.com/photo-1569411309162-52a667749a49?w=300&h=300&fit=crop",
      tracks: [],
      isDefault: false
    };
    setPlaylists([...playlists, newPlaylist]);
    setShowCreatePlaylistModal(false);
  };

  const deletePlaylist = (playlistId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
      }
      setShowPlaylistOptionsModal(false);
    }
  };

  const addTrackToPlaylist = (playlistId, track) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        // Vérifier si la track n'est pas déjà dans la playlist
        if (!playlist.tracks.find(t => t.id === track.id)) {
          return { ...playlist, tracks: [...playlist.tracks, track] };
        }
      }
      return playlist;
    }));
    setShowAddToPlaylistModal(false);
    setTrackToAdd(null);
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, tracks: playlist.tracks.filter(t => t.id !== trackId) };
      }
      return playlist;
    }));
  };

  const openAddToPlaylistModal = (track) => {
    setTrackToAdd(track);
    setShowAddToPlaylistModal(true);
  };

  const openPlaylistOptionsModal = (playlist) => {
    setPlaylistToEdit(playlist);
    setShowPlaylistOptionsModal(true);
  };

  const playPlaylist = (playlist) => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist);
    }
  };

  const playPlaylistShuffle = (playlist) => {
    if (playlist.tracks.length > 0) {
      setIsShuffleMode(true);
      const shuffledTracks = shuffleArray(playlist.tracks);
      setCurrentQueue(shuffledTracks);
      playTrack(shuffledTracks[0], playlist);
    }
  };

  // Fonction pour ouvrir une playlist depuis la sidebar
  const openPlaylist = (playlist) => {
    setCurrentPage('library');
    setSelectedPlaylist(playlist);
  };

  return (
    <div className="App">
      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          preload="auto"
        />
      )}

      <div className="main-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>Deezer Clone</h1>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              <span>🏠</span>
              <span>Accueil</span>
            </button>
            <button 
              className={`nav-item ${currentPage === 'search' ? 'active' : ''}`}
              onClick={() => setCurrentPage('search')}
            >
              <span>🔍</span>
              <span>Rechercher</span>
            </button>
            <button 
              className={`nav-item ${currentPage === 'library' ? 'active' : ''}`}
              onClick={() => setCurrentPage('library')}
            >
              <span>📚</span>
              <span>Ma musique</span>
            </button>
          </nav>

          <div className="playlists-section">
            <div className="playlists-header">
              <h3 className="playlists-title">Playlists</h3>
              <button 
                className="add-playlist-btn"
                onClick={() => setShowCreatePlaylistModal(true)}
                title="Créer une playlist"
              >
                ➕
              </button>
            </div>
            {playlists.map(playlist => (
              <div key={playlist.id} className="playlist-item-container">
                <button 
                  className={`playlist-item ${selectedPlaylist?.id === playlist.id ? 'active' : ''}`}
                  onClick={() => openPlaylist(playlist)}
                  title="Ouvrir la playlist"
                >
                  <div className="playlist-name">{playlist.name}</div>
                  <div className="playlist-tracks">{playlist.tracks.length} titres</div>
                </button>
                {!playlist.isDefault && (
                  <button 
                    className="playlist-options-btn"
                    onClick={() => openPlaylistOptionsModal(playlist)}
                    title="Options de la playlist"
                  >
                    ⋮
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="content-area">
          {/* Top Bar */}
          <div className="top-bar">
            <div className="top-bar-content">
              <div className="nav-buttons">
                <button className="nav-button">←</button>
                <button className="nav-button">→</button>
              </div>
              
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Rechercher parmi 30+ titres..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              <div className="user-profile">
                <button className="profile-button">👤</button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="page-content">
            {currentPage === 'home' && (
              <div className="page-container">
                {/* Hero Section */}
                <div className="hero-section">
                  <div className="hero-content">
                    <h1 className="hero-title">Découvrez 30+ musiques</h1>
                    <p className="hero-subtitle">Mode aléatoire, playlists personnalisées et écoute sans publicité</p>
                    <div className="hero-buttons">
                      <button className="hero-button" onClick={() => playTrack(musicDatabase[0])}>
                        ▶️ Commencer l'écoute
                      </button>
                      <button className="hero-button-secondary" onClick={() => {
                        setIsShuffleMode(true);
                        const shuffled = shuffleArray(musicDatabase);
                        setCurrentQueue(shuffled);
                        playTrack(shuffled[0]);
                      }}>
                        🔀 Mode aléatoire
                      </button>
                    </div>
                  </div>
                </div>

                {/* Titres populaires */}
                <div className="section">
                  <h2 className="section-title">Titres populaires</h2>
                  <div className="grid grid-cols-3">
                    {musicDatabase.slice(0, 6).map(track => (
                      <div key={track.id} className="card">
                        <img src={track.cover} alt={track.title} className="card-image" />
                        <button 
                          className="play-button"
                          onClick={() => playTrack(track)}
                          title="Écouter maintenant"
                        >
                          {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          className="add-to-playlist-btn"
                          onClick={() => openAddToPlaylistModal(track)}
                          title="Ajouter à une playlist"
                        >
                          ➕
                        </button>
                        <h3 className="card-title">{track.title}</h3>
                        <p className="card-subtitle">{track.artist}</p>
                        <p className="card-info">{track.genre} • {track.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Par genre */}
                <div className="section">
                  <h2 className="section-title">Rock & Alternative</h2>
                  <div className="grid grid-cols-6">
                    {musicDatabase.filter(track => ['Indie Rock', 'Pop Rock', 'Alternative Rock', 'Alternative'].includes(track.genre)).slice(0, 6).map(track => (
                      <div key={track.id} className="card">
                        <img src={track.cover} alt={track.title} className="card-image" />
                        <button 
                          className="play-button"
                          onClick={() => playTrack(track)}
                        >
                          {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          className="add-to-playlist-btn"
                          onClick={() => openAddToPlaylistModal(track)}
                        >
                          ➕
                        </button>
                        <h3 className="card-title">{track.title}</h3>
                        <p className="card-subtitle">{track.artist}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section">
                  <h2 className="section-title">Hip-Hop & R&B</h2>
                  <div className="grid grid-cols-6">
                    {musicDatabase.filter(track => ['Hip-Hop', 'R&B'].includes(track.genre)).slice(0, 6).map(track => (
                      <div key={track.id} className="card">
                        <img src={track.cover} alt={track.title} className="card-image" />
                        <button 
                          className="play-button"
                          onClick={() => playTrack(track)}
                        >
                          {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          className="add-to-playlist-btn"
                          onClick={() => openAddToPlaylistModal(track)}
                        >
                          ➕
                        </button>
                        <h3 className="card-title">{track.title}</h3>
                        <p className="card-subtitle">{track.artist}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'search' && (
              <div className="page-container">
                {!searchQuery ? (
                  <div className="search-empty">
                    <div className="search-empty-icon">🔍</div>
                    <h2 className="search-empty-title">Rechercher dans {musicDatabase.length} musiques</h2>
                    <p className="search-empty-subtitle">Trouvez vos artistes, albums et titres préférés</p>
                    
                    <div className="genres-section">
                      <h3 className="genres-title">Rechercher par genre</h3>
                      <div className="genres-grid">
                        <div className="genre-card genre-pop" onClick={() => handleSearch('Pop')}>
                          <h4 className="genre-name">Pop</h4>
                        </div>
                        <div className="genre-card genre-rock" onClick={() => handleSearch('Rock')}>
                          <h4 className="genre-name">Rock</h4>
                        </div>
                        <div className="genre-card genre-hiphop" onClick={() => handleSearch('Hip-Hop')}>
                          <h4 className="genre-name">Hip-Hop</h4>
                        </div>
                        <div className="genre-card genre-electronic" onClick={() => handleSearch('R&B')}>
                          <h4 className="genre-name">R&B</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="search-results-header">
                      <h2 className="section-title">Résultats pour "{searchQuery}" ({searchResults.length})</h2>
                      {searchResults.length > 0 && (
                        <button 
                          className="shuffle-results-btn"
                          onClick={() => {
                            setIsShuffleMode(true);
                            const shuffled = shuffleArray(searchResults);
                            setCurrentQueue(shuffled);
                            playTrack(shuffled[0]);
                          }}
                        >
                          🔀 Lecture aléatoire
                        </button>
                      )}
                    </div>
                    <div className="track-list">
                      {searchResults.map((track, index) => (
                        <div key={track.id} className="track-item">
                          <div className="track-number">{index + 1}</div>
                          <button 
                            className="track-play-btn"
                            onClick={() => playTrack(track)}
                          >
                            {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                          </button>
                          <img src={track.cover} alt={track.title} className="track-cover" />
                          <div className="track-info">
                            <div className="track-title">{track.title}</div>
                            <div className="track-artist">{track.artist} • {track.album}</div>
                          </div>
                          <div className="track-genre">{track.genre}</div>
                          <button 
                            className="add-to-playlist-btn-small"
                            onClick={() => openAddToPlaylistModal(track)}
                            title="Ajouter à une playlist"
                          >
                            ➕
                          </button>
                          <div className="track-duration">{track.duration}</div>
                        </div>
                      ))}
                    </div>
                    {searchResults.length === 0 && (
                      <div className="search-empty">
                        <p>Aucun résultat trouvé pour "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentPage === 'library' && (
              <div className="page-container">
                {selectedPlaylist ? (
                  // Vue détaillée d'une playlist
                  <div>
                    <div className="playlist-header">
                      <button 
                        className="back-btn"
                        onClick={() => setSelectedPlaylist(null)}
                      >
                        ← Retour
                      </button>
                      <div className="playlist-info">
                        <img src={selectedPlaylist.cover} alt={selectedPlaylist.name} className="playlist-cover-large" />
                        <div className="playlist-details">
                          <p className="playlist-type">Playlist</p>
                          <h1 className="playlist-title-large">{selectedPlaylist.name}</h1>
                          <p className="playlist-description-large">{selectedPlaylist.description}</p>
                          <p className="playlist-stats">{selectedPlaylist.tracks.length} titres</p>
                          <div className="playlist-actions">
                            <button 
                              className="play-playlist-btn"
                              onClick={() => playPlaylist(selectedPlaylist)}
                              disabled={selectedPlaylist.tracks.length === 0}
                            >
                              ▶️ Lecture
                            </button>
                            <button 
                              className="shuffle-playlist-btn"
                              onClick={() => playPlaylistShuffle(selectedPlaylist)}
                              disabled={selectedPlaylist.tracks.length === 0}
                            >
                              🔀 Aléatoire
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="playlist-tracks">
                      {selectedPlaylist.tracks.length === 0 ? (
                        <div className="empty-playlist">
                          <p>Cette playlist est vide</p>
                          <p>Ajoutez des musiques depuis la recherche ou l'accueil</p>
                        </div>
                      ) : (
                        <div className="track-list">
                          {selectedPlaylist.tracks.map((track, index) => (
                            <div key={track.id} className="track-item">
                              <div className="track-number">{index + 1}</div>
                              <button 
                                className="track-play-btn"
                                onClick={() => playTrack(track, selectedPlaylist)}
                              >
                                {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                              </button>
                              <img src={track.cover} alt={track.title} className="track-cover" />
                              <div className="track-info">
                                <div className="track-title">{track.title}</div>
                                <div className="track-artist">{track.artist} • {track.album}</div>
                              </div>
                              <div className="track-genre">{track.genre}</div>
                              <button 
                                className="remove-from-playlist-btn"
                                onClick={() => removeTrackFromPlaylist(selectedPlaylist.id, track.id)}
                                title="Retirer de la playlist"
                              >
                                🗑️
                              </button>
                              <div className="track-duration">{track.duration}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Vue liste des playlists
                  <div>
                    <div className="library-header">
                      <h1 className="page-title">Ma musique</h1>
                      <button 
                        className="create-playlist-btn"
                        onClick={() => setShowCreatePlaylistModal(true)}
                      >
                        ➕ Créer une playlist
                      </button>
                    </div>
                    
                    <div className="section">
                      <h2 className="section-title">Mes playlists ({playlists.length})</h2>
                      <div className="grid grid-cols-4">
                        {playlists.map(playlist => (
                          <div key={playlist.id} className="card">
                            <img src={playlist.cover} alt={playlist.name} className="card-image" />
                            <button 
                              className="play-button"
                              onClick={() => playPlaylist(playlist)}
                              disabled={playlist.tracks.length === 0}
                            >
                              ▶️
                            </button>
                            <button 
                              className="shuffle-card-btn"
                              onClick={() => playPlaylistShuffle(playlist)}
                              disabled={playlist.tracks.length === 0}
                              title="Écouter en mode aléatoire"
                            >
                              🔀
                            </button>
                            <h3 className="card-title">{playlist.name}</h3>
                            <p className="card-subtitle">{playlist.description}</p>
                            <p className="card-info">{playlist.tracks.length} titres</p>
                            <button 
                              className="view-playlist-btn"
                              onClick={() => setSelectedPlaylist(playlist)}
                            >
                              Voir la playlist
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="section">
                      <div className="section-header">
                        <h2 className="section-title">Toutes les musiques ({musicDatabase.length})</h2>
                        <button 
                          className="shuffle-all-btn"
                          onClick={() => {
                            setIsShuffleMode(true);
                            const shuffled = shuffleArray(musicDatabase);
                            setCurrentQueue(shuffled);
                            playTrack(shuffled[0]);
                          }}
                        >
                          🔀 Tout écouter en aléatoire
                        </button>
                      </div>
                      <div className="track-list">
                        {musicDatabase.map((track, index) => (
                          <div key={track.id} className="track-item">
                            <div className="track-number">{index + 1}</div>
                            <button 
                              className="track-play-btn"
                              onClick={() => playTrack(track)}
                            >
                              {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                            </button>
                            <img src={track.cover} alt={track.title} className="track-cover" />
                            <div className="track-info">
                              <div className="track-title">{track.title}</div>
                              <div className="track-artist">{track.artist} • {track.album}</div>
                            </div>
                            <div className="track-genre">{track.genre}</div>
                            <button 
                              className="add-to-playlist-btn-small"
                              onClick={() => openAddToPlaylistModal(track)}
                              title="Ajouter à une playlist"
                            >
                              ➕
                            </button>
                            <div className="track-duration">{track.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Music Player */}
      {currentTrack && (
        <div className="music-player">
          <div className="player-content">
            <div className="player-track-info">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="player-cover"
              />
              <div className="player-track-details">
                <div className="player-track-title">{currentTrack.title}</div>
                <div className="player-track-artist">{currentTrack.artist}</div>
              </div>
              <button 
                className="player-heart-btn"
                onClick={() => openAddToPlaylistModal(currentTrack)}
                title="Ajouter à une playlist"
              >
                ➕
              </button>
            </div>

            <div className="player-controls">
              <div className="player-buttons">
                {/* Boutons de contrôle étendus */}
                <button 
                  className={`player-btn ${isShuffleMode ? 'active' : ''}`}
                  onClick={toggleShuffle}
                  title={isShuffleMode ? 'Désactiver le mode aléatoire' : 'Activer le mode aléatoire'}
                >
                  🔀
                </button>
                <button className="player-btn" onClick={previousTrack}>⏮️</button>
                <button className="player-play-btn" onClick={togglePlayPause}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="player-btn" onClick={nextTrack}>⏭️</button>
                <button 
                  className={`player-btn ${isRepeatMode > 0 ? 'active' : ''}`}
                  onClick={toggleRepeat}
                  title={getRepeatTitle()}
                >
                  {getRepeatIcon()}
                </button>
              </div>
              
              <div className="player-progress">
                <span className="player-time">{formatTime(currentTime)}</span>
                <div className="progress-bar" onClick={handleProgressClick}>
                  <div 
                    className="progress-fill" 
                    style={{width: duration ? `${(currentTime / duration) * 100}%` : '0%'}}
                  ></div>
                </div>
                <span className="player-time">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="player-right-controls">
              <div className="now-playing-indicator">
                {isPlaying && <span className="playing-animation">🎵</span>}
                <div className="playback-mode">
                  {isShuffleMode && <span className="mode-indicator">🔀</span>}
                  {isRepeatMode === 1 && <span className="mode-indicator">🔁</span>}
                  {isRepeatMode === 2 && <span className="mode-indicator">🔂</span>}
                </div>
              </div>
              <button 
                className="player-btn" 
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input 
                type="range" 
                className="volume-slider" 
                min="0" 
                max="1" 
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
              <button className="close-btn" onClick={() => setCurrentTrack(null)}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals (même code que précédemment) */}
      {showCreatePlaylistModal && (
        <CreatePlaylistModal 
          onClose={() => setShowCreatePlaylistModal(false)}
          onCreate={createPlaylist}
        />
      )}

      {showAddToPlaylistModal && trackToAdd && (
        <AddToPlaylistModal 
          track={trackToAdd}
          playlists={playlists}
          onClose={() => setShowAddToPlaylistModal(false)}
          onAdd={addTrackToPlaylist}
        />
      )}

      {showPlaylistOptionsModal && playlistToEdit && (
        <PlaylistOptionsModal 
          playlist={playlistToEdit}
          onClose={() => setShowPlaylistOptionsModal(false)}
          onDelete={deletePlaylist}
        />
      )}
    </div>
  );
}

// Composants des modals (même code que précédemment)
const CreatePlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Créer une nouvelle playlist</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nom de la playlist *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Ma nouvelle playlist"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Description de votre playlist"
              rows="3"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary">
              Créer
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

const AddToPlaylistModal = ({ track, playlists, onClose, onAdd }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Ajouter "{track.title}" à une playlist</h2>
        <div className="playlist-list">
          {playlists.length === 0 ? (
            <p>Aucune playlist disponible. Créez-en une d'abord !</p>
          ) : (
            playlists.map(playlist => (
              <button
                key={playlist.id}
                className="playlist-option"
                onClick={() => onAdd(playlist.id, track)}
              >
                <img src={playlist.cover} alt={playlist.name} className="playlist-option-cover" />
                <div className="playlist-option-info">
                  <div className="playlist-option-name">{playlist.name}</div>
                  <div className="playlist-option-tracks">{playlist.tracks.length} titres</div>
                </div>
                {playlist.tracks.find(t => t.id === track.id) && (
                  <span className="already-added">✓ Déjà ajouté</span>
                )}
              </button>
            ))
          )}
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaylistOptionsModal = ({ playlist, onClose, onDelete }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Options pour "{playlist.name}"</h2>
        <div className="playlist-options">
          <button 
            className="option-btn delete-btn"
            onClick={() => onDelete(playlist.id)}
          >
            🗑️ Supprimer la playlist
          </button>
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;