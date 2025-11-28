import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { MusicProvider, useMusic } from './contexts/MusicContext';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import QueuePanel from './components/QueuePanel';
import ThemeSelector from './components/ThemeSelector';
import SleepTimerModal from './components/SleepTimerModal';
import StatsPage from './components/StatsPage';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';const musicDatabase = [
{ id: 1, title: "Un quart d'heure", artist: "Satine", album: "", duration: "2:36", cover: "Musique/Images/font1.png", audioUrl: "Musique/Musique1.mp3", genre: "Pop" },
{ id: 2, title: "Côte Ouest", artist: "47Ter", album: "", duration: "3:51", cover: "Musique/Images/font2.png", audioUrl: "Musique/Musique2.mp3", genre: "Rap" },
{ id: 3, title: "Harakiri", artist: "47Ter", album: "", duration: "3:01", cover: "Musique/Images/font3.png", audioUrl: "Musique/Musique3.mp3", genre: "Rap" },
{ id: 4, title: "Bloody Stream", artist: "JoJo's Bizarre Adventure", album: "", duration: "4:21", cover: "Musique/Images/font4.png", audioUrl: "Musique/Musique4.mp3", genre: "Opening" },
{ id: 5, title: "Bad Hatter", artist: "DYES IWASAKI", album: "", duration: "2:57", cover: "Musique/Images/font5.png", audioUrl: "Musique/Musique5.mp3", genre: "Electro" }, 
{ id: 6, title: "Black Betty", artist: "Ram Jam", album: "", duration: "2:24", cover: "Musique/Images/font6.png", audioUrl: "Musique/Musique6.mp3", genre: "Rock" },
{ id: 7, title: "Un air qui fait", artist: "47Ter", album: "", duration: "3:46", cover: "Musique/Images/font7.png", audioUrl: "Musique/Musique7.mp3", genre: "Rap" },
{ id: 8, title: "1000°C", artist: "Lomepal ft. Roméo Elvis", album: "", duration: "4:41", cover: "Musique/Images/font8.png", audioUrl: "Musique/Musique8.mp3", genre: "Rap" }, 
{ id: 9, title: "Wellerman (Sea Shanty)", artist: "Nathan Evans", album: "", duration: "2:35", cover: "Musique/Images/font9.png", audioUrl: "Musique/Musique9.mp3", genre: "Folk" },
{ id: 10, title: "I Can't Fit In", artist: "Marino", album: "", duration: "2:09", cover: "Musique/Images/font10.png", audioUrl: "Musique/Musique10.mp3", genre: "Indie" },
{ id: 11, title: "C'est pas grave", artist: "Columbine ", album: "", duration: "2:41", cover: "Musique/Images/font11.png", audioUrl: "Musique/Musique11.mp3", genre: "Pop" },
{ id: 12, title: "Chaque soir", artist: "47Ter", album: "", duration: "3:14", cover: "Musique/Images/font12.png", audioUrl: "Musique/Musique12.mp3", genre: "Rap" },
{ id: 13, title: "Sur tes pas", artist: "Wakfu", album: "", duration: "4:01", cover: "Musique/Images/font13.png", audioUrl: "Musique/Musique13.mp3", genre: "Opening" }, 
{ id: 14, title: "Fairytale", artist: "Alexander Rybak", album: "", duration: "3:02", cover: "Musique/Images/font14.png", audioUrl: "Musique/Musique14.mp3", genre: "Pop" }, 
{ id: 15, title: "Malade", artist: "Roméo Elvis", album: "", duration: "3:11", cover: "Musique/Images/font15.png", audioUrl: "Musique/Musique15.mp3", genre: "Rap" },
{ id: 16, title: "Bling-Bang-Bang-Born", artist: "Mashle", album: "", duration: "2:48", cover: "Musique/Images/font16.png", audioUrl: "Musique/Musique16.mp3", genre: "Opening" }, 
{ id: 17, title: "Body Talks", artist: "The Struts", album: "", duration: "3:00", cover: "Musique/Images/font17.png", audioUrl: "Musique/Musique17.mp3", genre: "Rock" },
{ id: 18, title: "Colors By Flow", artist: "Code Geass", album: "", duration: "3:38", cover: "Musique/Images/font18.png", audioUrl: "Musique/Musique18.mp3", genre: "Opening" }, 
{ id: 19, title: "Dans l'univers", artist: "Nekfeu", album: "", duration: "4:06", cover: "Musique/Images/font19.png", audioUrl: "Musique/Musique19.mp3", genre: "Rap" }, 
{ id: 20, title: "Poupée Russe", artist: "Lujipeka", album: "", duration: "2:44", cover: "Musique/Images/font20.png", audioUrl: "Musique/Musique20.mp3", genre: "Rap" },
{ id: 21, title: "À peu près", artist: "Lomepal", album: "", duration: "3:24", cover: "Musique/Images/font21.png", audioUrl: "Musique/Musique21.mp3", genre: "Rap" },
{ id: 22, title: "Toutes les machines ont un coeur", artist: "Maëlle", album: "", duration: "4:19", cover: "Musique/Images/font22.png", audioUrl: "Musique/Musique22.mp3", genre: "Pop" },
{ id: 23, title: "Épisode III - Les mains libres", artist: "Columbine", album: "", duration: "3:40", cover: "Musique/Images/font23.png", audioUrl: "Musique/Musique23.mp3", genre: "Rap" },
{ id: 24, title: "Empires", artist: "The Smashing Pumpkins", album: "", duration: "3:10", cover: "Musique/Images/font24.png", audioUrl: "Musique/Musique24.mp3", genre: "Rock" },
{ id: 25, title: "Toxic", artist: "Britney Spears", album: "", duration: "2:50", cover: "Musique/Images/font25.png", audioUrl: "Musique/Musique25.mp3", genre: "Pop" },
{ id: 26, title: "Flicker", artist: "Porter Robinson", album: "", duration: "3:14", cover: "Musique/Images/font26.png", audioUrl: "Musique/Musique26.mp3", genre: "Electro" },
{ id: 27, title: "Black Catcher", artist: "Black Clover", album: "", duration: "3:18", cover: "Musique/Images/font27.png", audioUrl: "Musique/Musique27.mp3", genre: "Opening" }, 
{ id: 28, title: "Femme à la mer", artist: "Hoshi", album: "", duration: "3:59", cover: "Musique/Images/font28.png", audioUrl: "Musique/Musique28.mp3", genre: "Pop" },
{ id: 29, title: "Chute d'étoiles", artist: "Suzuya", album: "", duration: "2:12", cover: "Musique/Images/font29.png", audioUrl: "Musique/Musique29.mp3", genre: "Rap" },
{ id: 30, title: "Dis-moi que tu me détestes.", artist: "Suzuya", album: "", duration: "2:05", cover: "Musique/Images/font30.png", audioUrl: "Musique/Musique30.mp3", genre: "Rap" },
{ id: 31, title: "Sundance", artist: "Parcels", album: "", duration: "2:50", cover: "Musique/Images/font31.png", audioUrl: "Musique/Musique31.mp3", genre: "Disco-Funk" }, 
{ id: 32, title: "30", artist: "47Ter", album: "", duration: "3:32", cover: "Musique/Images/font32.png", audioUrl: "Musique/Musique32.mp3", genre: "Pop" },
{ id: 33, title: "Trop beau", artist: "Lomepal", album: "", duration: "4:04", cover: "Musique/Images/font33.png", audioUrl: "Musique/Musique33.mp3", genre: "Rap" },
{ id: 34, title: "La Quête", artist: "Orelsan", album: "", duration: "3:54", cover: "Musique/Images/font34.png", audioUrl: "Musique/Musique34.mp3", genre: "Rap" },
{ id: 35, title: "Déprime", artist: "Mastu", album: "", duration: "3:19", cover: "Musique/Images/font35.png", audioUrl: "Musique/Musique35.mp3", genre: "Rap" },
{ id: 36, title: "Tchin Tchin", artist: "Rilès", album: "", duration: "2:36", cover: "Musique/Images/font36.png", audioUrl: "Musique/Musique36.mp3", genre: "Rap" },
{ id: 37, title: "Decrescendo", artist: "Lomepal", album: "", duration: "3:41", cover: "Musique/Images/font37.png", audioUrl: "Musique/Musique37.mp3", genre: "Pop" },
{ id: 38, title: "Astronaute", artist: "Nekfeu", album: "", duration: "6:58", cover: "Musique/Images/font38.png", audioUrl: "Musique/Musique38.mp3", genre: "Rap" },
{ id: 39, title: "Dépassé", artist: "Nuit Incolore", album: "", duration: "2:52", cover: "Musique/Images/font39.png", audioUrl: "Musique/Musique39.mp3", genre: "Pop" },
{ id: 40, title: "Hit Sale", artist: "Therapie Taxi ft. Roméo Elvis", album: "", duration: "3:19", cover: "Musique/Images/font40.png", audioUrl: "Musique/Musique40.mp3", genre: "Pop" }, 
{ id: 41, title: "Pierre, feuille, papier, ciseaux", artist: "Ycare", album: "", duration: "3:45", cover: "Musique/Images/font41.png", audioUrl: "Musique/Musique41.mp3", genre: "Pop" },
{ id: 42, title: "THE LONELIEST", artist: "Måneskin", album: "", duration: "4:47", cover: "Musique/Images/font42.png", audioUrl: "Musique/Musique42.mp3", genre: "Rock" },
{ id: 43, title: "Daylight", artist: "David Kushner", album: "", duration: "3:49", cover: "Musique/Images/font43.png", audioUrl: "Musique/Musique43.mp3", genre: "Pop" },
{ id: 44, title: "Ceux qui rêvent", artist: "Pomme", album: "", duration: "1:58", cover: "Musique/Images/font44.png", audioUrl: "Musique/Musique44.mp3", genre: "Pop" },
{ id: 45, title: "Sharks", artist: "Imagine Dragons", album: "", duration: "3:36", cover: "Musique/Images/font45.png", audioUrl: "Musique/Musique45.mp3", genre: "Rock" },
{ id: 46, title: "I WANNA BE YOUR SLAVE", artist: "Måneskin", album: "", duration: "2:52", cover: "Musique/Images/font46.png", audioUrl: "Musique/Musique46.mp3", genre: "Rock" },
{ id: 47, title: "Riptide", artist: "Vance Joy", album: "", duration: "3:24", cover: "Musique/Images/font47.png", audioUrl: "Musique/Musique47.mp3", genre: "Indie Folk" }, 
{ id: 48, title: "Évidemment", artist: "Angèle", album: "", duration: "3:18", cover: "Musique/Images/font48.png", audioUrl: "Musique/Musique48.mp3", genre: "Pop" },
{ id: 49, title: "House of Memories", artist: "Panic! At The Disco", album: "", duration: "3:29", cover: "Musique/Images/font49.png", audioUrl: "Musique/Musique49.mp3", genre: "Rock" },
{ id: 50, title: "Heathens", artist: "Twenty One Pilots", album: "", duration: "3:14", cover: "Musique/Images/font50.png", audioUrl: "Musique/Musique50.mp3", genre: "Alternative" }, 
{ id: 51, title: "Mockingbird", artist: "Eminem", album: "", duration: "4:17", cover: "Musique/Images/font51.png", audioUrl: "Musique/Musique51.mp3", genre: "Rap" },
{ id: 52, title: "Stressed Out", artist: "Twenty One Pilots", album: "", duration: "3:22", cover: "Musique/Images/font52.png", audioUrl: "Musique/Musique52.mp3", genre: "Alternative" }, 
{ id: 53, title: "Actrice Fantôme", artist: "Suzuya", album: "", duration: "2:52", cover: "Musique/Images/font53.png", audioUrl: "Musique/Musique53.mp3", genre: "Pop Indé" }, 
{ id: 54, title: "Gangsta's Paradise", artist: "Coolio ft. L.V.", album: "", duration: "4:01", cover: "Musique/Images/font54.png", audioUrl: "Musique/Musique54.mp3", genre: "Rap" }, 
{ id: 55, title: "Stolen Dance", artist: "Milky Chance", album: "", duration: "5:13", cover: "Musique/Images/font55.png", audioUrl: "Musique/Musique55.mp3", genre: "Indie" },
{ id: 56, title: "Feed the Machine", artist: "Poor Man's Poison", album: "", duration: "3:03", cover: "Musique/Images/font56.png", audioUrl: "Musique/Musique56.mp3", genre: "Folk" },
{ id: 57, title: "Le stade", artist: "Fredz", album: "", duration: "2:35", cover: "Musique/Images/font57.png", audioUrl: "Musique/Musique57.mp3", genre: "Pop" },
{ id: 58, title: "Help me", artist: "Clover", album: "", duration: "4:20", cover: "Musique/Images/font58.png", audioUrl: "Musique/Musique58.mp3", genre: "Indie" },
{ id: 59, title: "IDGAF", artist: "BoyWithUke", album: "", duration: "2:26", cover: "Musique/Images/font59.png", audioUrl: "Musique/Musique59.mp3", genre: "Pop" },
{ id: 60, title: "Ma Meilleure Ennemie", artist: "Pomme", album: "", duration: "2:28", cover: "Musique/Images/font60.png", audioUrl: "Musique/Musique60.mp3", genre: "Pop" }, 
{ id: 61, title: "Roi", artist: "Adèle Castillon", album: "", duration: "3:49", cover: "Musique/Images/font61.png", audioUrl: "Musique/Musique61.mp3", genre: "Indie" },
{ id: 62, title: "Futur", artist: "DYES IWASAKI", album: "", duration: "3:22", cover: "Musique/Images/font62.png", audioUrl: "Musique/Musique62.mp3", genre: "Pop" },
{ id: 63, title: "God-Ish", artist: "PinocchioP", album: "", duration: "3:24", cover: "Musique/Images/font63.png", audioUrl: "Musique/Musique63.mp3", genre: "Alternative" }, 
{ id: 64, title: "Golden Hour", artist: "JVKE", album: "", duration: "3:51", cover: "Musique/Images/font64.png", audioUrl: "Musique/Musique64.mp3", genre: "Pop" },
{ id: 65, title: "I'm Doing Fine", artist: "BoyWithUke", album: "", duration: "1:39", cover: "Musique/Images/font65.png", audioUrl: "Musique/Musique65.mp3", genre: "Pop" },
{ id: 66, title: "Feel Good Inc.", artist: "Gorillaz", album: "", duration: "4:13", cover: "Musique/Images/font66.png", audioUrl: "Musique/Musique66.mp3", genre: "Alternative" }, 
{ id: 67, title: "Give and Take", artist: "Poor Man's Poison", album: "", duration: "3:17", cover: "Musique/Images/font67.png", audioUrl: "Musique/Musique67.mp3", genre: "Folk" },
{ id: 68, title: "Je ne pense qu'à ça", artist: "Angèle", album: "", duration: "2:34", cover: "Musique/Images/font68.png", audioUrl: "Musique/Musique68.mp3", genre: "Pop" },
{ id: 69, title: "Crush", artist: "Nuit Incolore", album: "", duration: "3:12", cover: "Musique/Images/font69.png", audioUrl: "Musique/Musique69.mp3", genre: "Pop" },
{ id: 70, title: "Radioactive", artist: "Imagine Dragons", album: "", duration: "3:05", cover: "Musique/Images/font70.png", audioUrl: "Musique/Musique70.mp3", genre: "Alternative" }, 
{ id: 71, title: "Mood", artist: "24kGoldn ft. iann dior", album: "", duration: "2:30", cover: "Musique/Images/font71.png", audioUrl: "Musique/Musique71.mp3", genre: "Rap" }, 
{ id: 72, title: "Vampire", artist: "Olivia Rodrigo", album: "", duration: "2:17", cover: "Musique/Images/font72.png", audioUrl: "Musique/Musique72.mp3", genre: "Pop" },
{ id: 73, title: "Anxiety", artist: "Doechii", album: "", duration: "4:09", cover: "Musique/Images/font73.png", audioUrl: "Musique/Musique73.mp3", genre: "Pop" },
{ id: 74, title: "Handclap", artist: "Fitz and The Tantrums", album: "", duration: "3:11", cover: "Musique/Images/font74.png", audioUrl: "Musique/Musique74.mp3", genre: "Soul-Pop" }, 
{ id: 75, title: "Hardware Store", artist: "Weird Al Yankovic", album: "", duration: "3:44", cover: "Musique/Images/font75.png", audioUrl: "Musique/Musique75.mp3", genre: "Comedy" },
{ id: 76, title: "Hit The Road Jack", artist: "Ray Charles", album: "", duration: "2:02", cover: "Musique/Images/font76.png", audioUrl: "Musique/Musique76.mp3", genre: "R&B" }, 
{ id: 77, title: "I Wanna Be Like You", artist: "Louis Prima, Phil Harris & Bruce Reitherman", album: "", duration: "2:01", cover: "Musique/Images/font77.png", audioUrl: "Musique/Musique77.mp3", genre: "Jazz" }, 
{ id: 78, title: "Light up the night", artist: "The Protomen", album: "", duration: "3:53", cover: "Musique/Images/font78.png", audioUrl: "Musique/Musique78.mp3", genre: "Rock" },
{ id: 79, title: "No Strings Attached", artist: "*N Sync", album: "", duration: "4:07", cover: "Musique/Images/font79.png", audioUrl: "Musique/Musique79.mp3", genre: "Pop" }, 
{ id: 80, title: "Overwhelmed", artist: "Royal & the Serpent", album: "", duration: "3:26", cover: "Musique/Images/font80.png", audioUrl: "Musique/Musique80.mp3", genre: "Alternative" }, 
{ id: 81, title: "Party like it's 1920", artist: "Tobias Dray", album: "", duration: "3:05", cover: "Musique/Images/font81.png", audioUrl: "Musique/Musique81.mp3", genre: "Swing-Pop" }, 
{ id: 82, title: "Problematic", artist: "BoyWithUke", album: "", duration: "3:33", cover: "Musique/Images/font82.png", audioUrl: "Musique/Musique82.mp3", genre: "Pop" },
{ id: 83, title: "Reflection", artist: "Christina Aguilera", album: "", duration: "3:19", cover: "Musique/Images/font83.png", audioUrl: "Musique/Musique83.mp3", genre: "Pop" },
{ id: 84, title: "Rockstar", artist: "BoyWithUke", album: "", duration: "4:32", cover: "Musique/Images/font84.png", audioUrl: "Musique/Musique84.mp3", genre: "Pop" },
{ id: 85, title: "Star Walkin", artist: "Lil Nas X", album: "", duration: "3:27", cover: "Musique/Images/font85.png", audioUrl: "Musique/Musique85.mp3", genre: "Pop Rap" }, 
{ id: 86, title: "Shiawase no Monosashi", artist: "Ai Kayano", album: "", duration: "5:00", cover: "Musique/Images/font86.png", audioUrl: "Musique/Musique86.mp3", genre: "Opening" }, 
{ id: 87, title: "Sweater weather", artist: "The Neighbourhood", album: "", duration: "3:57", cover: "Musique/Images/font87.png", audioUrl: "Musique/Musique87.mp3", genre: "Alternative" }, 
{ id: 88, title: "Two moons", artist: "BoyWithUke", album: "", duration: "3:56", cover: "Musique/Images/font88.png", audioUrl: "Musique/Musique88.mp3", genre: "Pop" },
{ id: 89, title: "Understand", artist: "BoyWithUke", album: "", duration: "3:14", cover: "Musique/Images/font89.png", audioUrl: "Musique/Musique89.mp3", genre: "Pop" },
{ id: 90, title: "Up & Down", artist: "EXGF", album: "", duration: "2:44", cover: "Musique/Images/font90.png", audioUrl: "Musique/Musique90.mp3", genre: "Electro" },
{ id: 91, title: "Usseewa", artist: "Ado", album: "", duration: "3:24", cover: "Musique/Images/font91.png", audioUrl: "Musique/Musique91.mp3", genre: "J-Pop" }, 
{ id: 92, title: "Wild side", artist: "Beastars", album: "", duration: "2:38", cover: "Musique/Images/font92.png", audioUrl: "Musique/Musique92.mp3", genre: "Opening" }, 
{ id: 93, title: "World's smallest violin", artist: "AJR", album: "", duration: "3:07", cover: "Musique/Images/font93.png", audioUrl: "Musique/Musique93.mp3", genre: "Alternative" }, 
{ id: 94, title: "Veil", artist: "Fire Force", album: "", duration: "3:28", cover: "Musique/Images/font94.png", audioUrl: "Musique/Musique94.mp3", genre: "Opening" }, 
{ id: 95, title: "Star shopping", artist: "Lil Peep", album: "", duration: "2:22", cover: "Musique/Images/font95.png", audioUrl: "Musique/Musique95.mp3", genre: "Emo Rap" }, 
];const defaultPlaylists = [
{
id: 'default-1',
name: "Mes favoris",
description: "Ma playlist personnelle",
cover: "https://media.discordapp.net/attachments/968955109155418132/1401255944725467136/TheStars.png?ex=688f9ccb&is=688e4b4b&hm=e541b37c4d19098a587549aa4d704fa34889dd20cc4dcb5b725668ca11e191bb&=&format=webp&quality=lossless",
tracks: [],
isDefault: true
}
];const PlaylistOptionsModal = ({ playlist, onClose, onDelete, onEdit, onExport }) => {
const { isDarkMode } = useTheme();
return (
<div className="modal-backdrop" onClick={onClose}>
<div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
<h2 className="modal-title">Options pour "{playlist.name}"</h2>
<div className="playlist-options">
<button
className="option-btn edit-btn"
onClick={() => {
onClose();
onEdit(playlist);
}}
>
✏️ Éditer la playlist
</button>
<button
className="option-btn export-btn"
onClick={() => onExport(playlist)}
>
📤 Exporter la playlist
</button>
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
};const PlaylistEditModal = ({ playlist, onClose, onSave }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState(playlist.name || '');
const [description, setDescription] = useState(playlist.description || '');
const [cover, setCover] = useState(playlist.cover || '');const handleSubmit = (e) => {
e.preventDefault();if (!name.trim()) {
alert("Le nom de la playlist est obligatoire !");
return;
}onSave({
...playlist,
name: name.trim(),
description: description.trim(),
cover: cover.trim() || playlist.cover,
});onClose();
};return (
<div className="modal-backdrop" onClick={onClose}>
<div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
<h2 className="modal-title">Modifier la playlist</h2>
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
placeholder="https://exemple.com/image.jpg"
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
};const CreatePlaylistModal = ({ onClose, onCreate, onImport }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [cover, setCover] = useState('');
const fileInputRef = useRef(null);const handleSubmit = (e) => {
e.preventDefault();
if (name.trim()) {
onCreate(name.trim(), description.trim(), cover.trim());
setName('');
setDescription('');
setCover('');
}
};const handleImport = (e) => {
const file = e.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
try {
const importedPlaylist = JSON.parse(event.target.result);
onImport(importedPlaylist);
onClose();
} catch (error) {
alert('Erreur lors de l\'importation. Assurez-vous que le fichier est au bon format.');
}
};
reader.readAsText(file);
}
};return (
<div className="modal-backdrop" onClick={onClose}>
<div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
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
<div className="form-group">
<label className="form-label">URL de la cover (optionnel)</label>
<input
type="url"
value={cover}
onChange={(e) => setCover(e.target.value)}
className="form-input"
placeholder="https://exemple.com/image.jpg"
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
📥 Importer une playlist
</button>
</div>
</div>
</div>
);
};const AddToPlaylistModal = ({ track, playlists, onClose, onAdd }) => {
const { isDarkMode, currentTheme } = useTheme();
return (
<div className="modal-backdrop" onClick={onClose}>
<div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
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
<span className="already-added" style={{ color: currentTheme.primary }}>✓ Déjà ajouté</span>
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
};const SaveQueueModal = ({ queue, onClose, onCreate }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState('Ma file d\'attente');
const [description, setDescription] = useState('');const handleSubmit = (e) => {
e.preventDefault();
if (name.trim() && queue.length > 0) {
onCreate(name.trim(), description.trim(), queue);
onClose();
}
};return (
<div className="modal-backdrop" onClick={onClose}>
<div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
<h2 className="modal-title">💾 Sauvegarder la file d'attente</h2>
<p className="modal-subtitle">{queue.length} musiques seront ajoutées</p>
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
rows="2"
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
};function AppContent() {
const { isDarkMode, currentTheme } = useTheme();
const { addToHistory, addListeningTime, sleepTimerActive, sleepTimerRemaining } = useMusic();
const [currentPage, setCurrentPage] = useState('home');
const [currentTrack, setCurrentTrack] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [volume, setVolume] = useState(() => {
const saved = localStorage.getItem('spotizer-volume');
return saved !== null ? parseFloat(saved) : 0.5;
});
const [isMuted, setIsMuted] = useState(false);
const [playlists, setPlaylists] = useState([]);
const [selectedPlaylist, setSelectedPlaylist] = useState(null);
const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
const [trackToAdd, setTrackToAdd] = useState(null);
const [showPlaylistOptionsModal, setShowPlaylistOptionsModal] = useState(false);
const [playlistToEdit, setPlaylistToEdit] = useState(null);
const [playlistForOptions, setPlaylistForOptions] = useState(null);
const [showPlaylistEditModal, setShowPlaylistEditModal] = useState(false);
const [isShuffleMode, setIsShuffleMode] = useState(false);
const [currentQueue, setCurrentQueue] = useState([]);
const [isRepeatMode, setIsRepeatMode] = useState(0);
const [showQueuePanel, setShowQueuePanel] = useState(false);
const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
const [showSaveQueueModal, setShowSaveQueueModal] = useState(false);
const [lastPlayTime, setLastPlayTime] = useState(0);const audioRef = useRef(null);useEffect(() => {
if (audioRef.current) {
audioRef.current.volume = isMuted ? 0 : volume;
}
localStorage.setItem('spotizer-volume', volume.toString());
}, [volume, isMuted]);useEffect(() => {
const savedPlaylists = localStorage.getItem('deezer-playlists');
if (savedPlaylists) {
setPlaylists(JSON.parse(savedPlaylists));
} else {
setPlaylists(defaultPlaylists);
}
}, []);useEffect(() => {
if (playlists.length > 0) {
localStorage.setItem('deezer-playlists', JSON.stringify(playlists));
}
}, [playlists]);
const updateMediaSessionMetadata = useCallback((track) => {
if (!track) return;
if ('mediaSession' in navigator) {
navigator.mediaSession.metadata = new window.MediaMetadata({
title: track.title,
artist: track.artist,
album: track.album || '',
artwork: [
{ src: track.cover, sizes: '512x512', type: 'image/png' }
]
});if (!navigator.mediaSession._handlersSet) {
navigator.mediaSession.setActionHandler('play', () => {
audioRef.current?.play();
setIsPlaying(true);
});navigator.mediaSession.setActionHandler('pause', () => {
audioRef.current?.pause();
setIsPlaying(false);
});navigator.mediaSession.setActionHandler('previoustrack', previousTrack);
navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
navigator.mediaSession.setActionHandler('seekforward', (details) => {
console.log(`Media Session: seekforward (+${details.seekOffset || 10}s) -> Next Track via large seek`);
audioRef.current.currentTime += 10000; 
});
navigator.mediaSession.setActionHandler('seekbackward', (details) => {
console.log(`Media Session: seekbackward (-${details.seekOffset || 10}s) -> Previous Track via large seek`);
audioRef.current.currentTime -= 10000; 
});
navigator.mediaSession._handlersSet = true;
}
}
}, []);useEffect(() => {
const audio = audioRef.current;
if (!audio) return;const handleTimeUpdate = () => {
setCurrentTime(audio.currentTime);
const currentSec = Math.floor(audio.currentTime);
if (currentSec > 0 && currentSec % 10 === 0 && currentSec !== lastPlayTime) {
addListeningTime(10);
setLastPlayTime(currentSec);
}
};
const handleDurationChange = () => setDuration(audio.duration);
const handleEnded = () => {
setIsPlaying(false);
setCurrentTime(0);if (isRepeatMode === 2) {
audio.currentTime = 0;
audio.play();
setIsPlaying(true);
} else {
nextTrack();
}
};audio.addEventListener('timeupdate', handleTimeUpdate);
audio.addEventListener('durationchange', handleDurationChange);
audio.addEventListener('ended', handleEnded);return () => {
audio.removeEventListener('timeupdate', handleTimeUpdate);
audio.removeEventListener('durationchange', handleDurationChange);
audio.removeEventListener('ended', handleEnded);
};
}, [currentTrack, isRepeatMode, lastPlayTime, addListeningTime]);const shuffleArray = useCallback((array) => {
const newArray = [...array];
for (let i = newArray.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
}
return newArray;
}, []);const initializeQueue = useCallback((startTrack, sourceList) => {
const startIndex = sourceList.findIndex(t => t.id === startTrack.id);
if (startIndex === -1) return [startTrack];
const queue = [
...sourceList.slice(startIndex),
...sourceList.slice(0, startIndex)
];
return queue;
}, []);const playTrack = useCallback((track, playlist = null) => {
setCurrentTrack(track);
setIsPlaying(true);
setLastPlayTime(0);
addToHistory(track);const sourceList = playlist?.tracks || selectedPlaylist?.tracks || musicDatabase;
if (isShuffleMode) {
const shuffledList = shuffleArray(sourceList);
const trackIndex = shuffledList.findIndex(t => t.id === track.id);
if (trackIndex > 0) {
shuffledList.splice(trackIndex, 1);
shuffledList.unshift(track);
}
setCurrentQueue(shuffledList);
} else {
const orderedQueue = initializeQueue(track, sourceList);
setCurrentQueue(orderedQueue);
}
updateMediaSessionMetadata(track);setTimeout(() => {
if (audioRef.current) {
audioRef.current.play().catch(e => console.log('Erreur de lecture:', e));
}
}, 100);}, [isShuffleMode, selectedPlaylist, addToHistory, shuffleArray, initializeQueue, updateMediaSessionMetadata]);const togglePlayPause = useCallback(() => {
if (!audioRef.current || !currentTrack) return;if (isPlaying) {
audioRef.current.pause();
setIsPlaying(false);
if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
} else {
audioRef.current.play().catch(e => console.log('Erreur de lecture:', e));
setIsPlaying(true);
if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
}
}, [isPlaying, currentTrack]);const handleProgressClick = (e) => {
if (!audioRef.current || !duration) return;const rect = e.currentTarget.getBoundingClientRect();
const clickX = e.clientX - rect.left;
const newTime = (clickX / rect.width) * duration;audioRef.current.currentTime = newTime;
setCurrentTime(newTime);
};const formatTime = (time) => {
if (isNaN(time)) return '0:00';
const minutes = Math.floor(time / 60);
const seconds = Math.floor(time % 60);
return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};const nextTrack = useCallback(() => {
if (currentQueue.length === 0) return;
const currentIndex = currentQueue.findIndex(track => track.id === currentTrack?.id);
let nextIndex;if (isRepeatMode === 1) {
nextIndex = (currentIndex + 1) % currentQueue.length;
} else {
nextIndex = currentIndex + 1;
if (nextIndex >= currentQueue.length) {
if (isRepeatMode === 0) {
setIsPlaying(false);
setCurrentTrack(null);
setCurrentTime(0);
return; 
}
nextIndex = 0; 
}
}if (currentQueue[nextIndex]) {
const nextTrack = currentQueue[nextIndex];
setCurrentTrack(nextTrack);
setIsPlaying(true);
setLastPlayTime(0);
addToHistory(nextTrack);
updateMediaSessionMetadata(nextTrack);const audio = audioRef.current;
if (audio) {
audio.pause(); 
audio.load(); 
audio.oncanplaythrough = () => { 
audio.play().catch(e => console.log('Erreur de lecture de la piste suivante:', e));
};
}
}
}, [currentQueue, currentTrack, isRepeatMode, addToHistory, updateMediaSessionMetadata]);const previousTrack = useCallback(() => {
if (currentQueue.length === 0) return;
if (audioRef.current && currentTime > 3) {
audioRef.current.currentTime = 0;
return;
}const currentIndex = currentQueue.findIndex(track => track.id === currentTrack?.id);
let prevIndex;if (isRepeatMode === 1) {
prevIndex = currentIndex === 0 ? currentQueue.length - 1 : currentIndex - 1;
} else {
prevIndex = currentIndex === 0 ? currentQueue.length - 1 : currentIndex - 1;
}if (currentQueue[prevIndex]) {
const prevTrack = currentQueue[prevIndex];
setCurrentTrack(prevTrack);
setIsPlaying(true);
setLastPlayTime(0);
addToHistory(prevTrack);
updateMediaSessionMetadata(prevTrack);const audio = audioRef.current;
if (audio) {
audio.pause(); 
audio.load(); 
audio.oncanplaythrough = () => { 
audio.play().catch(e => console.log('Erreur de lecture de la piste précédente:', e));
};
}
}
}, [currentQueue, currentTrack, isRepeatMode, addToHistory, updateMediaSessionMetadata, currentTime]);const toggleShuffle = useCallback(() => {
setIsShuffleMode(prev => {
const newMode = !prev;if (currentQueue.length === 0 || !currentTrack) {
return newMode;
}const currentIndex = currentQueue.findIndex(t => t.id === currentTrack.id);
if (currentIndex === -1) return newMode;if (newMode) {
const upcoming = currentQueue.slice(currentIndex + 1);
const shuffledUpcoming = shuffleArray(upcoming);
const alreadyPlayed = currentQueue.slice(0, currentIndex + 1);
setCurrentQueue([...alreadyPlayed, ...shuffledUpcoming]);
} else {
const sourceList = selectedPlaylist?.tracks || musicDatabase;
const newQueue = initializeQueue(currentTrack, sourceList);
setCurrentQueue(newQueue);
}return newMode;
});
}, [currentQueue, currentTrack, selectedPlaylist, shuffleArray, initializeQueue]);const toggleRepeat = useCallback(() => {
setIsRepeatMode((prev) => (prev + 1) % 3);
}, []);const handleVolumeUp = useCallback(() => {
setVolume(prev => Math.min(1, prev + 0.05));
}, []);const handleVolumeDown = useCallback(() => {
setVolume(prev => Math.max(0, prev - 0.05));
}, []);const toggleMute = useCallback(() => {
setIsMuted(prev => !prev);
}, []);const toggleQueue = useCallback(() => {
setShowQueuePanel(prev => !prev);
}, []);useKeyboardShortcuts({
onPlayPause: togglePlayPause,
onNext: nextTrack,
onPrevious: previousTrack,
onVolumeUp: handleVolumeUp,
onVolumeDown: handleVolumeDown,
onMute: toggleMute,
onShuffle: toggleShuffle,
onRepeat: toggleRepeat,
onToggleQueue: toggleQueue,
isEnabled: true
});const getRepeatIcon = () => {
switch (isRepeatMode) {
case 0: return '🔁';
case 1: return '🔁';
case 2: return '🔂';
default: return '🔁';
}
};const getRepeatTitle = () => {
switch (isRepeatMode) {
case 0: return 'Répétition désactivée';
case 1: return 'Répéter toute la playlist';
case 2: return 'Répéter la chanson actuelle';
default: return 'Répétition désactivée';
}
};const handleSearch = (query) => {
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
};const createPlaylist = (name, description, cover) => {
const newPlaylist = {
id: Date.now().toString(),
name,
description,
cover: cover || "https://media.discordapp.net/attachments/968955109155418132/1401255944725467136/TheStars.png?ex=688f9ccb&is=688e4b4b&hm=e541b37c4d19098a587549aa4d704fa34889dd20cc4dcb5b725668ca11e191bb&=&format=webp&quality=lossless",
tracks: [],
isDefault: false
};
setPlaylists([...playlists, newPlaylist]);
setShowCreatePlaylistModal(false);
};const createPlaylistFromQueue = (name, description, tracks) => {
const newPlaylist = {
id: Date.now().toString(),
name,
description,
cover: tracks[0]?.cover || "https://media.discordapp.net/attachments/968955109155418132/1401255944725467136/TheStars.png?ex=688f9ccb&is=688e4b4b&hm=e541b37c4d19098a587549aa4d704fa34889dd20cc4dcb5b725668ca11e191bb&=&format=webp&quality=lossless",
tracks: tracks,
isDefault: false
};
setPlaylists([...playlists, newPlaylist]);
};const deletePlaylist = (playlistId) => {
if (window.confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
setPlaylists(playlists.filter(p => p.id !== playlistId));
if (selectedPlaylist?.id === playlistId) {
setSelectedPlaylist(null);
}
setShowPlaylistOptionsModal(false);
}
};const addTrackToPlaylist = (playlistId, track) => {
setPlaylists(playlists.map(playlist => {
if (playlist.id === playlistId) {
if (!playlist.tracks.find(t => t.id === track.id)) {
return { ...playlist, tracks: [...playlist.tracks, track] };
}
}
return playlist;
}));
setShowAddToPlaylistModal(false);
setTrackToAdd(null);
};const removeTrackFromPlaylist = (playlistId, trackId) => {
const updatedPlaylists = playlists.map(playlist => {
if (playlist.id === playlistId) {
return { ...playlist, tracks: playlist.tracks.filter(t => t.id !== trackId) };
}
return playlist;
});
setPlaylists(updatedPlaylists);if (selectedPlaylist?.id === playlistId) {
const updatedPlaylist = updatedPlaylists.find(p => p.id === playlistId);
setSelectedPlaylist(updatedPlaylist);
}
};const openAddToPlaylistModal = (track) => {
setTrackToAdd(track);
setShowAddToPlaylistModal(true);
};const openPlaylistOptionsModal = (playlist) => {
setPlaylistForOptions(playlist);
setShowPlaylistOptionsModal(true);
};const handleEditPlaylist = (playlist) => {
setPlaylistToEdit(playlist);
setShowPlaylistEditModal(true);
setShowPlaylistOptionsModal(false);
};const updatePlaylist = (updatedPlaylist) => {
const updatedPlaylists = playlists.map((p) =>
p.id === updatedPlaylist.id ? updatedPlaylist : p
);
setPlaylists(updatedPlaylists);if (selectedPlaylist?.id === updatedPlaylist.id) {
setSelectedPlaylist(updatedPlaylist);
}
setShowPlaylistEditModal(false);
};const exportPlaylist = (playlist) => {
const dataStr = JSON.stringify(playlist, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = `${playlist.name.replace(/[^a-z0-9]/gi, '_')}.json`;
link.click();
URL.revokeObjectURL(url);
setShowPlaylistOptionsModal(false);
};const importPlaylist = (importedPlaylist) => {
const newPlaylist = {
...importedPlaylist,
id: Date.now().toString(),
isDefault: false
};
setPlaylists([...playlists, newPlaylist]);
alert(`Playlist "${newPlaylist.name}" importée avec succès!`);
};const playPlaylist = (playlist) => {
if (playlist.tracks.length > 0) {
setSelectedPlaylist(playlist);
playTrack(playlist.tracks[0], playlist);
}
};const playPlaylistShuffle = (playlist) => {
if (playlist.tracks.length > 0) {
setSelectedPlaylist(playlist);
setIsShuffleMode(true);
const shuffledTracks = shuffleArray(playlist.tracks);
setCurrentQueue(shuffledTracks);
playTrack(shuffledTracks[0], playlist);
}
};const openPlaylist = (playlist) => {
setCurrentPage('library');
setSelectedPlaylist(playlist);
};const handleQueueReorder = (sourceIndex, destinationIndex) => {
const currentIndex = currentQueue.findIndex(t => t.id === currentTrack?.id);
const actualSourceIndex = currentIndex + 1 + sourceIndex;
const actualDestIndex = currentIndex + 1 + destinationIndex;
const newQueue = [...currentQueue];
const [removed] = newQueue.splice(actualSourceIndex, 1);
newQueue.splice(actualDestIndex, 0, removed);
setCurrentQueue(newQueue);
};const handleQueueRemove = (index) => {
const newQueue = [...currentQueue];
newQueue.splice(index, 1);
setCurrentQueue(newQueue);
};const addToQueue = (track) => {
if (!currentQueue.find(t => t.id === track.id)) {
setCurrentQueue([...currentQueue, track]);
}
};const clearQueue = () => {
if (currentTrack) {
setCurrentQueue([currentTrack]);
} else {
setCurrentQueue([]);
}
};const handlePlaylistDragEnd = (result) => {
if (!result.destination || !selectedPlaylist) return;
const newTracks = [...selectedPlaylist.tracks];
const [removed] = newTracks.splice(result.source.index, 1);
newTracks.splice(result.destination.index, 0, removed);
const updatedPlaylist = { ...selectedPlaylist, tracks: newTracks };
updatePlaylist(updatedPlaylist);
};const themeStyle = {
'--theme-primary': currentTheme.primary,
'--theme-secondary': currentTheme.secondary,
'--theme-accent': currentTheme.accent,
'--theme-gradient': currentTheme.gradient
};return (
<div className={`App ${isDarkMode ? 'dark' : 'light'}`} style={themeStyle}>
{currentTrack && (
<audio
ref={audioRef}
src={currentTrack.audioUrl}
preload="auto"
/>
)}<div className="main-layout">
{/* Sidebar */}
<div className="sidebar">
<div className="sidebar-logo">
<h1 style={{ background: currentTheme.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Spotizer</h1>
</div><nav className="sidebar-nav">
<button
className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
onClick={() => setCurrentPage('home')}
style={currentPage === 'home' ? { background: currentTheme.gradient } : {}}
>
<span>🏠</span>
<span>Accueil</span>
</button>
<button
className={`nav-item ${currentPage === 'search' ? 'active' : ''}`}
onClick={() => setCurrentPage('search')}
style={currentPage === 'search' ? { background: currentTheme.gradient } : {}}
>
<span>🔍</span>
<span>Rechercher</span>
</button>
<button
className={`nav-item ${currentPage === 'library' ? 'active' : ''}`}
onClick={() => setCurrentPage('library')}
style={currentPage === 'library' ? { background: currentTheme.gradient } : {}}
>
<span>📚</span>
<span>Ma musique</span>
</button>
<button
className={`nav-item ${currentPage === 'stats' ? 'active' : ''}`}
onClick={() => setCurrentPage('stats')}
style={currentPage === 'stats' ? { background: currentTheme.gradient } : {}}
>
<span>📊</span>
<span>Statistiques</span>
</button>
<button
className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}
onClick={() => setCurrentPage('history')}
style={currentPage === 'history' ? { background: currentTheme.gradient } : {}}
>
<span>📜</span>
<span>Historique</span>
</button>
</nav><div className="playlists-section">
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
style={selectedPlaylist?.id === playlist.id ? { background: currentTheme.gradient } : {}}
>
<img
src={playlist.cover}
alt={`Cover de ${playlist.name}`}
className="playlist-cover"
onError={(e) => {
e.target.onerror = null;
e.target.src = "https://media.discordapp.net/attachments/968955109155418132/1401255944725467136/TheStars.png?ex=688f9ccb&is=688e4b4b&hm=e541b37c4d19098a587549aa4d704fa34889dd20cc4dcb5b725668ca11e191bb&=&format=webp&quality=lossless";
}}
/>
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
</div>{/* Bouton aide raccourcis */}
<button 
className="shortcuts-help-btn"
onClick={() => setShowShortcutsHelp(true)}
title="Raccourcis clavier"
>
⌨️ Raccourcis
</button>
</div>{/* Main Content */}
<div className="content-area">
{/* Top Bar */}
<div className="top-bar">
<div className="top-bar-content">
<div className="search-container">
<span className="search-icon">🔍</span>
<input
type="text"
className="search-input"
placeholder="Rechercher des titres..."
value={searchQuery}
onChange={(e) => handleSearch(e.target.value)}
onKeyDown={(e) => {
if (e.key === "Enter") {
setCurrentPage("search");
}
}}
/>
</div>
<div className="top-bar-actions">
{sleepTimerActive && (
<div className="sleep-timer-indicator" style={{ color: currentTheme.primary }}>
⏰ {Math.floor(sleepTimerRemaining / 60)}:{(sleepTimerRemaining % 60).toString().padStart(2, '0')}
</div>
)}
<button 
className="top-bar-btn"
onClick={() => setShowSleepTimerModal(true)}
title="Minuteur de sommeil"
>
⏰
</button>
<button 
className="top-bar-btn"
onClick={toggleQueue}
title="File d'attente (Ctrl+Q)"
style={showQueuePanel ? { color: currentTheme.primary } : {}}
>
📋
</button>
<ThemeSelector />
</div>
</div>
</div>{/* Page Content */}
<div className="page-content">
{currentPage === 'home' && (
<div className="page-container">
<div
className="hero-section"
style={{ background: currentTheme.gradient }}
>
<h2 className="section-title2">
<a
href="https://twitch.tv/le_bisounours_"
target="_blank"
rel="noopener noreferrer"
style={{
color: "white",
textDecoration: "none",
cursor: "pointer"
}}
>
Le_Bisounours_
</a>
</h2>
</div><div className="section">
<h2 className="section-title">Titres populaires</h2>
<div className="grid grid-cols-6">
{musicDatabase.slice(0, 95).map(track => (
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{
background: isDarkMode
? "linear-gradient(135deg, #374151, #4b5563)"
: currentTheme.gradient,
cursor: "pointer",
boxShadow: currentTrack?.id === track.id && isPlaying
? `0 0 20px 10px ${currentTheme.primary}80`
: "none"
}}
title="Cliquer pour jouer"
>
<img src={track.cover} alt={track.title} className="card-image" />
<button
className="add-to-playlist-btn"
onClick={(e) => {
e.stopPropagation();
openAddToPlaylistModal(track);
}}
title="Ajouter à une playlist"
>
➕
</button><button
className="add-to-queue-btn"
onClick={(e) => {
e.stopPropagation();
addToQueue(track);
}}
title="Ajouter à la file d'attente"
style={{ background: currentTheme.primary }}
>
📋
</button><h3 className="card-title">{track.title}</h3>
<p className="card-subtitle">{track.artist}</p>
<p className="card-info">{track.genre} • {track.duration}</p>
</div>
))}
</div>
</div><div className="section">
<h2 className="section-title">Rock & Alternative</h2>
<div className="grid grid-cols-6">
{musicDatabase.filter(track => ['Rock', 'Indie Rock', 'Pop Rock', 'Alternative Rock', 'Alternative', 'Indie'].includes(track.genre)).slice(0, 6).map(track => (
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{ cursor: "pointer" }}
title="Cliquer pour jouer"
>
<img src={track.cover} alt={track.title} className="card-image" />
<button
className="add-to-playlist-btn"
onClick={(e) => {
e.stopPropagation();
openAddToPlaylistModal(track);
}}
>
➕
</button>
<h3 className="card-title">{track.title}</h3>
<p className="card-subtitle">{track.artist}</p>
</div>
))}
</div>
</div><div className="section">
<h2 className="section-title">Rap & Hip-Hop</h2>
<div className="grid grid-cols-6">
{musicDatabase.filter(track => ['Hip-Hop', 'Rap'].includes(track.genre)).slice(0, 6).map(track => (
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{ cursor: "pointer" }}
title="Cliquer pour jouer"
>
<img src={track.cover} alt={track.title} className="card-image" />
<button
className="add-to-playlist-btn"
onClick={(e) => {
e.stopPropagation();
openAddToPlaylistModal(track);
}}
>
➕
</button>
<h3 className="card-title">{track.title}</h3>
<p className="card-subtitle">{track.artist}</p>
</div>
))}
</div>
</div><div className="section">
<h2 className="section-title">Openings Anime</h2>
<div className="grid grid-cols-6">
{musicDatabase.filter(track => track.genre === 'Opening').slice(0, 6).map(track => (
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{ cursor: "pointer" }}
title="Cliquer pour jouer"
>
<img src={track.cover} alt={track.title} className="card-image" />
<button
className="add-to-playlist-btn"
onClick={(e) => {
e.stopPropagation();
openAddToPlaylistModal(track);
}}
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
)}{currentPage === 'search' && (
<div className="page-container">
{!searchQuery ? (
<div className="search-empty">
<div className="search-empty-icon"></div>
<h2 className="search-empty-title">Rechercher dans {musicDatabase.length} musiques</h2>
<p className="search-empty-subtitle">Trouvez vos artistes, albums et titres préférés</p><div className="genres-section">
<h3 className="genres-title">Rechercher par genre</h3>
<div className="genres-grid">
<div className="genre-card genre-pop" onClick={() => handleSearch('Pop')}>
<h4 className="genre-name">Pop</h4>
</div>
<div className="genre-card genre-rock" onClick={() => handleSearch('Rock')}>
<h4 className="genre-name">Rock</h4>
</div>
<div className="genre-card genre-hiphop" onClick={() => handleSearch('Opening')}>
<h4 className="genre-name">Opening</h4>
</div>
<div className="genre-card genre-electronic" onClick={() => handleSearch('Electro')}>
<h4 className="genre-name">Electro</h4>
</div>
<div className="genre-card genre-rap" onClick={() => handleSearch('Rap')}>
<h4 className="genre-name">Rap</h4>
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
style={{ background: currentTheme.gradient }}
>
🔀 Lecture aléatoire
</button>
)}
</div>
<div className="track-list">
{searchResults.map((track, index) => (
<div
key={track.id}
className="track-item"
onClick={() => playTrack(track)}
style={{ cursor: "pointer" }}
title="Cliquer pour jouer"
>
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
onClick={(e) => {
e.stopPropagation();
openAddToPlaylistModal(track);
}}
title="Ajouter à une playlist"
>
➕
</button>
<button
className="add-to-queue-btn-small"
onClick={(e) => {
e.stopPropagation();
addToQueue(track);
}}
title="Ajouter à la file d'attente"
>
📋
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
)}{currentPage === 'library' && (
<div className="page-container">
{selectedPlaylist ? (
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
style={{ background: currentTheme.primary }}
>
▶️ Lecture
</button>
<button
className="shuffle-playlist-btn"
onClick={() => playPlaylistShuffle(selectedPlaylist)}
disabled={selectedPlaylist.tracks.length === 0}
style={{ background: currentTheme.gradient }}
>
🔀 Aléatoire
</button>
</div>
</div>
</div>
</div><div className="playlist-tracks">
<p className="drag-hint">💡 Glissez-déposez pour réorganiser les musiques</p>
{selectedPlaylist.tracks.length === 0 ? (
<div className="empty-playlist">
<p>Cette playlist est vide</p>
<p>Ajoutez des musiques depuis la recherche ou l'accueil</p>
</div>
) : (
<DragDropContext onDragEnd={handlePlaylistDragEnd}>
<Droppable droppableId="playlist-tracks">
{(provided) => (
<div 
className="track-list"
{...provided.droppableProps}
ref={provided.innerRef}
>
{selectedPlaylist.tracks.map((track, index) => (
<Draggable
key={`${track.id}-${index}`}
draggableId={`${track.id}-${index}`}
index={index}
>
{(provided, snapshot) => (
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className={`track-item ${snapshot.isDragging ? 'dragging' : ''}`}
onClick={() => playTrack(track, selectedPlaylist)}
style={{
...provided.draggableProps.style,
cursor: "pointer",
borderLeft: snapshot.isDragging ? `3px solid ${currentTheme.primary}` : 'none'
}}
title="Cliquer pour jouer, glisser pour réorganiser"
>
<span className="drag-handle">⋮⋮</span>
<div className="track-number">{index + 1}</div>
<button
className="track-play-btn"
onClick={(e) => {
e.stopPropagation();
playTrack(track, selectedPlaylist);
}}
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
onClick={(e) => {
e.stopPropagation();
removeTrackFromPlaylist(selectedPlaylist.id, track.id);
}}
title="Retirer de la playlist"
>
🗑️
</button>
<div className="track-duration">{track.duration}</div>
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
<div>
<div className="library-header">
<h1 className="page-title">Ma musique</h1>
<button
className="create-playlist-btn"
onClick={() => setShowCreatePlaylistModal(true)}
style={{ background: currentTheme.gradient }}
>
➕ Créer une playlist
</button>
</div><div className="section">
<h2 className="section-title">Mes playlists ({playlists.length})</h2>
<div className="grid grid-cols-4">
{playlists.map(playlist => (
<div
key={playlist.id}
className="card"
onClick={() => playPlaylist(playlist)}
style={{ cursor: "pointer" }}
title="Cliquer pour écouter"
>
<img src={playlist.cover} alt={playlist.name} className="card-image" /><button
className="shuffle-card-btn"
onClick={(e) => {
e.stopPropagation();
playPlaylistShuffle(playlist);
}}
disabled={playlist.tracks.length === 0}
title="Écouter en mode aléatoire"
>
🔀
</button><h3 className="card-title">{playlist.name}</h3>
<p className="card-subtitle">{playlist.description}</p>
<p className="card-info">{playlist.tracks.length} titres</p><button
className="view-playlist-btn"
onClick={(e) => {
e.stopPropagation();
setSelectedPlaylist(playlist);
}}
>
Voir la playlist
</button>
</div>
))}
</div>
</div><div className="section">
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
style={{ background: currentTheme.gradient }}
>
🔀 Tout écouter en aléatoire
</button>
</div>
<div className="track-list">
{musicDatabase.map((track, index) => (
<div
key={track.id}
className="track-item"
onClick={() => playTrack(track)}
style={{ cursor: "pointer" }}
title="Cliquer pour jouer"
>
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
onClick={(e) => {
e.stopPropagation();
openAddToPlaylistModal(track);
}}
title="Ajouter à une playlist"
>
➕
</button>
<button
className="add-to-queue-btn-small"
onClick={(e) => {
e.stopPropagation();
addToQueue(track);
}}
title="Ajouter à la file d'attente"
>
📋
</button>
<div className="track-duration">{track.duration}</div>
</div>
))}
</div>
</div>
</div>
)}
</div>
)}{currentPage === 'stats' && (
<StatsPage 
musicDatabase={musicDatabase}
onPlayTrack={playTrack}
/>
)}{currentPage === 'history' && (
<HistoryPage 
musicDatabase={musicDatabase}
onPlayTrack={playTrack}
onAddToPlaylist={openAddToPlaylistModal}
/>
)}
</div>
</div>{/* Queue Panel */}
<QueuePanel
isOpen={showQueuePanel}
onClose={() => setShowQueuePanel(false)}
queue={currentQueue}
currentTrack={currentTrack}
onReorder={handleQueueReorder}
onRemove={handleQueueRemove}
onPlay={playTrack}
onSaveAsPlaylist={() => setShowSaveQueueModal(true)}
onClearQueue={clearQueue}
/>
</div>{/* Music Player */}
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
</div><div className="player-controls">
<div className="player-buttons">
<button
className={`player-btn ${isShuffleMode ? 'active' : ''}`}
onClick={toggleShuffle}
title={isShuffleMode ? 'Désactiver le mode aléatoire (Ctrl+S)' : 'Activer le mode aléatoire (Ctrl+S)'}
style={isShuffleMode ? { color: currentTheme.primary } : {}}
>
🔀
</button>
<button className="player-btn" onClick={previousTrack} title="Précédent (←)">⏮️</button>
<button className="player-play-btn" onClick={togglePlayPause} title="Lecture/Pause (Espace)">
{isPlaying ? '⏸️' : '▶️'}
</button>
<button className="player-btn" onClick={nextTrack} title="Suivant (→)">⏭️</button>
<button
className={`player-btn ${isRepeatMode > 0 ? 'active' : ''}`}
onClick={toggleRepeat}
title={`${getRepeatTitle()} (Ctrl+R)`}
style={isRepeatMode > 0 ? { color: currentTheme.primary } : {}}
>
{getRepeatIcon()}
</button>
</div><div className="player-progress">
<span className="player-time">{formatTime(currentTime)}</span>
<div className="progress-bar" onClick={handleProgressClick}>
<div
className="progress-fill"
style={{ 
width: duration ? `${(currentTime / duration) * 100}%` : '0%',
background: currentTheme.gradient
}}
></div>
</div>
<span className="player-time">{formatTime(duration)}</span>
</div>
</div><div className="player-right-controls">
<div className="now-playing-indicator">
{isPlaying && <span className="playing-animation" style={{ color: currentTheme.primary }}>🎵</span>}
<div className="playback-mode">
{isShuffleMode && <span className="mode-indicator" style={{ color: currentTheme.primary }}>🔀</span>}
{isRepeatMode === 1 && <span className="mode-indicator" style={{ color: currentTheme.primary }}>🔁</span>}
{isRepeatMode === 2 && <span className="mode-indicator" style={{ color: currentTheme.primary }}>🔂</span>}
</div>
</div>
<button
className="player-btn"
onClick={toggleQueue}
title="File d'attente (Ctrl+Q)"
style={showQueuePanel ? { color: currentTheme.primary } : {}}
>
📋
</button>
<button
className="player-btn"
onClick={toggleMute}
title="Muet (Ctrl+M)"
>
{isMuted ? '🔇' : '🔊'}
</button>
<input
type="range"
className="volume-slider"
min="0"
max="1"
step="0.01"
value={isMuted ? 0 : volume}
onChange={(e) => setVolume(parseFloat(e.target.value))}
title="Volume (↑/↓)"
/>
<button className="close-btn" onClick={() => setCurrentTrack(null)}>✕</button>
</div>
</div>
</div>
)}{/* Modals */}
{showCreatePlaylistModal && (
<CreatePlaylistModal
onClose={() => setShowCreatePlaylistModal(false)}
onCreate={createPlaylist}
onImport={importPlaylist}
/>
)}{showAddToPlaylistModal && trackToAdd && (
<AddToPlaylistModal
track={trackToAdd}
playlists={playlists}
onClose={() => setShowAddToPlaylistModal(false)}
onAdd={addTrackToPlaylist}
/>
)}{showPlaylistOptionsModal && playlistForOptions && (
<PlaylistOptionsModal
playlist={playlistForOptions}
onClose={() => setShowPlaylistOptionsModal(false)}
onDelete={deletePlaylist}
onEdit={handleEditPlaylist}
onExport={exportPlaylist}
/>
)}{showPlaylistEditModal && playlistToEdit && (
<PlaylistEditModal
playlist={playlistToEdit}
onClose={() => setShowPlaylistEditModal(false)}
onSave={updatePlaylist}
/>
)}{showSleepTimerModal && (
<SleepTimerModal
isOpen={showSleepTimerModal}
onClose={() => setShowSleepTimerModal(false)}
audioRef={audioRef}
onStop={() => setIsPlaying(false)}
/>
)}{showShortcutsHelp && (
<KeyboardShortcutsHelp
isOpen={showShortcutsHelp}
onClose={() => setShowShortcutsHelp(false)}
/>
)}{showSaveQueueModal && (
<SaveQueueModal
queue={currentQueue}
onClose={() => setShowSaveQueueModal(false)}
onCreate={createPlaylistFromQueue}
/>
)}
</div>
);
}const HistoryPage = ({ musicDatabase, onPlayTrack, onAddToPlaylist }) => {
const { isDarkMode, currentTheme } = useTheme();
const { listeningHistory, playStats } = useMusic();return (
<div className={`page-container ${isDarkMode ? 'dark' : 'light'}`}>
<h1 className="page-title">📜 Historique d'écoute</h1>
<p className="page-subtitle">Vos 50 dernières musiques écoutées</p>{listeningHistory.length === 0 ? (
<div className="empty-state">
<p>Aucune musique écoutée pour le moment.</p>
<p>Commencez à écouter de la musique pour voir votre historique !</p>
</div>
) : (
<div className="history-full-list">
{listeningHistory.map((entry, index) => (
<div 
key={entry.playId} 
className="track-item history-track-item"
onClick={() => onPlayTrack(entry)}
style={{ cursor: 'pointer' }}
>
<div className="track-number">{index + 1}</div>
<img src={entry.cover} alt={entry.title} className="track-cover" />
<div className="track-info">
<div className="track-title">{entry.title}</div>
<div className="track-artist">{entry.artist}</div>
</div>
<div className="track-genre">{entry.genre}</div>
<div className="history-meta">
<span className="history-date">
{new Date(entry.playedAt).toLocaleDateString('fr-FR')}
</span>
<span className="history-time">
{new Date(entry.playedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
</span>
</div>
<div className="play-count-badge" style={{ background: currentTheme.gradient }}>
{playStats[entry.id] || 1}x
</div>
<button
className="add-to-playlist-btn-small"
onClick={(e) => {
e.stopPropagation();
onAddToPlaylist(entry);
}}
title="Ajouter à une playlist"
>
➕
</button>
</div>
))}
</div>
)}
</div>
);
};function App() {
return (
<ThemeProvider>
<MusicProvider>
<AppContent />
</MusicProvider>
</ThemeProvider>
);
}export default App;