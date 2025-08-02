import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Grande base de données de musiques (même que précédemment)
const musicDatabase = [
  { id: 1, title: "Un quart d'heure", artist: "Satine", album: "", duration: "2.36", cover: "Musique/Images/font1.png", audioUrl: "Musique/Musique1.mp3", genre: "Pop" },
  { id: 2, title: "Côte Ouest", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font2.png", audioUrl: "Musique/Musique2.mp3", genre: "" },
  { id: 3, title: "Harakiri", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font3.png", audioUrl: "Musique/Musique3.mp3", genre: "" },
  { id: 4, title: "Bloody Stream", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font4.png", audioUrl: "Musique/Musique4.mp3", genre: "" },
  { id: 5, title: "Bad Hatter", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font5.png", audioUrl: "Musique/Musique5.mp3", genre: "" },
  { id: 6, title: "Black Betty", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font6.png", audioUrl: "Musique/Musique6.mp3", genre: "" },
  { id: 7, title: "Un air qui fait", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font7.png", audioUrl: "Musique/Musique7.mp3", genre: "" },
  { id: 8, title: "1000°C", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font8.png", audioUrl: "Musique/Musique8.mp3", genre: "" },
  { id: 9, title: "Wellerman (Sea Shanty)", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font9.png", audioUrl: "Musique/Musique9.mp3", genre: "" },
  { id: 10, title: "I Can't Fit In", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font10.png", audioUrl: "Musique/Musique10.mp3", genre: "" },
  { id: 11, title: "C'est pas grave", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font11.png", audioUrl: "Musique/Musique11.mp3", genre: "" },
  { id: 12, title: "Chaque soir", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font12.png", audioUrl: "Musique/Musique12.mp3", genre: "" },
  { id: 13, title: "Sur tes pas", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font13.png", audioUrl: "Musique/Musique13.mp3", genre: "" },
  { id: 14, title: "Fairytale", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font14.png", audioUrl: "Musique/Musique14.mp3", genre: "" },
  { id: 15, title: "Malade", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font15.png", audioUrl: "Musique/Musique15.mp3", genre: "" },
  { id: 16, title: "Bling‐Bang‐Bang‐Born", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font16.png", audioUrl: "Musique/Musique16.mp3", genre: "" },
  { id: 17, title: "Body Talks", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font17.png", audioUrl: "Musique/Musique17.mp3", genre: "" },
  { id: 18, title: "Colors By Flow", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font18.png", audioUrl: "Musique/Musique18.mp3", genre: "" },
  { id: 19, title: "Dans l'univers", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font19.png", audioUrl: "Musique/Musique19.mp3", genre: "" },
  { id: 20, title: "Poupée Russe", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font20.png", audioUrl: "Musique/Musique20.mp3", genre: "" },
  { id: 21, title: "À peu près", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font21.png", audioUrl: "Musique/Musique21.mp3", genre: "" },
  { id: 22, title: "Toutes les machines ont un coeur", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font22.png", audioUrl: "Musique/Musique22.mp3", genre: "" },
  { id: 23, title: "Épisode III - Les mains libres", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font23.png", audioUrl: "Musique/Musique23.mp3", genre: "" },
  { id: 24, title: "Empires", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font24.png", audioUrl: "Musique/Musique24.mp3", genre: "" },
  { id: 25, title: "Toxic", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font25.png", audioUrl: "Musique/Musique25.mp3", genre: "" },
  { id: 26, title: "Flicker", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font26.png", audioUrl: "Musique/Musique26.mp3", genre: "" },
  { id: 27, title: "Black Catcher", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font27.png", audioUrl: "Musique/Musique27.mp3", genre: "" },
  { id: 28, title: "Femme à la mer", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font28.png", audioUrl: "Musique/Musique28.mp3", genre: "" },
  { id: 29, title: "Chute d'étoiles", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font29.png", audioUrl: "Musique/Musique29.mp3", genre: "" },
  { id: 30, title: "Dis-moi que tu me détestes.", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font30.png", audioUrl: "Musique/Musique30.mp3", genre: "" },
  { id: 31, title: "Sundance", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font31.png", audioUrl: "Musique/Musique31.mp3", genre: "" },
  { id: 32, title: "30", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font32.png", audioUrl: "Musique/Musique32.mp3", genre: "" },
  { id: 33, title: "Trop beau", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font33.png", audioUrl: "Musique/Musique33.mp3", genre: "" },
  { id: 34, title: "La Quête", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font34.png", audioUrl: "Musique/Musique34.mp3", genre: "" },
  { id: 35, title: "Déprime", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font35.png", audioUrl: "Musique/Musique35.mp3", genre: "" },
  { id: 36, title: "Tchin Tchin", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font36.png", audioUrl: "Musique/Musique36.mp3", genre: "" },
  { id: 37, title: "Decrescendo", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font37.png", audioUrl: "Musique/Musique37.mp3", genre: "" },
  { id: 38, title: "Astronaute", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font38.png", audioUrl: "Musique/Musique38.mp3", genre: "" },
  { id: 39, title: "Dépassé", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font39.png", audioUrl: "Musique/Musique39.mp3", genre: "" },
  { id: 40, title: "Hit Sale", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font40.png", audioUrl: "Musique/Musique40.mp3", genre: "" },
  { id: 41, title: "Pierre, feuille, papier, ciseaux", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font41.png", audioUrl: "Musique/Musique41.mp3", genre: "" },
  { id: 42, title: "THE LONELIEST", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font42.png", audioUrl: "Musique/Musique42.mp3", genre: "" },
  { id: 43, title: "Daylight", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font43.png", audioUrl: "Musique/Musique43.mp3", genre: "" },
  { id: 44, title: "Ceux qui rêvent", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font44.png", audioUrl: "Musique/Musique44.mp3", genre: "" },
  { id: 45, title: "Sharks", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font45.png", audioUrl: "Musique/Musique45.mp3", genre: "" },
  { id: 46, title: "I WANNA BE YOUR SLAVE", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font46.png", audioUrl: "Musique/Musique46.mp3", genre: "" },
  { id: 47, title: "Riptide", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font47.png", audioUrl: "Musique/Musique47.mp3", genre: "" },
  { id: 48, title: "Évidemment", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font48.png", audioUrl: "Musique/Musique48.mp3", genre: "" },
  { id: 49, title: "House of Memories", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font49.png", audioUrl: "Musique/Musique49.mp3", genre: "" },
  { id: 50, title: "Heathens", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font50.png", audioUrl: "Musique/Musique50.mp3", genre: "" },
  { id: 51, title: "Mockingbird", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font51.png", audioUrl: "Musique/Musique51.mp3", genre: "" },
  { id: 52, title: "Stressed Out", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font52.png", audioUrl: "Musique/Musique52.mp3", genre: "" },
  { id: 53, title: "Actrice Fantôme", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font53.png", audioUrl: "Musique/Musique53.mp3", genre: "" },
  { id: 54, title: "Gangsta's Paradise", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font54.png", audioUrl: "Musique/Musique54.mp3", genre: "" },
  { id: 55, title: "Stolen Dance", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font55.png", audioUrl: "Musique/Musique55.mp3", genre: "" },
  { id: 56, title: "Feed the Machine", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font56.png", audioUrl: "Musique/Musique56.mp3", genre: "" },
  { id: 57, title: "Le stade", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font57.png", audioUrl: "Musique/Musique57.mp3", genre: "" },
  { id: 58, title: "Help me", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font58.png", audioUrl: "Musique/Musique58.mp3", genre: "" },
  { id: 59, title: "IDGAF", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font59.png", audioUrl: "Musique/Musique59.mp3", genre: "" },
  { id: 60, title: "Ma Meilleure Ennemie", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font60.png", audioUrl: "Musique/Musique60.mp3", genre: "" },
  { id: 61, title: "Roi", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font61.png", audioUrl: "Musique/Musique61.mp3", genre: "" },
  { id: 62, title: "Futur", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font62.png", audioUrl: "Musique/Musique62.mp3", genre: "" },
  { id: 63, title: "God-Ish", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font63.png", audioUrl: "Musique/Musique63.mp3", genre: "" },
  { id: 64, title: "Golden Hour", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font64.png", audioUrl: "Musique/Musique64.mp3", genre: "" },
  { id: 65, title: "Im Doing Fine", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font65.png", audioUrl: "Musique/Musique65.mp3", genre: "" },
  { id: 66, title: "Feel Good Inc.", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font66.png", audioUrl: "Musique/Musique66.mp3", genre: "" },
  { id: 67, title: "Give and Take", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font67.png", audioUrl: "Musique/Musique67.mp3", genre: "" },
  { id: 68, title: "Je ne pense qu'à ça", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font68.png", audioUrl: "Musique/Musique68.mp3", genre: "" },
  { id: 69, title: "Crush", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font69.png", audioUrl: "Musique/Musique69.mp3", genre: "" },
  { id: 70, title: "Radioactive", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font70.png", audioUrl: "Musique/Musique70.mp3", genre: "" },
  { id: 71, title: "Mood", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font71.png", audioUrl: "Musique/Musique71.mp3", genre: "" },
  { id: 72, title: "Vampire", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font72.png", audioUrl: "Musique/Musique72.mp3", genre: "" },
  { id: 73, title: "Anxiety", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font73.png", audioUrl: "Musique/Musique73.mp3", genre: "" },
  { id: 74, title: "Handclap", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font74.png", audioUrl: "Musique/Musique74.mp3", genre: "" },
  { id: 75, title: "Hardware Store", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font75.png", audioUrl: "Musique/Musique75.mp3", genre: "" },
  { id: 76, title: "Hit The Road Jack", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font76.png", audioUrl: "Musique/Musique76.mp3", genre: "" },
  { id: 77, title: "I Wanna Be Like You", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font77.png", audioUrl: "Musique/Musique77.mp3", genre: "" },
  { id: 78, title: "Light up the night", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font78.png", audioUrl: "Musique/Musique78.mp3", genre: "" },
  { id: 79, title: "No Strings Attached", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font79.png", audioUrl: "Musique/Musique79.mp3", genre: "" },
  { id: 80, title: "Overwhelmed", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font80.png", audioUrl: "Musique/Musique80.mp3", genre: "" },
  { id: 81, title: "Party likes it's 1920", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font81.png", audioUrl: "Musique/Musique81.mp3", genre: "" },
  { id: 82, title: "Problematic", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font82.png", audioUrl: "Musique/Musique82.mp3", genre: "" },
  { id: 83, title: "Reflection", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font83.png", audioUrl: "Musique/Musique83.mp3", genre: "" },
  { id: 84, title: "Rockstar", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font84.png", audioUrl: "Musique/Musique84.mp3", genre: "" },
  { id: 85, title: "Star Walkin", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font85.png", audioUrl: "Musique/Musique85.mp3", genre: "" },
  { id: 86, title: "Shiawase no Monosashi", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font86.png", audioUrl: "Musique/Musique86.mp3", genre: "" },
  { id: 87, title: "Sweater weather", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font87.png", audioUrl: "Musique/Musique87.mp3", genre: "" },
  { id: 88, title: "Two moons", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font88.png", audioUrl: "Musique/Musique88.mp3", genre: "" },
  { id: 89, title: "Understand", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font89.png", audioUrl: "Musique/Musique89.mp3", genre: "" },
  { id: 90, title: "Up & Down", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font90.png", audioUrl: "Musique/Musique90.mp3", genre: "" },
  { id: 91, title: "Usseewa", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font91.png", audioUrl: "Musique/Musique91.mp3", genre: "" },
  { id: 92, title: "Wild side", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font92.png", audioUrl: "Musique/Musique92.mp3", genre: "" },
  { id: 93, title: "World's smallest violin", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font93.png", audioUrl: "Musique/Musique93.mp3", genre: "" },
  { id: 94, title: "Veil", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font94.png", audioUrl: "Musique/Musique94.mp3", genre: "" },
  { id: 95, title: "Star shopping", artist: "Artiste", album: "", duration: "", cover: "Musique/Images/font95.png", audioUrl: "Musique/Musique95.mp3", genre: "" },
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
            <h1>Spotizer</h1>
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
                    {musicDatabase.slice(0, 95).map(track => (
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
                        <div className="genre-card genre-test" onClick={() => handleSearch('Test')}>
                          <h4 className="genre-name">Test</h4>
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