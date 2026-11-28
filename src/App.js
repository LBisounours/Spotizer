// /src/App.js
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';
import './App_responsive.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { MusicProvider, useMusic } from './contexts/MusicContext';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import QueuePanel from './components/QueuePanel';
import ThemeSelector from './components/ThemeSelector';
import SleepTimerModal from './components/SleepTimerModal';
import StatsPage from './components/StatsPage';
import { SoundBoardProvider } from './contexts/SoundBoardContext';
import SoundBoardPage from './components/SoundBoardPage';
import { useSoundBoard } from './contexts/SoundBoardContext';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import './Extras.css';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { LibraryProvider, useLibrary } from './contexts/LibraryContext';
import CollectionView from './components/CollectionView';
import ContextMenu from './components/ContextMenu';
import NowPlayingFull from './components/NowPlayingFull';
import HomePage from './components/HomePage';
import DownloadsPage from './components/DownloadsPage';
import BottomNav from './components/BottomNav';
import BlindTest from './components/BlindTest';
import { OfflineProvider, useOffline } from './contexts/OfflineContext';
import { getBlobUrl } from './offline';
import SearchPage from './components/SearchPage';
import SettingsPage from './components/SettingsPage';
import { HeartButton } from './components/Common';
import { loadJSON, saveJSON } from './utils_storage';
import { normalize, parseDuration, formatTotal, splitArtists, primaryArtist, MOODS, moodTracks, copyText } from './utils';
const musicDatabase = [
{ id: 71, title: "Mood", artist: "24kGoldn", album: "Le_Bisounours_", duration: "2:30", cover: "Musique/Images/font71.png", audioUrl: "Musique/Musique71.mp3", genre: "Pop Rap" },
{ id: 36, title: "Tchin Tchin", artist: "2TH", album: "Le_Bisounours_", duration: "2:36", cover: "Musique/Images/font36.png", audioUrl: "Musique/Musique36.mp3", genre: "Rap" },
{ id: 2, title: "Côte Ouest", artist: "47Ter", album: "Le_Bisounours_", duration: "3:51", cover: "Musique/Images/font2.png", audioUrl: "Musique/Musique2.mp3", genre: "Rap" },
{ id: 3, title: "Harakiri", artist: "47Ter", album: "Le_Bisounours_", duration: "3:01", cover: "Musique/Images/font3.png", audioUrl: "Musique/Musique3.mp3", genre: "Rap" },
{ id: 7, title: "Un air qui fait", artist: "47Ter", album: "Le_Bisounours_", duration: "3:46", cover: "Musique/Images/font7.png", audioUrl: "Musique/Musique7.mp3", genre: "Rap" },
{ id: 12, title: "Chaque soir", artist: "47Ter", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font12.png", audioUrl: "Musique/Musique12.mp3", genre: "Rap" },
{ id: 32, title: "30", artist: "47Ter", album: "Le_Bisounours_", duration: "3:32", cover: "Musique/Images/font32.png", audioUrl: "Musique/Musique32.mp3", genre: "Rap" },
{ id: 164, title: "SOMETIMES", artist: "4cyzon", album: "Le_Bisounours_", duration: "1:42", cover: "Musique/Images/font164.png", audioUrl: "Musique/Musique164.mp3", genre: "Pop" },
{ id: 139, title: "Set fire to the rain", artist: "Adele", album: "Le_Bisounours_", duration: "4:15", cover: "Musique/Images/font139.png", audioUrl: "Musique/Musique139.mp3", genre: "Pop" },
{ id: 127, title: "En boucle", artist: "Adèle Castillon", album: "Le_Bisounours_", duration: "4:06", cover: "Musique/Images/font127.png", audioUrl: "Musique/Musique127.mp3", genre: "Pop" },
{ id: 91, title: "Usseewa", artist: "Ado", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font91.png", audioUrl: "Musique/Musique91.mp3", genre: "J-Pop" },
{ id: 93, title: "World's smallest violin", artist: "AJR", album: "Le_Bisounours_", duration: "3:07", cover: "Musique/Images/font93.png", audioUrl: "Musique/Musique93.mp3", genre: "Alternative Pop" },
{ id: 14, title: "Fairytale", artist: "Alexander Rybak", album: "Le_Bisounours_", duration: "3:02", cover: "Musique/Images/font14.png", audioUrl: "Musique/Musique14.mp3", genre: "Pop" },
{ id: 26, title: "Flicker", artist: "Andora", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font26.png", audioUrl: "Musique/Musique26.mp3", genre: "Electro" },
{ id: 165, title: "Sweet Little Bumblebee", artist: "Bambee", album: "Le_Bisounours_", duration: "3:15", cover: "Musique/Images/font165.png", audioUrl: "Musique/Musique165.mp3", genre: "Eurodance" },
{ id: 92, title: "Wild side", artist: "Beastars", album: "Le_Bisounours_", duration: "2:38", cover: "Musique/Images/font92.png", audioUrl: "Musique/Musique92.mp3", genre: "Opening" },
{ id: 27, title: "Black Catcher", artist: "Black Clover", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font27.png", audioUrl: "Musique/Musique27.mp3", genre: "Opening" },
{ id: 25, title: "Toxic", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "2:50", cover: "Musique/Images/font25.png", audioUrl: "Musique/Musique25.mp3", genre: "Bedroom Pop" },
{ id: 59, title: "IDGAF", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "2:26", cover: "Musique/Images/font59.png", audioUrl: "Musique/Musique59.mp3", genre: "Bedroom Pop" },
{ id: 82, title: "Problematic", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "3:33", cover: "Musique/Images/font82.png", audioUrl: "Musique/Musique82.mp3", genre: "Bedroom Pop" },
{ id: 84, title: "Rockstar", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "4:32", cover: "Musique/Images/font84.png", audioUrl: "Musique/Musique84.mp3", genre: "Bedroom Pop" },
{ id: 88, title: "Two moons", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "3:56", cover: "Musique/Images/font88.png", audioUrl: "Musique/Musique88.mp3", genre: "Bedroom Pop" },
{ id: 89, title: "Understand", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font89.png", audioUrl: "Musique/Musique89.mp3", genre: "Bedroom Pop" },
{ id: 83, title: "Reflection", artist: "Christina Aguilera", album: "Le_Bisounours_", duration: "3:19", cover: "Musique/Images/font83.png", audioUrl: "Musique/Musique83.mp3", genre: "Pop" },
{ id: 96, title: "Lumière", artist: "Clair Obscur: Expédition 33", album: "Le_Bisounours_", duration: "3:42", cover: "Musique/Images/font96.png", audioUrl: "Musique/Musique96.mp3", genre: "Jeux" },
{ id: 18, title: "Colors By Flow", artist: "Code Geass", album: "Le_Bisounours_", duration: "3:38", cover: "Musique/Images/font18.png", audioUrl: "Musique/Musique18.mp3", genre: "Opening" },
{ id: 41, title: "Pierre, feuille, papier, ciseaux", artist: "Columbine", album: "Le_Bisounours_", duration: "3:45", cover: "Musique/Images/font41.png", audioUrl: "Musique/Musique41.mp3", genre: "Rap" },
{ id: 11, title: "C'est pas grave", artist: "Columbine ", album: "Le_Bisounours_", duration: "2:41", cover: "Musique/Images/font11.png", audioUrl: "Musique/Musique11.mp3", genre: "Rap" },
{ id: 54, title: "Gangsta's Paradise", artist: "Coolio ft. L.V.", album: "Le_Bisounours_", duration: "4:01", cover: "Musique/Images/font54.png", audioUrl: "Musique/Musique54.mp3", genre: "Rap" },
{ id: 43, title: "Daylight", artist: "David Kushner", album: "Le_Bisounours_", duration: "3:49", cover: "Musique/Images/font43.png", audioUrl: "Musique/Musique43.mp3", genre: "Pop" },
{ id: 129, title: "Melodrama", artist: "Disiz & Théodora", album: "Le_Bisounours_", duration: "2:56", cover: "Musique/Images/font129.png", audioUrl: "Musique/Musique129.mp3", genre: "Alternative" },
{ id: 161, title: "Bubblegum Bitch (Hardtekk Slowed)", artist: "DJ BEATCOIN", album: "Le_Bisounours_", duration: "1:29", cover: "Musique/Images/font161.png", audioUrl: "Musique/Musique161.mp3", genre: "Hardtekk" },
{ id: 73, title: "Anxiety", artist: "Doechii", album: "Le_Bisounours_", duration: "4:09", cover: "Musique/Images/font73.png", audioUrl: "Musique/Musique73.mp3", genre: "Rap" },
{ id: 126, title: "Baby Doll", artist: "Dominic Fike", album: "Le_Bisounours_", duration: "1:40", cover: "Musique/Images/font126.png", audioUrl: "Musique/Musique126.mp3", genre: "Alternative" },
{ id: 62, title: "Futur", artist: "DYES IWASAKI", album: "Le_Bisounours_", duration: "3:22", cover: "Musique/Images/font62.png", audioUrl: "Musique/Musique62.mp3", genre: "Electro Swing" },
{ id: 5, title: "Bad Hatter", artist: "DYES IWASAKI", album: "Le_Bisounours_", duration: "2:57", cover: "Musique/Images/font5.png", audioUrl: "Musique/Musique5.mp3", genre: "Electro Swing" },
{ id: 51, title: "Mockingbird", artist: "Eminem", album: "Le_Bisounours_", duration: "4:17", cover: "Musique/Images/font51.png", audioUrl: "Musique/Musique51.mp3", genre: "Rap" },
{ id: 90, title: "Up & Down", artist: "EXGF", album: "Le_Bisounours_", duration: "2:44", cover: "Musique/Images/font90.png", audioUrl: "Musique/Musique90.mp3", genre: "Electro Pop" },
{ id: 94, title: "Veil", artist: "Fire Force", album: "Le_Bisounours_", duration: "3:28", cover: "Musique/Images/font94.png", audioUrl: "Musique/Musique94.mp3", genre: "Opening" },
{ id: 74, title: "Handclap", artist: "Fitz and The Tantrums", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font74.png", audioUrl: "Musique/Musique74.mp3", genre: "Soul-Pop" },
{ id: 57, title: "Le stade", artist: "Fredz", album: "Le_Bisounours_", duration: "2:35", cover: "Musique/Images/font57.png", audioUrl: "Musique/Musique57.mp3", genre: "Rap" },
{ id: 66, title: "Feel Good Inc.", artist: "Gorillaz", album: "Le_Bisounours_", duration: "4:13", cover: "Musique/Images/font66.png", audioUrl: "Musique/Musique66.mp3", genre: "Alternative" },
{ id: 28, title: "Femme à la mer", artist: "Hoshi", album: "Le_Bisounours_", duration: "3:59", cover: "Musique/Images/font28.png", audioUrl: "Musique/Musique28.mp3", genre: "Pop" },
{ id: 70, title: "Radioactive", artist: "Imagine Dragons", album: "Le_Bisounours_", duration: "3:05", cover: "Musique/Images/font70.png", audioUrl: "Musique/Musique70.mp3", genre: "Alternative Rock" },
{ id: 45, title: "Sharks", artist: "Imagine Dragons", album: "Le_Bisounours_", duration: "3:36", cover: "Musique/Images/font45.png", audioUrl: "Musique/Musique45.mp3", genre: "Alternative Rock" },
{ id: 78, title: "Light up the night", artist: "Jamie Berry & Octavia Rose", album: "Le_Bisounours_", duration: "3:53", cover: "Musique/Images/font78.png", audioUrl: "Musique/Musique78.mp3", genre: "Electro Swing" },
{ id: 159, title: "Priilick", artist: "Jeune Morty", album: "Le_Bisounours_", duration: "1:47", cover: "Musique/Images/font159.png", audioUrl: "Musique/Musique159.mp3", genre: "Rap" },
{ id: 157, title: "CARNIVAL", artist: " John Michael Howell", album: "Le_Bisounours_", duration: "1:44", cover: "Musique/Images/font157.png", audioUrl: "Musique/Musique157.mp3", genre: "Pop" },
{ id: 4, title: "Bloody Stream", artist: "JoJo's Bizarre Adventure", album: "Le_Bisounours_", duration: "4:21", cover: "Musique/Images/font4.png", audioUrl: "Musique/Musique4.mp3", genre: "Opening" },
{ id: 64, title: "Golden Hour", artist: "JVKE", album: "Le_Bisounours_", duration: "3:51", cover: "Musique/Images/font64.png", audioUrl: "Musique/Musique64.mp3", genre: "Pop" },
{ id: 124, title: "Her", artist: "JVKE", album: "Le_Bisounours_", duration: "2:51", cover: "Musique/Images/font124.png", audioUrl: "Musique/Musique124.mp3", genre: "Pop" },
{ id: 68, title: "Je ne pense qu'à ça", artist: "Lenaïg", album: "Le_Bisounours_", duration: "2:34", cover: "Musique/Images/font68.png", audioUrl: "Musique/Musique68.mp3", genre: "Pop" },
{ id: 130, title: "Internet", artist: "Lenaïg", album: "Le_Bisounours_", duration: "3:09", cover: "Musique/Images/font130.png", audioUrl: "Musique/Musique130.mp3", genre: "Pop" },
{ id: 131, title: "J'veux que t'aies mal", artist: "Lenaïg", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font131.png", audioUrl: "Musique/Musique131.mp3", genre: "Pop" },
{ id: 85, title: "Star Walkin", artist: "Lil Nas X", album: "Le_Bisounours_", duration: "3:27", cover: "Musique/Images/font85.png", audioUrl: "Musique/Musique85.mp3", genre: "Pop Rap" },
{ id: 95, title: "Star shopping", artist: "Lil Peep", album: "Le_Bisounours_", duration: "2:22", cover: "Musique/Images/font95.png", audioUrl: "Musique/Musique95.mp3", genre: "Emo Rap" },
{ id: 133, title: "What I've Done", artist: "Linkin Park", album: "Le_Bisounours_", duration: "3:27", cover: "Musique/Images/font133.png", audioUrl: "Musique/Musique133.mp3", genre: "Metal" },
{ id: 134, title: "In the end", artist: "Linkin Park", album: "Le_Bisounours_", duration: "3:44", cover: "Musique/Images/font134.png", audioUrl: "Musique/Musique134.mp3", genre: "Metal" },
{ id: 135, title: "Numb", artist: "Linkin Park", album: "Le_Bisounours_", duration: "3:07", cover: "Musique/Images/font135.png", audioUrl: "Musique/Musique135.mp3", genre: "Metal" },
{ id: 21, title: "À peu près", artist: "Lomepal", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font21.png", audioUrl: "Musique/Musique21.mp3", genre: "Rap" },
{ id: 37, title: "Decrescendo", artist: "Lomepal", album: "Le_Bisounours_", duration: "3:41", cover: "Musique/Images/font37.png", audioUrl: "Musique/Musique37.mp3", genre: "Rap" },
{ id: 33, title: "Trop beau", artist: "Lomepal", album: "Le_Bisounours_", duration: "4:04", cover: "Musique/Images/font33.png", audioUrl: "Musique/Musique33.mp3", genre: "Rap" },
{ id: 48, title: "Évidemment", artist: "Lomepal", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font48.png", audioUrl: "Musique/Musique48.mp3", genre: "Rap" },
{ id: 8, title: "1000°C", artist: "Lomepal ft. Roméo Elvis", album: "Le_Bisounours_", duration: "4:41", cover: "Musique/Images/font8.png", audioUrl: "Musique/Musique8.mp3", genre: "Rap" },
{ id: 20, title: "Poupée Russe", artist: "Lujipeka", album: "Le_Bisounours_", duration: "2:44", cover: "Musique/Images/font20.png", audioUrl: "Musique/Musique20.mp3", genre: "Rap" },
{ id: 22, title: "Toutes les machines ont un coeur", artist: "Maëlle", album: "Le_Bisounours_", duration: "4:19", cover: "Musique/Images/font22.png", audioUrl: "Musique/Musique22.mp3", genre: "Pop" },
{ id: 42, title: "THE LONELIEST", artist: "Måneskin", album: "Le_Bisounours_", duration: "4:47", cover: "Musique/Images/font42.png", audioUrl: "Musique/Musique42.mp3", genre: "Rock" },
{ id: 46, title: "I WANNA BE YOUR SLAVE", artist: "Måneskin", album: "Le_Bisounours_", duration: "2:52", cover: "Musique/Images/font46.png", audioUrl: "Musique/Musique46.mp3", genre: "Rock" },
{ id: 10, title: "I Can't Fit In", artist: "Marino", album: "Le_Bisounours_", duration: "2:09", cover: "Musique/Images/font10.png", audioUrl: "Musique/Musique10.mp3", genre: "Pop Indé" },
{ id: 65, title: "I'm Doing Fine", artist: "Marino", album: "Le_Bisounours_", duration: "1:39", cover: "Musique/Images/font65.png", audioUrl: "Musique/Musique65.mp3", genre: "Pop Indé" },
{ id: 166, title: "I'm Sorry Mom", artist: "Marino", album: "Le_Bisounours_", duration: "1:47", cover: "Musique/Images/font166.png", audioUrl: "Musique/Musique166.mp3", genre: "Indie pop" },
{ id: 16, title: "Bling-Bang-Bang-Born", artist: "Mashle", album: "Le_Bisounours_", duration: "2:48", cover: "Musique/Images/font16.png", audioUrl: "Musique/Musique16.mp3", genre: "Opening" },
{ id: 35, title: "Déprime", artist: "Mastu", album: "Le_Bisounours_", duration: "3:19", cover: "Musique/Images/font35.png", audioUrl: "Musique/Musique35.mp3", genre: "Pop" },
{ id: 55, title: "Stolen Dance", artist: "Milky Chance", album: "Le_Bisounours_", duration: "5:13", cover: "Musique/Images/font55.png", audioUrl: "Musique/Musique55.mp3", genre: "Indie Folk" },
{ id: 122, title: "Washing Machine Heart", artist: "Mitski", album: "Le_Bisounours_", duration: "2:08", cover: "Musique/Images/font122.png", audioUrl: "Musique/Musique122.mp3", genre: "Rock Pop punk" },
{ id: 9, title: "Wellerman (Sea Shanty)", artist: "Nathan Evans", album: "Le_Bisounours_", duration: "2:35", cover: "Musique/Images/font9.png", audioUrl: "Musique/Musique9.mp3", genre: "Folk" },
{ id: 19, title: "Dans l'univers", artist: "Nekfeu", album: "Le_Bisounours_", duration: "4:06", cover: "Musique/Images/font19.png", audioUrl: "Musique/Musique19.mp3", genre: "Rap" },
{ id: 38, title: "Astronaute", artist: "Nekfeu", album: "Le_Bisounours_", duration: "6:58", cover: "Musique/Images/font38.png", audioUrl: "Musique/Musique38.mp3", genre: "Rap" },
{ id: 31, title: "Sundance", artist: "Népal", album: "Le_Bisounours_", duration: "2:50", cover: "Musique/Images/font31.png", audioUrl: "Musique/Musique31.mp3", genre: "Rap" },
{ id: 69, title: "Crush", artist: "Nuit Incolore", album: "Le_Bisounours_", duration: "3:12", cover: "Musique/Images/font69.png", audioUrl: "Musique/Musique69.mp3", genre: "Pop" },
{ id: 39, title: "Dépassé", artist: "Nuit Incolore", album: "Le_Bisounours_", duration: "2:52", cover: "Musique/Images/font39.png", audioUrl: "Musique/Musique39.mp3", genre: "Pop" },
{ id: 123, title: "Nothing At All", artist: "Nxdia", album: "Le_Bisounours_", duration: "2:40", cover: "Musique/Images/font123.png", audioUrl: "Musique/Musique123.mp3", genre: "Pop" },
{ id: 58, title: "Help me", artist: "Or3o", album: "Le_Bisounours_", duration: "4:20", cover: "Musique/Images/font58.png", audioUrl: "Musique/Musique58.mp3", genre: "Indie Pop" },
{ id: 34, title: "La Quête", artist: "Orelsan", album: "Le_Bisounours_", duration: "3:54", cover: "Musique/Images/font34.png", audioUrl: "Musique/Musique34.mp3", genre: "Rap" },
{ id: 158, title: "Mirror demo overtonight", artist: "Overtonight", album: "Le_Bisounours_", duration: "1:45", cover: "Musique/Images/font158.png", audioUrl: "Musique/Musique158.mp3", genre: "Indie" },
{ id: 49, title: "House of Memories", artist: "Panic! At The Disco", album: "Le_Bisounours_", duration: "3:29", cover: "Musique/Images/font49.png", audioUrl: "Musique/Musique49.mp3", genre: "Alternative Rock" },
{ id: 63, title: "God-Ish", artist: "PinocchioP", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font63.png", audioUrl: "Musique/Musique63.mp3", genre: "J-Pop" },
{ id: 168, title: "Hey There Delilah", artist: "Plain White T's", album: "Le_Bisounours_", duration: "4:03", cover: "Musique/Images/font168.png", audioUrl: "Musique/Musique168.mp3", genre: "Folk rock" },
{ id: 44, title: "Ceux qui rêvent", artist: "Pomme", album: "Le_Bisounours_", duration: "1:58", cover: "Musique/Images/font44.png", audioUrl: "Musique/Musique44.mp3", genre: "Pop Indé" },
{ id: 56, title: "Feed the Machine", artist: "Poor Man's Poison", album: "Le_Bisounours_", duration: "3:03", cover: "Musique/Images/font56.png", audioUrl: "Musique/Musique56.mp3", genre: "Folk" },
{ id: 67, title: "Give and Take", artist: "Poor Man's Poison", album: "Le_Bisounours_", duration: "3:17", cover: "Musique/Images/font67.png", audioUrl: "Musique/Musique67.mp3", genre: "Folk" },
{ id: 167, title: "Misery", artist: "Pupsie", album: "Le_Bisounours_", duration: "2:46", cover: "Musique/Images/font167.png", audioUrl: "Musique/Musique167.mp3", genre: "Indie pop" },
{ id: 6, title: "Black Betty", artist: "Ram Jam", album: "Le_Bisounours_", duration: "2:24", cover: "Musique/Images/font6.png", audioUrl: "Musique/Musique6.mp3", genre: "Rock" },
{ id: 76, title: "Hit The Road Jack", artist: "Ray Charles", album: "Le_Bisounours_", duration: "2:02", cover: "Musique/Images/font76.png", audioUrl: "Musique/Musique76.mp3", genre: "R&B" },
{ id: 125, title: "What About Me", artist: "Rex Orange County", album: "Le_Bisounours_", duration: "4:22", cover: "Musique/Images/font125.png", audioUrl: "Musique/Musique125.mp3", genre: "Pop" },
{ id: 15, title: "Malade", artist: "Roméo Elvis", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font15.png", audioUrl: "Musique/Musique15.mp3", genre: "Rap" },
{ id: 80, title: "Overwhelmed", artist: "Royal & the Serpent", album: "Le_Bisounours_", duration: "3:26", cover: "Musique/Images/font80.png", audioUrl: "Musique/Musique80.mp3", genre: "Alternative" },
{ id: 162, title: "Unhappy", artist: "S0rrow", album: "Le_Bisounours_", duration: "1:38", cover: "Musique/Images/font162.png", audioUrl: "Musique/Musique162.mp3", genre: "Indie" },
{ id: 1, title: "Un quart d'heure", artist: "Satine", album: "Le_Bisounours_", duration: "2:36", cover: "Musique/Images/font1.png", audioUrl: "Musique/Musique1.mp3", genre: "Pop" },
{ id: 77, title: "I Wanna Be Like You", artist: "Sid Bader", album: "Le_Bisounours_", duration: "2:01", cover: "Musique/Images/font77.png", audioUrl: "Musique/Musique77.mp3", genre: "Electro Swing" },
{ id: 163, title: "Impostor Syndrome", artist: "Sidney Gish", album: "Le_Bisounours_", duration: "4:54", cover: "Musique/Images/font163.png", audioUrl: "Musique/Musique163.mp3", genre: "Indie pop" },
{ id: 60, title: "Ma Meilleure Ennemie", artist: "Stomae & Pomme", album: "Le_Bisounours_", duration: "2:28", cover: "Musique/Images/font60.png", audioUrl: "Musique/Musique60.mp3", genre: "Pop Indé" },
{ id: 29, title: "Chute d'étoiles", artist: "Suzuya", album: "Le_Bisounours_", duration: "2:12", cover: "Musique/Images/font29.png", audioUrl: "Musique/Musique29.mp3", genre: "Rap" },
{ id: 53, title: "Actrice Fantôme", artist: "Suzuya", album: "Le_Bisounours_", duration: "2:52", cover: "Musique/Images/font53.png", audioUrl: "Musique/Musique53.mp3", genre: "Rap" },
{ id: 30, title: "Dis-moi que tu me détestes.", artist: "Suzuya", album: "Le_Bisounours_", duration: "2:05", cover: "Musique/Images/font30.png", audioUrl: "Musique/Musique30.mp3", genre: "Rap" },
{ id: 79, title: "No Strings Attached", artist: "Swingrowers", album: "Le_Bisounours_", duration: "4:07", cover: "Musique/Images/font79.png", audioUrl: "Musique/Musique79.mp3", genre: "Electro Swing" },
{ id: 136, title: "Toxicity", artist: "System of a Down", album: "Le_Bisounours_", duration: "3:44", cover: "Musique/Images/font136.png", audioUrl: "Musique/Musique136.mp3", genre: "Metal" },
{ id: 137, title: "Chop Suey!", artist: "System of a Down", album: "Le_Bisounours_", duration: "3:28", cover: "Musique/Images/font137.png", audioUrl: "Musique/Musique137.mp3", genre: "Metal" },
{ id: 138, title: "Zombie", artist: "The Cranberries", album: "Le_Bisounours_", duration: "3:47", cover: "Musique/Images/font138.png", audioUrl: "Musique/Musique138.mp3", genre: "Rock" },
{ id: 24, title: "Empires", artist: "The Electric Swing Circus", album: "Le_Bisounours_", duration: "3:10", cover: "Musique/Images/font24.png", audioUrl: "Musique/Musique24.mp3", genre: "Electro Swing" },
{ id: 87, title: "Sweater weather", artist: "The Neighbourhood", album: "Le_Bisounours_", duration: "3:57", cover: "Musique/Images/font87.png", audioUrl: "Musique/Musique87.mp3", genre: "Alternative" },
{ id: 128, title: "The Adults Are Talking", artist: "The Strokes", album: "Le_Bisounours_", duration: "4:47", cover: "Musique/Images/font128.png", audioUrl: "Musique/Musique128.mp3", genre: "New wave" },
{ id: 17, title: "Body Talks", artist: "The Struts", album: "Le_Bisounours_", duration: "3:00", cover: "Musique/Images/font17.png", audioUrl: "Musique/Musi que17.mp3", genre: "Rock" },
{ id: 81, title: "Party like it's 1920", artist: "The Swinghoppers & Wolfgang Lohr", album: "Le_Bisounours_", duration: "3:05", cover: "Musique/Images/font81.png", audioUrl: "Musique/Musique81.mp3", genre: "Electro Swing" },
{ id: 160, title: "Sa musique préférée", artist: "TheFrenchKris", album: "Le_Bisounours_", duration: "2:31", cover: "Musique/Images/font160.png", audioUrl: "Musique/Musique160.mp3", genre: "Rap" },
{ id: 40, title: "Hit Sale", artist: "Therapie Taxi ft. Roméo Elvis", album: "Le_Bisounours_", duration: "3:19", cover: "Musique/Images/font40.png", audioUrl: "Musique/Musique40.mp3", genre: "Pop Rock" },
{ id: 72, title: "Vampire", artist: "Tsew The Kid", album: "Le_Bisounours_", duration: "2:17", cover: "Musique/Images/font72.png", audioUrl: "Musique/Musique72.mp3", genre: "Rap" },
{ id: 50, title: "Heathens", artist: "Twenty One Pilots", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font50.png", audioUrl: "Musique/Musique50.mp3", genre: "Alternative" },
{ id: 52, title: "Stressed Out", artist: "Twenty One Pilots", album: "Le_Bisounours_", duration: "3:22", cover: "Musique/Images/font52.png", audioUrl: "Musique/Musique52.mp3", genre: "Alternative" },
{ id: 47, title: "Riptide", artist: "Vance Joy", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font47.png", audioUrl: "Musique/Musique47.mp3", genre: "Indie Folk" },
{ id: 86, title: "Shiawase no Monosashi", artist: "Vantage", album: "Le_Bisounours_", duration: "5:00", cover: "Musique/Images/font86.png", audioUrl: "Musique/Musique86.mp3", genre: "Future Funk" },
{ id: 61, title: "Roi", artist: "Videoclub", album: "Le_Bisounours_", duration: "3:49", cover: "Musique/Images/font61.png", audioUrl: "Musique/Musique61.mp3", genre: "Pop Indé" },
{ id: 13, title: "Sur tes pas", artist: "Wakfu", album: "Le_Bisounours_", duration: "4:01", cover: "Musique/Images/font13.png", audioUrl: "Musique/Musique13.mp3", genre: "Soundtrack" },
{ id: 75, title: "Hardware Store", artist: "Weird Al Yankovic", album: "Le_Bisounours_", duration: "3:44", cover: "Musique/Images/font75.png", audioUrl: "Musique/Musique75.mp3", genre: "Comedy" },
{ id: 23, title: "Épisode III - Les mains libres", artist: "Yuzmv", album: "Le_Bisounours_", duration: "3:40", cover: "Musique/Images/font23.png", audioUrl: "Musique/Musique23.mp3", genre: "Rap" },
{ id: 132, title: "Tourner la page", artist: "Zaho", album: "Le_Bisounours_", duration: "4:26", cover: "Musique/Images/font132.png", audioUrl: "Musique/Musique132.mp3", genre: "Pop" },
{ id: 109, title: "Réplique Culte", artist: "French Fuse", album: "Le_Bisounours_", duration: "3:16", cover: "Musique/Images/font109.png", audioUrl: "Musique/Musique109.mp3", genre: "Remix" },
{ id: 110, title: "Harry Potter", artist: "French Fuse", album: "Le_Bisounours_", duration: "3:41", cover: "Musique/Images/font109.png", audioUrl: "Musique/Musique110.mp3", genre: "Remix" },
{ id: 114, title: "La Chanson des manifs", artist: "French Fuse", album: "Le_Bisounours_", duration: "3:23", cover: "Musique/Images/font109.png", audioUrl: "Musique/Musique114.mp3", genre: "Remix" },
{ id: 116, title: "The Crusade of God", artist: "Inazuma Eleven", album: "Le_Bisounours_", duration: "2:26", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique116.mp3", genre: "Opening" },
{ id: 117, title: "Official Matches ", artist: "Inazuma Eleven", album: "Le_Bisounours_", duration: "2:22", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique117.mp3", genre: "Opening" },
{ id: 118, title: "Mou Hitori no Ace Striker", artist: "Inazuma Eleven", album: "Le_Bisounours_", duration: "2:25", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique118.mp3", genre: "Opening" },
{ id: 115, title: "Vise le sommet", artist: "Inazuma Eleven Ares ", album: "Le_Bisounours_", duration: "4:08", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique115.mp3", genre: "Opening" },
{ id: 119, title: "Jounetsu de Mune Atsu!", artist: "Inazuma Eleven Go Chrono Stone", album: "Le_Bisounours_", duration: "4:44", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique119.mp3", genre: "Opening" },
{ id: 120, title: "Kandou Kyouyuu!", artist: "Inazuma Eleven Go Chrono Stone", album: "Le_Bisounours_", duration: "1:24", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique120.mp3", genre: "Opening" },
{ id: 106, title: "Takedown", artist: "Kpop Demon Hunter", album: "Le_Bisounours_", duration: "3:01", cover: "Musique/Images/font106.png", audioUrl: "Musique/Musique106.mp3", genre: "Film" },
{ id: 107, title: "Golden", artist: "Kpop Demon Hunter", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font106.png", audioUrl: "Musique/Musique107.mp3", genre: "Film" },
{ id: 108, title: "Your Idol", artist: "Kpop Demon Hunter", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font106.png", audioUrl: "Musique/Musique108.mp3", genre: "Film" },
{ id: 111, title: "On se Moque", artist: "Molière le spectacle Musical", album: "Le_Bisounours_", duration: "2:47", cover: "Musique/Images/font111.png", audioUrl: "Musique/Musique111.mp3", genre: "Théâtre" },
{ id: 112, title: "Rêver j'en ai l'habitude", artist: "Molière le spectacle Musical", album: "Le_Bisounours_", duration: "3:17", cover: "Musique/Images/font111.png", audioUrl: "Musique/Musique112.mp3", genre: "Théâtre" },
{ id: 113, title: "À quoi ça rime", artist: "Molière le spectacle Musical", album: "Le_Bisounours_", duration: "2:36", cover: "Musique/Images/font111.png", audioUrl: "Musique/Musique113.mp3", genre: "Théâtre" },
{ id: 121, title: "Vol. 2 Wild Pokemon Battle Theme", artist: "Pokémon Journeys", album: "Le_Bisounours_", duration: "1:48", cover: "Musique/Images/font121.png", audioUrl: "Musique/Musique121.mp3", genre: "OST" },
{ id: 102, title: "C'est nous les bloods", artist: "Bisounours", album: "Le_Bisounours_", duration: "2:21", cover: "Musique/Images/font100.png", audioUrl: "Musique/Musique100.mp3", genre: "IA" },
{ id: 103, title: "Sad of Bisounours", artist: "Bisounours", album: "Le_Bisounours_", duration: "3:10", cover: "Musique/Images/font103.png", audioUrl: "Musique/Musique103.mp3", genre: "IA" },
{ id: 104, title: "Devil Bisounours", artist: "Bisounours", album: "Le_Bisounours_", duration: "2:43", cover: "Musique/Images/font104.png", audioUrl: "Musique/Musique104.mp3", genre: "IA" },
{ id: 105, title: "The Stars Cousins", artist: "Bisounours", album: "Le_Bisounours_", duration: "2:28", cover: "Musique/Images/font105.png", audioUrl: "Musique/Musique105.mp3", genre: "IA" },
{ id: 155, title: "Lugia's Song (The Legend Comes To Life)", artist: "Anthony Lo Re", album: "Le_Bisounours_", duration: "1:02:35", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique155.mp3", genre: "Opening" },
{ id: 97, title: "Attrape les tous", artist: "Tresko", album: "Le_Bisounours_", duration: "2:00", cover: "Musique/Images/font97.png", audioUrl: "Musique/Musique97.mp3", genre: "IA" },
{ id: 98, title: "L'inquisiteur redouté", artist: "Tresko", album: "Le_Bisounours_", duration: "3:16", cover: "Musique/Images/font98.png", audioUrl: "Musique/Musique98.mp3", genre: "IA" },
{ id: 99, title: "Nuit d'épouvante", artist: "Tresko", album: "Le_Bisounours_", duration: "2:28", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique99.mp3", genre: "IA" },
{ id: 100, title: "Galaxie Lointaine", artist: "Tresko", album: "Le_Bisounours_", duration: "2:00", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique101.mp3", genre: "IA" },
{ id: 101, title: "Tyron des Bloods", artist: "Tresko", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique102.mp3", genre: "IA" },
{ id: 140, title: "Frère flic", artist: "Tresko", album: "Le_Bisounours_", duration: "2:48", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique140.mp3", genre: "IA" },
{ id: 141, title: "Tyron dans la rue", artist: "Tresko", album: "Le_Bisounours_", duration: "2:43", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique141.mp3", genre: "IA" },
{ id: 142, title: "Nuit d'épouvante", artist: "Tresko", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique142.mp3", genre: "IA" },
{ id: 143, title: "Frère Rookie", artist: "Tresko", album: "Le_Bisounours_", duration: "3:13", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique143.mp3", genre: "IA" },
{ id: 144, title: "Empire contre République", artist: "Tresko", album: "Le_Bisounours_", duration: "2:40", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique144.mp3", genre: "IA" },
{ id: 145, title: "Naissance d'une Légende", artist: "Tresko", album: "Le_Bisounours_", duration: "3:04", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique145.mp3", genre: "IA" },
{ id: 146, title: "Station Astromète", artist: "Tresko", album: "Le_Bisounours_", duration: "3:43", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique146.mp3", genre: "IA" },
{ id: 147, title: "Ombre dans l'espace", artist: "Tresko", album: "Le_Bisounours_", duration: "2:42", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique147.mp3", genre: "IA" },
{ id: 148, title: "Ashen & Devon", artist: "Tresko", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique148.mp3", genre: "IA" },
{ id: 149, title: "Tyron, bloods dans le sang", artist: "Tresko", album: "Le_Bisounours_", duration: "1:58", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique149.mp3", genre: "IA" },
{ id: 150, title: "Fairy Tail Theme Song", artist: "Tresko", album: "Le_Bisounours_", duration: "2:19", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique150.mp3", genre: "IA" },
{ id: 151, title: "Inazuma Eleven Go Chrono Stone OST - Battle! Fighting", artist: "Tresko", album: "Le_Bisounours_", duration: "3:29", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique151.mp3", genre: "IA" },
{ id: 152, title: "Inazuma Eleven OST - Burning Phase Special AI", artist: "Tresko", album: "Le_Bisounours_", duration: "2:39", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique152.mp3", genre: "IA" },
{ id: 153, title: "Inazuma11 OST 1 - The crusade of God", artist: "Tresko", album: "Le_Bisounours_", duration: "2:22", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique153.mp3", genre: "IA" },
{ id: 154, title: "Une galaxie lointaine remake", artist: "Tresko", album: "Le_Bisounours_", duration: "2:47", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique154.mp3", genre: "IA" },
{ id: 156, title: "Ney, le coeur de la forêt", artist: "Tresko", album: "Le_Bisounours_", duration: "2:47", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique156.mp3", genre: "IA" },
];

const soundDatabase = [
{ id: 1, title: "Bip", artist: "SFX", duration: "0:01", cover: "SoundBoard/Images/Bip1.png", audioUrl: "SoundBoard/Bip1.mp3" },
{ id: 2, title: "Ennnn", artist: "SFX", duration: "0:01", cover: "SoundBoard/Images/Ahhhh.png", audioUrl: "SoundBoard/Ahhhh.mp3" },
{ id: 3, title: "Explode Bass", artist: "SFX", duration: "0:04", cover: "SoundBoard/Images/Bass.png", audioUrl: "SoundBoard/Bass.mp3" },
{ id: 4, title: "Bruum", artist: "SFX", duration: "0:01", cover: "SoundBoard/Images/Bruum.png", audioUrl: "SoundBoard/Bruum.mp3" },
{ id: 5, title: "Oh Now", artist: "SFX", duration: "0:05", cover: "SoundBoard/Images/Ohnow.png", audioUrl: "SoundBoard/ohnow.mp3" },
{ id: 6, title: "What ?", artist: "SFX", duration: "0:09", cover: "SoundBoard/Images/what.png", audioUrl: "SoundBoard/what.mp3" },
{ id: 7, title: "Oh Ma Gaud", artist: "SFX", duration: "0:02", cover: "SoundBoard/Images/Ohmagaud.png", audioUrl: "SoundBoard/Ohmagaud.mp3" },
{ id: 8, title: "Windows XP Error", artist: "SFX", duration: "0:01", cover: "SoundBoard/Images/WindowsXPError.png", audioUrl: "SoundBoard/WindowsXPError.mp3" },
{ id: 9, title: "Chili Chili Fart", artist: "SFX", duration: "0:01", cover: "SoundBoard/Images/chilichilifart.png", audioUrl: "SoundBoard/chilichilifart.mp3" },
{ id: 10, title: "Annonce", artist: "SFX", duration: "0:04", cover: "SoundBoard/Images/annonce.png", audioUrl: "SoundBoard/annonce.mp3" },
{ id: 11, title: "Au pays de Candy", artist: "SFX", duration: "0:13", cover: "SoundBoard/Images/candy.png", audioUrl: "SoundBoard/candy.mp3" },
{ id: 12, title: "End Of Watch", artist: "SFX", duration: "0:01", cover: "SoundBoard/Images/endofwatch.png", audioUrl: "SoundBoard/endofwatch.mp3" },
{ id: 13, title: "Hana-Do", artist: "Zenkai", duration: "0:42", cover: "SoundBoard/Images/hanado.png", audioUrl: "SoundBoard/hanado.mp3" },
];
const defaultPlaylists = [
{ id: 'default-1', name: "Mes favoris", description: "Mes sons favoris !", cover: "Musique/Images/favorite.png", tracks: [], isDefault: true }
];const PlaylistOptionsModal = ({ playlist, onClose, onDelete, onEdit, onExport }) => {
const { isDarkMode } = useTheme();
return (<div className="modal-backdrop" onClick={onClose}><div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}><h2 className="modal-title">Options pour "{playlist.name}"</h2><div className="playlist-options"><button className="option-btn edit-btn" onClick={() => { onClose(); onEdit(playlist); }}>✏️ Éditer la playlist</button><button className="option-btn export-btn" onClick={() => onExport(playlist)}>📤 Exporter la playlist</button><button className="option-btn delete-btn" onClick={() => onDelete(playlist.id)}>🗑️ Supprimer la playlist</button></div><div className="modal-buttons"><button onClick={onClose} className="btn btn-secondary">Annuler</button></div></div></div>);
};const PlaylistEditModal = ({ playlist, onClose, onSave }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState(playlist.name || '');
const [description, setDescription] = useState(playlist.description || '');
const [cover, setCover] = useState(playlist.cover || '');
const handleSubmit = (e) => {
e.preventDefault();if (!name.trim()) { alert("Le nom de la playlist est obligatoire !"); return; }
onSave({ ...playlist, name: name.trim(), description: description.trim(), cover: cover.trim() || playlist.cover, });
onClose();
};
return (<div className="modal-backdrop" onClick={onClose}><div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}><h2 className="modal-title">Modifier la playlist</h2><form onSubmit={handleSubmit} className="modal-form"><div className="form-group"><label className="form-label">Nom *</label><input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required autoFocus/></div><div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} rows="3"/></div><div className="form-group"><label className="form-label">URL de la cover</label><input type="url" className="form-input" value={cover} onChange={e => setCover(e.target.value)} placeholder="https://exemple.com/image.jpg"/></div><div className="modal-buttons"><button type="submit" className="btn btn-primary" style={{ background: currentTheme.gradient }}>Sauvegarder</button><button type="button" onClick={onClose} className="btn btn-secondary">Annuler</button></div></form></div></div>);
};const CreatePlaylistModal = ({ onClose, onCreate, onImport }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [cover, setCover] = useState('');
const fileInputRef = useRef(null);
const handleSubmit = (e) => {
e.preventDefault();
if (name.trim()) { onCreate(name.trim(), description.trim(), cover.trim()); setName(''); setDescription(''); setCover(''); }
};
const handleImport = (e) => {
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
};
return (<div className="modal-backdrop" onClick={onClose}><div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}><h2 className="modal-title">Créer une nouvelle playlist</h2><form onSubmit={handleSubmit} className="modal-form"><div className="form-group"><label className="form-label">Nom de la playlist *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="Ma nouvelle playlist" required/></div><div className="form-group"><label className="form-label">Description (optionnel)</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" placeholder="Description de votre playlist" rows="3"/></div><div className="form-group"><label className="form-label">URL de la cover (optionnel)</label><input type="url" value={cover} onChange={(e) => setCover(e.target.value)} className="form-input" placeholder="https://exemple.com/image.jpg"/></div><div className="modal-buttons"><button type="submit" className="btn btn-primary" style={{ background: currentTheme.gradient }}>Créer</button><button type="button" onClick={onClose} className="btn btn-secondary">Annuler</button></div></form><div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}><input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }}/><button type="button" onClick={() => fileInputRef.current.click()} className="btn btn-secondary" style={{ width: '100%' }}>📥 Importer une playlist</button></div></div></div>);
};const AddToPlaylistModal = ({ track, playlists, onClose, onAdd }) => {
const { isDarkMode, currentTheme } = useTheme();
return (<div className="modal-backdrop" onClick={onClose}><div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}><h2 className="modal-title">Ajouter "{track.title}" à une playlist</h2><div className="playlist-list">{playlists.length === 0 ? (<p>Aucune playlist disponible. Créez-en une d'abord !</p>) : (playlists.map(playlist => (<button key={playlist.id} className="playlist-option" onClick={() => onAdd(playlist.id, track)}><img src={playlist.cover} alt={playlist.name} className="playlist-option-cover" /><div className="playlist-option-info"><div className="playlist-option-name">{playlist.name}</div><div className="playlist-option-tracks">{playlist.tracks.length} titres</div></div>{playlist.tracks.find(t => t.id === track.id) && (<span className="already-added" style={{ color: currentTheme.primary }}>✓ Déjà ajouté</span>)}</button>)))}</div><div className="modal-buttons"><button onClick={onClose} className="btn btn-secondary">Fermer</button></div></div></div>);
};const SaveQueueModal = ({ queue, onClose, onCreate }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState('Ma file d\'attente');
const [description, setDescription] = useState('');const handleSubmit = (e) => {
e.preventDefault();
if (name.trim() && queue.length > 0) { onCreate(name.trim(), description.trim(), queue); onClose(); }
};
return (<div className="modal-backdrop" onClick={onClose}><div className={`modal ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}><h2 className="modal-title">💾 Sauvegarder la file d'attente</h2><p className="modal-subtitle">{queue.length} musiques seront ajoutées</p><form onSubmit={handleSubmit} className="modal-form"><div className="form-group"><label className="form-label">Nom de la playlist *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="Ma nouvelle playlist" required/></div><div className="form-group"><label className="form-label">Description (optionnel)</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" placeholder="Description de votre playlist" rows="2"/></div><div className="modal-buttons"><button type="submit" className="btn btn-primary" style={{ background: currentTheme.gradient }}>Sauvegarder</button><button type="button" onClick={onClose} className="btn btn-secondary">Annuler</button></div></form></div></div>);
};const CreateSoundBoardModal = ({ onClose, onCreate, onImport }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [cover, setCover] = useState('');
const fileInputRef = useRef(null);  const handleSubmit = (e) => {
e.preventDefault();
if (name.trim()) {
onCreate(name.trim(), description.trim(), cover.trim());
setName('');
setDescription('');
setCover('');
}
};  const handleImport = (e) => {
const file = e.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
try {
const importedBoard = JSON.parse(event.target.result);
onImport(importedBoard);
} catch (error) {
alert('Erreur lors de l\'importation. Assurez-vous que le fichier est au bon format.');
}
};
reader.readAsText(file);
}
};  return (
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
📥 Importer une SoundBoard
</button>
</div>
</div>
</div>
);
};
const RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Reprise de la dernière lecture (titre, file, position) au rechargement de la page
const loadSession = () => {
  const saved = loadJSON('spotizer-session', null);
  if (!saved || !saved.trackId) return null;
  const track = musicDatabase.find(t => t.id === saved.trackId);
  if (!track) return null;
  const queue = (Array.isArray(saved.queueIds) ? saved.queueIds : []).map(id => musicDatabase.find(t => t.id === id)).filter(Boolean);
  return {
    track,
    queue: queue.length ? queue : [track],
    time: Number(saved.time) || 0,
    shuffle: !!saved.shuffle,
    repeat: [0, 1, 2].includes(saved.repeat) ? saved.repeat : 0
  };
};

function AppContent() {

const { isDarkMode, currentTheme } = useTheme();
const { addToHistory, addListeningTime, sleepTimerActive, sleepTimerRemaining, getRecommendations } = useMusic();
const { settings, likedIds, isLiked, toggleLike, addRecentSearch } = useLibrary();
const { toast } = useToast();
const off = useOffline();
const offRef = useRef(off); offRef.current = off;
const wantPlayRef = useRef(false);
const settingsRef = useRef(settings); settingsRef.current = settings;
const navMeta = useRef({ fromPop: false, first: true });
const [abLoop, setAbLoop] = useState({ a: null, b: null });
const abRef = useRef(abLoop); abRef.current = abLoop;
const [scrubHover, setScrubHover] = useState(null);
const [blobSrc, setBlobSrc] = useState({ id: null, url: null });
const { 
soundBoards, 
createSoundBoard, 
deleteSoundBoard, 
updateSoundBoard,
exportSoundBoard,
importSoundBoard,
selectedSoundBoardForShortcuts
} = useSoundBoard();
const [currentPage, setCurrentPage] = useState('home');
const [session] = useState(loadSession);
const [currentTrack, setCurrentTrack] = useState(session ? session.track : null);
const [isPlaying, setIsPlaying] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [showCreateSoundBoardModal, setShowCreateSoundBoardModal] = useState(false);
const [selectedSoundBoard, setSelectedSoundBoard] = useState(null);
const [showSoundBoardOptionsModal, setShowSoundBoardOptionsModal] = useState(false);
const [soundBoardForOptions, setSoundBoardForOptions] = useState(null);
const [showEditSoundBoardModal, setShowEditSoundBoardModal] = useState(false);
const [soundBoardToEdit, setSoundBoardToEdit] = useState(null);
const [volume, setVolume] = useState(() => {
const saved = localStorage.getItem('spotizer-volume');
return saved !== null ? parseFloat(saved) : 0.05;
});
const [isMuted, setIsMuted] = useState(() => { try { return localStorage.getItem('spotizer-muted') === '1'; } catch (e) { return false; } });
const [playlists, setPlaylists] = useState(() => {
try {
const saved = JSON.parse(localStorage.getItem('deezer-playlists'));
return Array.isArray(saved) && saved.length > 0 ? saved : defaultPlaylists;
} catch (e) { return defaultPlaylists; }
});
const [selectedPlaylist, setSelectedPlaylist] = useState(null);
const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
const [trackToAdd, setTrackToAdd] = useState(null);
const [showPlaylistOptionsModal, setShowPlaylistOptionsModal] = useState(false);
const [playlistToEdit, setPlaylistToEdit] = useState(null);
const [playlistForOptions, setPlaylistForOptions] = useState(null);
const [showPlaylistEditModal, setShowPlaylistEditModal] = useState(false);
const [isShuffleMode, setIsShuffleMode] = useState(session ? session.shuffle : false);
const [currentQueue, setCurrentQueue] = useState(session ? session.queue : []);
const [isRepeatMode, setIsRepeatMode] = useState(session ? session.repeat : 0);
const [showQueuePanel, setShowQueuePanel] = useState(false);
const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
const [showSaveQueueModal, setShowSaveQueueModal] = useState(false);
const [lastPlayTime, setLastPlayTime] = useState(0);
const [pageParam, setPageParam] = useState(null);
const [playbackRate, setPlaybackRate] = useState(() => { try { const r = parseFloat(localStorage.getItem('spotizer-rate')); return RATES.includes(r) ? r : 1; } catch (e) { return 1; } });
const [contextMenu, setContextMenu] = useState(null);
const [showFullPlayer, setShowFullPlayer] = useState(false);
const [stopAfterTrack, setStopAfterTrack] = useState(false);
const [isDucked, setIsDucked] = useState(false);
const [showTop, setShowTop] = useState(false);
const stopAfterTrackRef = useRef(false);
const pendingSeekRef = useRef(session ? session.time : 0);
const queueSourceRef = useRef(null);
const searchInputRef = useRef(null);
const pageContentRef = useRef(null);
const npChannel = useRef(null);
const controlsRef = useRef({});
const stateRef = useRef({});
const collection = useMemo(() => {
  if (!pageParam) return null;
  const { type, value } = pageParam;
  if (type === 'artist') {
    const n = normalize(value);
    return { title: value, subtitle: 'Artiste', emoji: '🎤', tracks: musicDatabase.filter(t => splitArtists(t.artist).some(a => normalize(a) === n)) };
  }
  if (type === 'genre') {
    const n = normalize(value);
    return { title: value, subtitle: 'Genre', emoji: '🏷️', tracks: musicDatabase.filter(t => normalize(t.genre).includes(n)) };
  }
  if (type === 'mood') {
    const m = MOODS.find(x => x.id === value);
    if (!m) return null;
    return { title: m.name, subtitle: 'Mix par humeur', emoji: m.emoji, tracks: moodTracks(m, musicDatabase), showGenreChips: true };
  }
  return null;
}, [pageParam]);
const likedTracks = useMemo(() => likedIds.map(id => musicDatabase.find(t => t.id === id)).filter(Boolean), [likedIds]);
const openSoundBoardOptionsModal = (board) => {
setSoundBoardForOptions(board);
setShowSoundBoardOptionsModal(true);
};const handleEditSoundBoard = (board) => {
setSoundBoardToEdit(board);
setShowEditSoundBoardModal(true);
setShowSoundBoardOptionsModal(false);
};const handleDeleteSoundBoard = (boardId) => {
if (window.confirm('Êtes-vous sûr de vouloir supprimer ce SoundBoard ?')) {
deleteSoundBoard(boardId);
if (selectedSoundBoard?.id === boardId) {
setSelectedSoundBoard(null);
}
setShowSoundBoardOptionsModal(false);
}
};const handleExportSoundBoard = (board) => {
exportSoundBoard(board);
setShowSoundBoardOptionsModal(false);
};const handleUpdateSoundBoard = (updatedBoard) => {
updateSoundBoard(updatedBoard);
if (selectedSoundBoard?.id === updatedBoard.id) {
setSelectedSoundBoard(updatedBoard);
}
setShowEditSoundBoardModal(false);
setSoundBoardToEdit(null);
};
const audioRef = useRef(null);const shuffleArray = useCallback((array) => {
const newArray = [...array];
for (let i = newArray.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
}
return newArray;
}, []);const initializeQueue = useCallback((startTrack, sourceList) => {
const startIndex = sourceList.findIndex(t => t.id === startTrack.id);
if (startIndex === -1) return [startTrack];
const queue = [ ...sourceList.slice(startIndex), ...sourceList.slice(0, startIndex) ];
return queue;
}, []);
const updateMediaSessionMetadata = useCallback((track) => {
if (!track) return;
if ('mediaSession' in navigator) {
navigator.mediaSession.metadata = new window.MediaMetadata({
title: track.title, artist: track.artist, album: track.album || '',
artwork: [{ src: track.cover, sizes: '512x512', type: 'image/png' }]
});
}
}, []);const navLive = useRef({});
navLive.current = { currentPage, pageParam, plId: selectedPlaylist?.id ?? null, playlists, showFullPlayer };
useEffect(() => {
const st = { page: currentPage, param: pageParam, pl: selectedPlaylist?.id ?? null };
try {
if (navMeta.current.first) { navMeta.current.first = false; window.history.replaceState(st, ''); return; }
if (navMeta.current.fromPop) { navMeta.current.fromPop = false; return; }
window.history.pushState(st, '');
} catch (e) {}
}, [currentPage, pageParam, selectedPlaylist]);
useEffect(() => {
const onPop = (e) => {
const st = e.state; const live = navLive.current;
if (live.showFullPlayer) { setShowFullPlayer(false); return; }
if (!st || !st.page) return;
const samePl = (st.pl ?? null) === live.plId;
if (st.page === live.currentPage && JSON.stringify(st.param ?? null) === JSON.stringify(live.pageParam ?? null) && samePl) return;
navMeta.current.fromPop = true;
setCurrentPage(st.page); setPageParam(st.param ?? null);
setSelectedPlaylist(st.pl != null ? (live.playlists.find((p) => p.id === st.pl) || null) : null);
};
window.addEventListener('popstate', onPop);
return () => window.removeEventListener('popstate', onPop);
}, []);
useEffect(() => {
if (showFullPlayer) { try { window.history.pushState({ page: currentPage, param: pageParam, pl: selectedPlaylist?.id ?? null, fp: 1 }, ''); } catch (e) {} }
}, [showFullPlayer]);
useEffect(() => {
let timer = null; let sx = 0; let sy = 0; let fired = false;
const clear = () => { clearTimeout(timer); timer = null; };
const start = (e) => {
if (e.touches.length !== 1) return;
const el = e.target.closest && e.target.closest('.track-item, .card');
if (!el) return;
sx = e.touches[0].clientX; sy = e.touches[0].clientY; fired = false;
timer = setTimeout(() => {
fired = true; try { navigator.vibrate && navigator.vibrate(15); } catch (err) {}
el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: sx, clientY: sy }));
}, 550);
};
const move = (e) => { if (timer && (Math.abs(e.touches[0].clientX - sx) > 10 || Math.abs(e.touches[0].clientY - sy) > 10)) clear(); };
const end = (e) => { clear(); if (fired) { e.preventDefault(); fired = false; } };
window.addEventListener('touchstart', start, { passive: true });
window.addEventListener('touchmove', move, { passive: true });
window.addEventListener('touchend', end);
window.addEventListener('touchcancel', clear);
return () => { window.removeEventListener('touchstart', start); window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end); window.removeEventListener('touchcancel', clear); };
}, []);
const [coverRgb, setCoverRgb] = useState('147,51,234');
useEffect(() => {
if (!currentTrack || !settings.dynamicColor) return undefined;
let alive = true;
const img = new Image();
img.onload = () => {
try {
const c = document.createElement('canvas'); c.width = 12; c.height = 12;
const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, 12, 12);
const d = g.getImageData(0, 0, 12, 12).data;
let r = 0, gg = 0, b = 0, w = 0;
for (let i = 0; i < d.length; i += 4) {
const mx = Math.max(d[i], d[i + 1], d[i + 2]); const mn = Math.min(d[i], d[i + 1], d[i + 2]);
const wt = 0.15 + (mx - mn) / 255 + (mx > 40 ? 0.2 : 0);
r += d[i] * wt; gg += d[i + 1] * wt; b += d[i + 2] * wt; w += wt;
}
if (alive && w) setCoverRgb(`${Math.round(r / w)},${Math.round(gg / w)},${Math.round(b / w)}`);
} catch (e) { /* image non lisible */ }
};
img.src = currentTrack.cover;
return () => { alive = false; };
}, [currentTrack, settings.dynamicColor]);
useEffect(() => {
const onErr = (e) => {
const t = e.target;
if (t && t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = '1'; t.src = 'Musique/Images/Bisounours.png'; }
};
window.addEventListener('error', onErr, true);
return () => window.removeEventListener('error', onErr, true);
}, []);
useEffect(() => {
if (!settings.wakeLock || !isPlaying || !('wakeLock' in navigator)) return undefined;
let lock = null; let cancelled = false;
const grab = () => navigator.wakeLock.request('screen').then((l) => { if (cancelled) l.release(); else lock = l; }).catch(() => {});
grab();
const vis = () => { if (document.visibilityState === 'visible' && (!lock || lock.released)) grab(); };
document.addEventListener('visibilitychange', vis);
return () => { cancelled = true; document.removeEventListener('visibilitychange', vis); if (lock) lock.release().catch(() => {}); };
}, [settings.wakeLock, isPlaying]);
useEffect(() => {
if (!settings.autoDownloadLikes || !off.ready || !off.online || !off.supported) return;
const todo = likedIds.map((id) => musicDatabase.find((t) => t.id === id)).filter((t) => t && !off.downloaded[t.id]);
if (todo.length) off.downloadMany(todo, { silent: true });
}, [settings.autoDownloadLikes, likedIds, off.ready, off.online]);
const wasDownloaded = !!(currentTrack && off.downloaded[currentTrack.id]);
useEffect(() => {
  if (!currentTrack || !wasDownloaded) return undefined;
  let alive = true; let made = null;
  getBlobUrl(currentTrack).then((u) => { if (!alive) { if (u) URL.revokeObjectURL(u); return; } made = u; setBlobSrc({ id: currentTrack.id, url: u || 'none' }); }).catch(() => { if (alive) setBlobSrc({ id: currentTrack.id, url: 'none' }); });
  return () => { alive = false; if (made) setTimeout(() => URL.revokeObjectURL(made), 1000); };
}, [currentTrack, wasDownloaded]);
const audioSrc = !currentTrack ? undefined : (wasDownloaded ? (blobSrc.id === currentTrack.id ? (blobSrc.url === 'none' ? currentTrack.audioUrl : blobSrc.url) : undefined) : currentTrack.audioUrl);
const loadAndPlay = useCallback((t) => {
wantPlayRef.current = true;
setAbLoop({ a: null, b: null });
pendingSeekRef.current = 0;
setCurrentTrack(t);
setIsPlaying(true);
setLastPlayTime(0);
addToHistory(t);
updateMediaSessionMetadata(t);
const audio = audioRef.current;
if (audio) {
audio.oncanplaythrough = null;
audio.pause();
audio.volume = isMuted ? 0 : volume;
audio.load();
audio.oncanplaythrough = () => { audio.play().catch(e => console.log('Erreur de lecture:', e)); };
}
}, [addToHistory, updateMediaSessionMetadata, isMuted, volume]);
const nextTrack = useCallback(() => {
if (currentQueue.length === 0) return;
const currentIndex = currentQueue.findIndex(track => track.id === currentTrack?.id);
let nextIndex;
if (isRepeatMode === 1) {
  nextIndex = (currentIndex + 1) % currentQueue.length;
} else {
  nextIndex = currentIndex + 1;
  if (nextIndex >= currentQueue.length) {
    if (isRepeatMode === 0) {
      // Fin de file : lecture automatique de titres similaires (désactivable dans les réglages)
      const rec = settings.autoplaySimilar && currentTrack ? getRecommendations(musicDatabase, currentTrack, 1)[0] : null;
      if (rec) {
        setCurrentQueue(q => [...q, rec]);
        loadAndPlay(rec);
        toast(`Lecture automatique : « ${rec.title} »`, '📻');
        return;
      }
      setIsPlaying(false);
      setCurrentTrack(null);
      setCurrentTime(0);
      return;
    }
    nextIndex = 0;
  }
}
for (let i = 0; i < currentQueue.length; i++) {
const cand = currentQueue[(nextIndex + i) % currentQueue.length];
if (cand && offRef.current.canPlay(cand)) { loadAndPlay(cand); return; }
}
toast('Aucun titre disponible hors-ligne dans la file', '📡'); setIsPlaying(false);
}, [currentQueue, currentTrack, isRepeatMode, settings.autoplaySimilar, getRecommendations, loadAndPlay, toast]);
const previousTrack = useCallback(() => {
if (currentQueue.length === 0) return;
if (audioRef.current && currentTime > 3) { audioRef.current.currentTime = 0; return; }
const currentIndex = currentQueue.findIndex(track => track.id === currentTrack?.id);
const prevIndex = currentIndex <= 0 ? currentQueue.length - 1 : currentIndex - 1;
for (let i = 0; i < currentQueue.length; i++) {
const cand = currentQueue[((prevIndex - i) % currentQueue.length + currentQueue.length) % currentQueue.length];
if (cand && offRef.current.canPlay(cand)) { loadAndPlay(cand); return; }
}
}, [currentQueue, currentTrack, currentTime, loadAndPlay]);
const playTrack = useCallback((track, playlist = null, opts = {}) => {
if (!offRef.current.canPlay(track)) { toast('Hors-ligne : télécharge ce titre pour l\'écouter sans internet', '📡'); return; }
const sourceList = playlist?.tracks || musicDatabase;
queueSourceRef.current = sourceList;
if (opts.keepOrder) {
setCurrentQueue(sourceList);
} else if (isShuffleMode) {
const shuffledList = shuffleArray(sourceList);
const trackIndex = shuffledList.findIndex(t => t.id === track.id);
if (trackIndex > 0) { shuffledList.splice(trackIndex, 1); shuffledList.unshift(track); }
setCurrentQueue(shuffledList);
} else {
setCurrentQueue(initializeQueue(track, sourceList));
}
loadAndPlay(track);
}, [isShuffleMode, shuffleArray, initializeQueue, loadAndPlay, toast]);

useEffect(() => {
  const audio = audioRef.current;
  if (audio) { audio.volume = (isMuted ? 0 : volume) * (isDucked ? settings.duckLevel : 1); }
  try { localStorage.setItem('spotizer-volume', volume.toString()); localStorage.setItem('spotizer-muted', isMuted ? '1' : '0'); } catch (e) {}
}, [volume, isMuted, isDucked, settings.duckLevel, currentTrack]);

useEffect(() => {
  const audio = audioRef.current;
  if (audio) { audio.defaultPlaybackRate = playbackRate; audio.playbackRate = playbackRate; }
  try { localStorage.setItem('spotizer-rate', String(playbackRate)); } catch (e) {}
}, [playbackRate, currentTrack]);

// Baisse automatique de la musique pendant un son du soundboard
useEffect(() => {
  if (!settings.ducking) { setIsDucked(false); return undefined; }
  const id = setInterval(() => {
    const active = [...document.querySelectorAll('audio.soundboard-audio')].some(a => !a.paused && !a.ended);
    setIsDucked(prev => (prev === active ? prev : active));
  }, 150);
  return () => clearInterval(id);
}, [settings.ducking]);

// Titre de l'onglet = titre en cours
useEffect(() => {
  const artist = currentTrack ? currentTrack.artist.trim() : '';
  document.title = currentTrack ? `${isPlaying ? '▶' : '⏸'} ${currentTrack.title} • ${artist}` : 'Spotizer';
}, [currentTrack, isPlaying]);

// Overlay OBS : diffusion du titre en cours
useEffect(() => {
  try { npChannel.current = new BroadcastChannel('spotizer-np'); } catch (e) { npChannel.current = null; }
  return () => { if (npChannel.current) npChannel.current.close(); npChannel.current = null; };
}, []);
useEffect(() => {
  const payload = currentTrack ? { title: currentTrack.title, artist: currentTrack.artist.trim(), cover: currentTrack.cover, isPlaying, duration: duration || 0 } : null;
  saveJSON('spotizer-now-playing', payload);
  try { if (npChannel.current) npChannel.current.postMessage({ type: 'np', payload: payload && { ...payload, currentTime: audioRef.current ? audioRef.current.currentTime : 0 } }); } catch (e) {}
}, [currentTrack, isPlaying, duration]);

// Sauvegarde de la session (reprise au rechargement)
stateRef.current = { currentTrack, currentQueue, isShuffleMode, isRepeatMode };
useEffect(() => {
  const persist = () => {
    const st = stateRef.current;
    try {
      if (!st.currentTrack) { localStorage.removeItem('spotizer-session'); return; }
      saveJSON('spotizer-session', {
        trackId: st.currentTrack.id,
        queueIds: st.currentQueue.map(t => t.id),
        shuffle: st.isShuffleMode,
        repeat: st.isRepeatMode,
        time: (audioRef.current && audioRef.current.currentTime) || pendingSeekRef.current || 0
      });
    } catch (e) {}
  };
  persist();
  const id = setInterval(persist, 4000);
  window.addEventListener('pagehide', persist);
  return () => { clearInterval(id); window.removeEventListener('pagehide', persist); };
}, [currentTrack, currentQueue, isShuffleMode, isRepeatMode]);

// Remonte en haut à chaque changement de page
useEffect(() => {
  if (pageContentRef.current && pageContentRef.current.scrollTo) pageContentRef.current.scrollTo({ top: 0 });
}, [currentPage, pageParam, selectedPlaylist]);

useEffect(() => {
  try { localStorage.setItem('deezer-playlists', JSON.stringify(playlists)); } catch (e) {}
}, [playlists]);useEffect(() => {
const audio = audioRef.current;
if (!audio) return;
const handleTimeUpdate = () => {
try { if ('mediaSession' in navigator && navigator.mediaSession.setPositionState && audio.duration && isFinite(audio.duration) && Math.floor(audio.currentTime) % 5 === 0) navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate || 1, position: Math.min(audio.currentTime, audio.duration) }); } catch (e) {}
const lp = abRef.current;
if (lp.a !== null && lp.b !== null && audio.currentTime >= lp.b) { audio.currentTime = lp.a; }
setCurrentTime(audio.currentTime);
try { if (npChannel.current) npChannel.current.postMessage({ type: 'time', currentTime: audio.currentTime, duration: audio.duration || 0 }); } catch (e) {}
const currentSec = Math.floor(audio.currentTime);
if (currentSec > 0 && currentSec % 10 === 0 && currentSec !== lastPlayTime) {
addListeningTime(10);
setLastPlayTime(currentSec);
}
};
const handleDurationChange = () => setDuration(audio.duration);
const handleEnded = () => {
setIsPlaying(false);
setCurrentTime(0);
if (stopAfterTrackRef.current) { stopAfterTrackRef.current = false; setStopAfterTrack(false); toast('Lecture arrêtée à la fin du titre', '⏹️'); return; }
if (isRepeatMode === 2) { audio.currentTime = 0; audio.play(); setIsPlaying(true); }else { nextTrack(); } };
audio.addEventListener('timeupdate', handleTimeUpdate);
audio.addEventListener('durationchange', handleDurationChange);
audio.addEventListener('ended', handleEnded);
return () => {
audio.removeEventListener('timeupdate', handleTimeUpdate);
audio.removeEventListener('durationchange', handleDurationChange);
audio.removeEventListener('ended', handleEnded);
};
}, [currentTrack, isRepeatMode, lastPlayTime, addListeningTime, nextTrack, toast]); const togglePlayPause = useCallback(() => {
if (!audioRef.current || !currentTrack) return;
try { if (settingsRef.current.haptics && navigator.vibrate) navigator.vibrate(8); } catch (e) {}
if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'; }else { audioRef.current.play().catch(e => console.log('Erreur de lecture:', e)); setIsPlaying(true); if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing'; }
}, [isPlaying, currentTrack]);const handleProgressClick = (e) => {
if (!audioRef.current || !duration) return;
const rect = e.currentTarget.getBoundingClientRect();
const clickX = e.clientX - rect.left;
const newTime = (clickX / rect.width) * duration;
audioRef.current.currentTime = newTime;
setCurrentTime(newTime);
};const formatTime = (time) => {
if (isNaN(time)) return '0:00';
const minutes = Math.floor(time / 60);
const seconds = Math.floor(time % 60);
return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};const toggleShuffle = useCallback(() => {
setIsShuffleMode(prev => {
const newMode = !prev;
if (currentQueue.length === 0 || !currentTrack) { return newMode; }
const currentIndex = currentQueue.findIndex(t => t.id === currentTrack.id);
if (currentIndex === -1) return newMode;
if (newMode) {
const upcoming = currentQueue.slice(currentIndex + 1);
const shuffledUpcoming = shuffleArray(upcoming);
const alreadyPlayed = currentQueue.slice(0, currentIndex + 1);
setCurrentQueue([...alreadyPlayed, ...shuffledUpcoming]);
} else {
const sourceList = queueSourceRef.current || selectedPlaylist?.tracks || musicDatabase;
const newQueue = initializeQueue(currentTrack, sourceList);
setCurrentQueue(newQueue);
}
return newMode;
});
}, [currentQueue, currentTrack, selectedPlaylist, shuffleArray, initializeQueue]);const toggleRepeat = useCallback(() => { setIsRepeatMode((prev) => (prev + 1) % 3); }, []);
const handleVolumeUp = useCallback(() => { setVolume(prev => Math.min(1, prev + 0.05)); }, []);
const handleVolumeDown = useCallback(() => { setVolume(prev => Math.max(0, prev - 0.05)); }, []);
const toggleMute = useCallback(() => { setIsMuted(prev => !prev); }, []);
const toggleQueue = useCallback(() => { setShowQueuePanel(prev => !prev); }, []);
const seekBy = useCallback((delta) => {
const a = audioRef.current;
if (!a || !currentTrack) return;
const t = Math.max(0, Math.min(a.duration || 0, a.currentTime + delta));
a.currentTime = t;
setCurrentTime(t);
}, [currentTrack]);
const seekTo = useCallback((t) => {
const a = audioRef.current;
if (!a || !Number.isFinite(t)) return;
a.currentTime = Math.max(0, t);
setCurrentTime(a.currentTime);
}, []);
const seekForward = useCallback(() => seekBy(10), [seekBy]);
const seekBack = useCallback(() => seekBy(-10), [seekBy]);
const stepRate = useCallback((dir) => {
const i = RATES.indexOf(playbackRate);
const next = RATES[Math.max(0, Math.min(RATES.length - 1, (i < 0 ? 2 : i) + dir))];
setPlaybackRate(next);
toast(`Vitesse de lecture : ${next}x`, '⏩');
}, [playbackRate, toast]);
const setRateTo = useCallback((r) => { setPlaybackRate(r); toast(`Vitesse de lecture : ${r}x`, '⏩'); }, [toast]);
const toggleAbLoop = useCallback(() => {
const audio = audioRef.current; if (!audio || !currentTrack) return;
const lp = abRef.current;
if (lp.a === null) { setAbLoop({ a: audio.currentTime, b: null }); toast('Boucle : point A posé', '🅰️'); }
else if (lp.b === null) { if (audio.currentTime - lp.a < 1) { toast('Point B trop proche de A', '⚠️'); return; } setAbLoop({ a: lp.a, b: audio.currentTime }); toast('Boucle A-B active', '🔁'); }
else { setAbLoop({ a: null, b: null }); toast('Boucle A-B désactivée', '⏹️'); }
}, [currentTrack, toast]);
const seekPercent = useCallback((p) => { const audio = audioRef.current; if (audio && audio.duration) { audio.currentTime = audio.duration * p; setCurrentTime(audio.currentTime); } }, []);
const cycleRate = useCallback(() => {
const next = RATES[(RATES.indexOf(playbackRate) + 1) % RATES.length];
setPlaybackRate(next);
toast(`Vitesse de lecture : ${next}x`, '⏩');
}, [playbackRate, toast]);
const likeTrack = useCallback((track) => {
if (!track) return;
const liked = isLiked(track.id);
toggleLike(track.id);
toast(liked ? `« ${track.title} » retiré des titres likés` : `« ${track.title} » ajouté aux titres likés`, liked ? '💔' : '💜');
}, [isLiked, toggleLike, toast]);
const toggleLikeCurrent = useCallback(() => likeTrack(currentTrack), [likeTrack, currentTrack]);
const copyForChat = useCallback(async (t) => {
const track = t || currentTrack;
if (!track) return;
const ok = await copyText(`🎵 ${track.title} – ${track.artist.trim()}`);
toast(ok ? 'Copié pour le chat !' : 'Copie impossible', ok ? '💬' : '⚠️');
}, [currentTrack, toast]);
const openArtist = useCallback((artist) => { setPageParam({ type: 'artist', value: artist }); setCurrentPage('collection'); setSelectedPlaylist(null); }, []);
const openGenre = useCallback((genre) => { setPageParam({ type: 'genre', value: genre }); setCurrentPage('collection'); setSelectedPlaylist(null); }, []);
const openMood = useCallback((id) => { setPageParam({ type: 'mood', value: id }); setCurrentPage('collection'); setSelectedPlaylist(null); }, []);
const openLiked = useCallback(() => { setCurrentPage('liked'); setSelectedPlaylist(null); }, []);
const openLibrary = useCallback(() => { setCurrentPage('library'); setSelectedPlaylist(null); }, []);
const playFrom = useCallback((track, list) => playTrack(track, list ? { tracks: list } : null), [playTrack]);
const playAllFrom = useCallback((list) => { if (list && list.length) playTrack(list[0], { tracks: list }); }, [playTrack]);
const playShuffled = useCallback((list) => {
if (!list || list.length === 0) return;
const shuffled = shuffleArray(list);
setIsShuffleMode(true);
playTrack(shuffled[0], { tracks: shuffled }, { keepOrder: true });
queueSourceRef.current = list;
}, [shuffleArray, playTrack]);
const playNext = useCallback((track) => {
if (!currentTrack) { playTrack(track); return; }
if (track.id === currentTrack.id) return;
setCurrentQueue(prev => {
const q = prev.filter(t => t.id !== track.id);
const at = q.findIndex(t => t.id === currentTrack.id);
q.splice(at + 1, 0, track);
return q;
});
toast(`« ${track.title} » sera lu ensuite`, '⏭️');
}, [currentTrack, playTrack, toast]);
const toggleStopAfterTrack = useCallback(() => {
const next = !stopAfterTrackRef.current;
stopAfterTrackRef.current = next;
setStopAfterTrack(next);
toast(next ? 'La lecture s\'arrêtera à la fin du titre' : 'Arrêt en fin de titre annulé', '⏹️');
}, [toast]);
// Échap : coupe tous les sons du soundboard (touche « panique ») et ferme les panneaux
const handleEscape = useCallback(() => {
const sounds = document.querySelectorAll('audio.soundboard-audio');
if (sounds.length) {
sounds.forEach(a => { a.pause(); a.dispatchEvent(new Event('ended')); if (a.parentNode) a.parentNode.removeChild(a); });
toast('Tous les sons sont coupés', '🔇');
}
setContextMenu(null);
setShowFullPlayer(false);
}, [toast]);
const focusSearch = useCallback(() => { if (searchInputRef.current) { searchInputRef.current.focus(); searchInputRef.current.select(); } }, []);
const openContextMenu = useCallback((e, track) => { setContextMenu({ x: e.clientX, y: e.clientY, track }); }, []);
const closeContextMenu = useCallback(() => setContextMenu(null), []);
const handlePageScroll = (e) => { const past = e.currentTarget.scrollTop > 600; setShowTop(prev => (prev === past ? prev : past)); };

// Touches média / écran de verrouillage
controlsRef.current = { togglePlayPause, nextTrack, previousTrack, seekBy, seekTo, isPlaying };
useEffect(() => {
if (!('mediaSession' in navigator)) return undefined;
const ms = navigator.mediaSession;
const set = (action, fn) => { try { ms.setActionHandler(action, fn); } catch (e) {} };
set('play', () => { const c = controlsRef.current; if (!c.isPlaying) c.togglePlayPause(); });
set('pause', () => { const c = controlsRef.current; if (c.isPlaying) c.togglePlayPause(); });
set('nexttrack', () => controlsRef.current.nextTrack());
set('previoustrack', () => controlsRef.current.previousTrack());
set('seekbackward', () => controlsRef.current.seekBy(-10));
set('seekforward', () => controlsRef.current.seekBy(10));
set('seekto', (d) => controlsRef.current.seekTo(d.seekTime));
return () => ['play', 'pause', 'nexttrack', 'previoustrack', 'seekbackward', 'seekforward', 'seekto'].forEach(a => set(a, null));
}, []);

  // Fonction pour jouer un son du soundboard via raccourci clavier
  const playSoundBoardSound = useCallback((index) => {
    const selectedBoard = soundBoards.find(b => b.id === selectedSoundBoardForShortcuts);
    
    if (selectedBoard && selectedBoard.sounds[index]) {
      const sound = selectedBoard.sounds[index];
      const audio = new Audio(sound.audioUrl);
      const savedVolume = localStorage.getItem('spotizer-sound-volume');
      audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
      audio.setAttribute('data-soundboard', 'true');
      audio.className = 'soundboard-audio';
      audio.style.display = 'none';
      document.body.appendChild(audio);
      
      audio.play().catch(err => console.log('Erreur lecture son:', err));
      
      audio.onended = () => {
        if (audio.parentNode) {
          audio.parentNode.removeChild(audio);
        }
      };
    }
  }, [soundBoards, selectedSoundBoardForShortcuts]);

  useKeyboardShortcuts({
    onPlayPause: togglePlayPause, 
    onNext: nextTrack, 
    onPrevious: previousTrack, 
    onVolumeUp: handleVolumeUp, 
    onVolumeDown: handleVolumeDown, 
    onMute: toggleMute, 
    onShuffle: toggleShuffle, 
    onRepeat: toggleRepeat, 
    onToggleQueue: toggleQueue,
    onPlaySoundBoardSound: playSoundBoardSound,
    onSeekForward: seekForward,
    onSeekBack: seekBack,
    onLike: toggleLikeCurrent,
    onFullscreen: () => setShowFullPlayer(v => !v),
    onFocusSearch: focusSearch,
    onEscape: handleEscape,
    onShowHelp: () => setShowShortcutsHelp(true),
    onSpeedUp: () => stepRate(1),
    onSpeedDown: () => stepRate(-1),
    onAbLoop: toggleAbLoop,
    onSeekPercent: seekPercent,
    isEnabled: true
  });

const getRepeatIcon = () => {
switch (isRepeatMode) { case 0: return '🔁'; case 1: return '🔁📋'; case 2: return '🔂🎵'; default: return '🔁'; }
};
const getRepeatTitle = () => {
switch (isRepeatMode) { case 0: return 'Répétition désactivée'; case 1: return 'Répéter toute la playlist'; case 2: return 'Répéter la chanson actuelle'; default: return 'Répétition désactivée'; }
};const handleSearch = (query) => {
setSearchQuery(query);
if (query.trim() && currentPage !== 'search') { setCurrentPage('search'); setSelectedPlaylist(null); }
};const createPlaylist = (name, description, cover) => {
const newPlaylist = { id: Date.now().toString(), name, description, cover: cover || "Musique/Images/favorite.png", tracks: [], isDefault: false };
setPlaylists([...playlists, newPlaylist]);
setShowCreatePlaylistModal(false);
toast(`Playlist « ${name} » créée`, '🎶');
};
const createPlaylistFromQueue = (name, description, tracks) => {
const newPlaylist = { id: Date.now().toString(), name, description, cover: tracks[0]?.cover || "Musique/Images/favorite.png", tracks: tracks, isDefault: false };
setPlaylists([...playlists, newPlaylist]);
toast(`File d'attente sauvegardée en « ${name} »`, '💾');
};
const deletePlaylist = (playlistId) => {
if (window.confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
setPlaylists(playlists.filter(p => p.id !== playlistId));
if (selectedPlaylist?.id === playlistId) { setSelectedPlaylist(null); }
setShowPlaylistOptionsModal(false);
}
};
const addTrackToPlaylist = (playlistId, track) => {
const targetPlaylist = playlists.find(p => p.id === playlistId);
if (targetPlaylist) {
const already = targetPlaylist.tracks.some(t => t.id === track.id);
toast(already ? `Déjà dans « ${targetPlaylist.name} »` : `Ajouté à « ${targetPlaylist.name} »`, already ? 'ℹ️' : '➕');
}
setPlaylists(playlists.map(playlist => {
if (playlist.id === playlistId) {
if (!playlist.tracks.find(t => t.id === track.id)) { return { ...playlist, tracks: [...playlist.tracks, track] }; }
}
return playlist;
}));
setShowAddToPlaylistModal(false);
setTrackToAdd(null);
};
const removeTrackFromPlaylist = (playlistId, trackId) => {
const updatedPlaylists = playlists.map(playlist => {
if (playlist.id === playlistId) { return { ...playlist, tracks: playlist.tracks.filter(t => t.id !== trackId) }; }
return playlist;
});
setPlaylists(updatedPlaylists);
if (selectedPlaylist?.id === playlistId) {
const updatedPlaylist = updatedPlaylists.find(p => p.id === playlistId);
setSelectedPlaylist(updatedPlaylist);
}
};
const openAddToPlaylistModal = (track) => { setTrackToAdd(track); setShowAddToPlaylistModal(true); };
const openPlaylistOptionsModal = (playlist) => { setPlaylistForOptions(playlist); setShowPlaylistOptionsModal(true); };
const handleEditPlaylist = (playlist) => { setPlaylistToEdit(playlist); setShowPlaylistEditModal(true); setShowPlaylistOptionsModal(false); };
const updatePlaylist = (updatedPlaylist) => {
const updatedPlaylists = playlists.map((p) => p.id === updatedPlaylist.id ? updatedPlaylist : p );
setPlaylists(updatedPlaylists);
if (selectedPlaylist?.id === updatedPlaylist.id) { setSelectedPlaylist(updatedPlaylist); }
setShowPlaylistEditModal(false);
};
const exportPlaylist = (playlist) => {
const dataStr = JSON.stringify(playlist, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = `${playlist.name.replace(/[^a-z0-9]/gi, '_')}.json`;
link.click();
URL.revokeObjectURL(url);
setShowPlaylistOptionsModal(false);
};
const importPlaylist = (importedPlaylist) => {
const newPlaylist = { ...importedPlaylist, id: Date.now().toString(), isDefault: false };
setPlaylists([...playlists, newPlaylist]);
toast(`Playlist « ${newPlaylist.name} » importée`, '📥');
};
const playPlaylist = (playlist) => {
if (playlist.tracks.length > 0) { setSelectedPlaylist(playlist); playTrack(playlist.tracks[0], playlist); }
};
const playPlaylistShuffle = (playlist) => {
if (playlist.tracks.length > 0) {
setSelectedPlaylist(playlist);
playShuffled(playlist.tracks);
}
};
const openPlaylist = (playlist) => { setCurrentPage('library'); setSelectedPlaylist(playlist); };
const handleQueueReorder = (sourceIndex, destinationIndex) => {
const currentIndex = currentQueue.findIndex(t => t.id === currentTrack?.id);
const actualSourceIndex = currentIndex + 1 + sourceIndex;
const actualDestIndex = currentIndex + 1 + destinationIndex;
const newQueue = [...currentQueue];
const [removed] = newQueue.splice(actualSourceIndex, 1);
newQueue.splice(actualDestIndex, 0, removed);
setCurrentQueue(newQueue);
};
const handleQueueRemove = (index) => {
const newQueue = [...currentQueue];
newQueue.splice(index, 1);
setCurrentQueue(newQueue);
};
const addToQueue = (track) => {
if (currentQueue.find(t => t.id === track.id)) { toast('Déjà dans la file d\'attente', 'ℹ️'); return; }
setCurrentQueue([...currentQueue, track]);
toast(`« ${track.title} » ajouté à la file d'attente`, '📋');
};
const duplicatePlaylist = (pl) => {
const copy = { ...pl, id: Date.now().toString(), name: `${pl.name} (copie)`, isDefault: false, tracks: [...pl.tracks] };
setPlaylists(prev => [...prev, copy]);
toast(`Playlist dupliquée : « ${copy.name} »`, '📑');
};
const clearPlaylist = (pl) => {
if (!window.confirm(`Vider la playlist « ${pl.name} » ?`)) return;
updatePlaylist({ ...pl, tracks: [] });
toast('Playlist vidée', '🧹');
};
const sortPlaylist = (pl, mode) => {
if (!mode) return;
let sorted = [...pl.tracks];
const cmp = (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' });
if (mode === 'title') sorted.sort((a, b) => cmp(a.title, b.title));
if (mode === 'artist') sorted.sort((a, b) => cmp(a.artist.trim(), b.artist.trim()));
if (mode === 'genre') sorted.sort((a, b) => cmp(a.genre || '', b.genre || ''));
if (mode === 'duration') sorted.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
if (mode === 'random') sorted = shuffleArray(pl.tracks);
updatePlaylist({ ...pl, tracks: sorted });
toast('Playlist triée', '↕️');
};
const ctxActions = {
play: (t) => playTrack(t),
playNext,
queue: addToQueue,
playlist: openAddToPlaylistModal,
like: likeTrack,
artist: (t) => openArtist(primaryArtist(t.artist)),
genre: (t) => openGenre(t.genre),
copy: copyForChat,
share: (t) => { const data = { title: t.title, text: `🎵 ${t.title} – ${t.artist}` }; if (navigator.share) navigator.share(data).catch(() => {}); else copyForChat(t); },
canShare: !!navigator.share,
download: (t) => (offRef.current.isDownloaded(t.id) ? offRef.current.remove(t) : offRef.current.download(t)),
isDownloaded: (t) => offRef.current.isDownloaded(t.id)
};
const clearQueue = () => {
if (currentTrack) { setCurrentQueue([currentTrack]); } else { setCurrentQueue([]); }
};
const handlePlaylistDragEnd = (result) => {
if (!result.destination || !selectedPlaylist) return;
const newTracks = [...selectedPlaylist.tracks];
const [removed] = newTracks.splice(result.source.index, 1);
newTracks.splice(result.destination.index, 0, removed);
const updatedPlaylist = { ...selectedPlaylist, tracks: newTracks };
updatePlaylist(updatedPlaylist);
};const themeStyle = {
'--theme-primary': currentTheme.primary, '--theme-secondary': currentTheme.secondary, '--theme-accent': currentTheme.accent, '--theme-gradient': currentTheme.gradient
};return (
<div className={`App ${isDarkMode ? 'dark' : 'light'}${settings.compact ? ' compact' : ''}${settings.reduceMotion ? ' reduce-motion' : ''}${settings.oled ? ' oled' : ''}${settings.dynamicColor ? ' dyn' : ''}`} style={{ ...themeStyle, '--cover-rgb': coverRgb }}>
{currentTrack && (
<audio
ref={audioRef}
src={audioSrc}
preload="metadata"
onCanPlay={(e) => { if (wantPlayRef.current) { wantPlayRef.current = false; e.target.play().catch(() => {}); } }}
onLoadedMetadata={(e) => { if (pendingSeekRef.current > 0) { try { e.target.currentTime = pendingSeekRef.current; setCurrentTime(pendingSeekRef.current); } catch (err) {} pendingSeekRef.current = 0; } }}
onError={() => { console.warn('Fichier audio introuvable ou illisible :', currentTrack.audioUrl); setIsPlaying(false); wantPlayRef.current = false; if (!offRef.current.online) toast('Hors-ligne : ce titre n\'est pas téléchargé', '📡'); }}
/>
)}<BottomNav page={currentPage} onNav={(id) => { setCurrentPage(id); setSelectedPlaylist(null); }} theme={currentTheme} offline={!off.online} />
{!off.online && <div className="offline-banner">📡 Hors-ligne — seuls les titres téléchargés sont lisibles</div>}<div className="main-layout">
{}
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
className={`nav-item ${currentPage === 'soundboard' ? 'active' : ''}`}
onClick={() => setCurrentPage('soundboard')}
style={currentPage === 'soundboard' ? { background: currentTheme.gradient } : {}}
>
<span>🎵</span>
<span>SoundBoard</span>
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
<button
className={`nav-item ${currentPage === 'blindtest' ? 'active' : ''}`}
onClick={() => setCurrentPage('blindtest')}
style={currentPage === 'blindtest' ? { background: currentTheme.gradient } : {}}
>
<span>🎯</span>
<span>Blind test</span>
</button>
<button
className={`nav-item ${currentPage === 'downloads' ? 'active' : ''}`}
onClick={() => setCurrentPage('downloads')}
style={currentPage === 'downloads' ? { background: currentTheme.gradient } : {}}
>
<span>⬇️</span>
<span>Téléchargements</span>
</button>
<button
className={`nav-item ${currentPage === 'liked' ? 'active' : ''}`}
onClick={openLiked}
style={currentPage === 'liked' ? { background: currentTheme.gradient } : {}}
>
<span>💜</span>
<span>Titres likés</span>
</button>
<button
className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
onClick={() => { setCurrentPage('settings'); setSelectedPlaylist(null); }}
style={currentPage === 'settings' ? { background: currentTheme.gradient } : {}}
>
<span>⚙️</span>
<span>Réglages</span>
</button>
</nav>
<div className="playlists-section">
{}
<div className="playlists-header">
<h3 className="playlists-title">Playlists Musique</h3>
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
e.target.src = "Musique/Images/Bisounours.png";
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
))}  {}
<div style={{ 
marginTop: '24px', 
paddingTop: '16px', 
borderTop: '1px solid rgba(255,255,255,0.2)' 
}}>
<div className="playlists-header">
<h3 className="playlists-title">SoundBoards</h3>
<button
className="add-playlist-btn"
onClick={() => setShowCreateSoundBoardModal(true)}
title="Créer une SoundBoard"
>
➕
</button>
</div>
{soundBoards.map(board => (
<div key={board.id} className="playlist-item-container">
<button
className={`playlist-item ${currentPage === 'soundboard' && selectedSoundBoard?.id === board.id ? 'active' : ''}`}
onClick={() => {
setCurrentPage('soundboard');
setSelectedSoundBoard(board);
}}
title="Ouvrir le SoundBoard"
style={currentPage === 'soundboard' && selectedSoundBoard?.id === board.id ? { background: currentTheme.gradient } : {}}
>
<img
src={board.cover}
alt={`Cover de ${board.name}`}
className="playlist-cover"
onError={(e) => {
e.target.onerror = null;
e.target.src = "SoundBoard/Images/default.png";
}}
/>
<div className="playlist-name">{board.name}</div>
<div className="playlist-tracks">{board.sounds.length} sons</div>
</button>
<button
className="playlist-options-btn"
onClick={() => openSoundBoardOptionsModal(board)}
title="Options du SoundBoard"
>
⋮
</button>
</div>
))}
</div>
</div>{}
<button 
className="shortcuts-help-btn"
onClick={() => setShowShortcutsHelp(true)}
title="Raccourcis clavier"
>
⌨️ Raccourcis
</button>
</div>{}
<div className="content-area">
{}
<div className="top-bar">
<div className="top-bar-content">
<div className="search-container">
<span className="search-icon">🔍</span>
<input
ref={searchInputRef}
type="text"
className="search-input"
placeholder="Rechercher des titres... (Ctrl+K)"
value={searchQuery}
onChange={(e) => handleSearch(e.target.value)}
onKeyDown={(e) => {
if (e.key === "Enter") {
setCurrentPage("search");
addRecentSearch(searchQuery);
}
}}
/>
{!searchQuery && (window.SpeechRecognition || window.webkitSpeechRecognition) && (
<button className="search-clear voice-btn" title="Recherche vocale" aria-label="Recherche vocale" onClick={() => {
try {
const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const rec = new SR(); rec.lang = 'fr-FR'; rec.interimResults = false;
toast('Je t\'écoute… dis un titre ou un artiste', '🎤');
rec.onresult = (ev) => { const txt = ev.results[0][0].transcript; handleSearch(txt); setCurrentPage('search'); addRecentSearch(txt); };
rec.onerror = () => toast('Micro indisponible ou refusé', '⚠️');
rec.start();
} catch (e) { toast('Recherche vocale non supportée', '⚠️'); }
}}>🎤</button>
)}
{searchQuery && (
<button className="search-clear" onClick={() => { setSearchQuery(''); if (searchInputRef.current) searchInputRef.current.focus(); }} aria-label="Effacer la recherche" title="Effacer">✕</button>
)}
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
</div>{}
<div className="page-content" ref={pageContentRef} onScroll={handlePageScroll}>
{currentPage === 'home' && (
<HomePage
musicDatabase={musicDatabase}
currentTrack={currentTrack}
isPlaying={isPlaying}
currentTheme={currentTheme}
onPlay={playFrom}
onPlayAll={playAllFrom}
onShuffleAll={playShuffled}
onAddToPlaylist={openAddToPlaylistModal}
onAddToQueue={addToQueue}
onContextMenu={openContextMenu}
onOpenArtist={openArtist}
onOpenMood={openMood}
onOpenGenre={openGenre}
onOpenLiked={openLiked}
onOpenLibrary={openLibrary}
/>
)}{currentPage === 'search' && (
<SearchPage
musicDatabase={musicDatabase}
query={searchQuery}
onQuery={handleSearch}
currentTrack={currentTrack}
isPlaying={isPlaying}
currentTheme={currentTheme}
onPlay={playFrom}
onShuffleAll={playShuffled}
onAddToPlaylist={openAddToPlaylistModal}
onAddToQueue={addToQueue}
onContextMenu={openContextMenu}
onOpenArtist={openArtist}
onOpenGenre={openGenre}
/>
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
<p className="playlist-stats">{selectedPlaylist.tracks.length} titres{selectedPlaylist.tracks.length > 0 ? ` • ${formatTotal(selectedPlaylist.tracks.reduce((sum, t) => sum + parseDuration(t.duration), 0))}` : ''}</p>
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
<button className="btn btn-secondary playlist-extra-btn" onClick={() => duplicatePlaylist(selectedPlaylist)} title="Dupliquer la playlist">📑 Dupliquer</button>
<button className="btn btn-secondary playlist-extra-btn" onClick={() => clearPlaylist(selectedPlaylist)} disabled={selectedPlaylist.tracks.length === 0} title="Vider la playlist">🧹 Vider</button>
<select className="form-input playlist-sort" value="" onChange={(e) => sortPlaylist(selectedPlaylist, e.target.value)} disabled={selectedPlaylist.tracks.length < 2} aria-label="Trier la playlist">
<option value="">↕️ Trier…</option>
<option value="title">Titre (A → Z)</option>
<option value="artist">Artiste (A → Z)</option>
<option value="genre">Genre</option>
<option value="duration">Durée</option>
<option value="random">Aléatoire</option>
</select>
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
<Droppable droppableId="playlist-tracks" >
{(provided) => (
<div 
className="track-list "
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
borderLeft: snapshot.isDragging ? `3px solid ${currentTheme.primary}` : 'none', background: currentTheme.gradient 
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
<img src={track.cover} alt={track.title} className="track-cover" loading="lazy" decoding="async" />
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
<img src={playlist.cover} alt={playlist.name} className="card-image" loading="lazy" decoding="async" /><button
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
<CollectionView
title="Toutes les musiques"
subtitle="Bibliothèque"
emoji="🎵"
tracks={musicDatabase}
showGenreChips
currentTrack={currentTrack}
isPlaying={isPlaying}
currentTheme={currentTheme}
onPlay={playFrom}
onPlayAll={playAllFrom}
onShuffleAll={playShuffled}
onAddToPlaylist={openAddToPlaylistModal}
onAddToQueue={addToQueue}
onContextMenu={openContextMenu}
onOpenArtist={openArtist}
onOpenGenre={openGenre}
/>
</div>
</div>
)}
</div>
)}{currentPage === 'collection' && collection && (
<div className="page-container">
<CollectionView
key={`${pageParam.type}-${pageParam.value}`}
title={collection.title}
subtitle={collection.subtitle}
emoji={collection.emoji}
tracks={collection.tracks}
showGenreChips={collection.showGenreChips}
currentTrack={currentTrack}
isPlaying={isPlaying}
currentTheme={currentTheme}
onPlay={playFrom}
onPlayAll={playAllFrom}
onShuffleAll={playShuffled}
onAddToPlaylist={openAddToPlaylistModal}
onAddToQueue={addToQueue}
onContextMenu={openContextMenu}
onOpenArtist={openArtist}
onOpenGenre={openGenre}
onBack={() => setCurrentPage('home')}
/>
</div>
)}{currentPage === 'liked' && (
<div className="page-container">
<CollectionView
title="Titres likés"
subtitle="Playlist"
emoji="💜"
tracks={likedTracks}
emptyMessage="Aucun titre liké pour le moment. Clique sur ♡ (ou appuie sur L) pour en ajouter !"
currentTrack={currentTrack}
isPlaying={isPlaying}
currentTheme={currentTheme}
onPlay={playFrom}
onPlayAll={playAllFrom}
onShuffleAll={playShuffled}
onAddToPlaylist={openAddToPlaylistModal}
onAddToQueue={addToQueue}
onContextMenu={openContextMenu}
onOpenArtist={openArtist}
onOpenGenre={openGenre}
/>
</div>
)}{currentPage === 'settings' && (
<SettingsPage onShowShortcuts={() => setShowShortcutsHelp(true)} />
)}{currentPage === 'stats' && (
<StatsPage 
musicDatabase={musicDatabase}
onPlayTrack={playTrack}
/>
)}{currentPage === 'blindtest' && (
<BlindTest musicDatabase={musicDatabase} currentTheme={currentTheme} onPausePlayer={() => { if (audioRef.current && !audioRef.current.paused) { audioRef.current.pause(); setIsPlaying(false); } }} />
)}{currentPage === 'downloads' && (
<DownloadsPage musicDatabase={musicDatabase} collectionProps={{
currentTrack, isPlaying, currentTheme,
onPlay: (t) => playTrack(t), onPlayAll: playAllFrom, onShuffleAll: playShuffled,
onAddToPlaylist: openAddToPlaylistModal, onAddToQueue: addToQueue, onContextMenu: openContextMenu, onOpenArtist: (a) => openArtist(primaryArtist(a)), onOpenGenre: openGenre
}} />
)}{currentPage === 'history' && (
<HistoryPage 
musicDatabase={musicDatabase}
onPlayTrack={playTrack}
onAddToPlaylist={openAddToPlaylistModal}
/>
)}
{currentPage === 'soundboard' && (
<SoundBoardPage 
soundDatabase={soundDatabase} 
selectedBoardFromSidebar={selectedSoundBoard}
onBoardChange={setSelectedSoundBoard}
/>
)}
</div>
</div>{}
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
</div>{}
{currentTrack && (
<div className={`music-player${settings.playerBackdrop ? ' has-backdrop' : ''}`} style={{ '--player-cover': `url("${currentTrack.cover}")` }}>
<div className="player-content">
<div className="player-track-info">
<img
src={currentTrack.cover}
alt={currentTrack.title}
className="player-cover clickable"
onClick={() => setShowFullPlayer(true)}
title="Ouvrir le lecteur plein écran (F)"
/>
<div className="player-track-details" onClick={() => setShowFullPlayer(true)} style={{ cursor: 'pointer' }}>
<div className={`player-track-title${currentTrack.title.length > 24 ? " marquee" : ""}`}><span>{currentTrack.title}</span></div>
<div className="player-track-artist">{currentTrack.artist}</div>
</div>
<HeartButton track={currentTrack} />
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
<div className="progress-bar"
onPointerDown={(e) => { if (!duration) return; const el = e.currentTarget; try { el.setPointerCapture(e.pointerId); } catch (err) {} el.dataset.drag = '1'; handleProgressClick(e); }}
onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); setScrubHover({ x: f * 100, t: f * (duration || 0) }); if (e.currentTarget.dataset.drag === '1') { const nt = f * duration; if (audioRef.current) audioRef.current.currentTime = nt; setCurrentTime(nt); } }}
onPointerUp={(e) => { e.currentTarget.dataset.drag = ''; }}
onPointerCancel={(e) => { e.currentTarget.dataset.drag = ''; }}
onPointerLeave={() => setScrubHover(null)}
onWheel={(e) => { e.preventDefault(); seekBy(e.deltaY < 0 ? 5 : -5); }}
>
{scrubHover && <span className="scrub-tip" style={{ left: `${scrubHover.x}%` }}>{formatTime(scrubHover.t)}</span>}
{abLoop.a !== null && duration > 0 && <span className="ab-mark" style={{ left: `${(abLoop.a / duration) * 100}%`, width: abLoop.b !== null ? `${((abLoop.b - abLoop.a) / duration) * 100}%` : '3px' }} />}
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
</div><div className="player-right-controls" onWheel={(e) => { if (e.deltaY < 0) handleVolumeUp(); else handleVolumeDown(); }}>
<button className="player-btn rate-btn" onClick={cycleRate} title="Vitesse de lecture ([ et ])">{playbackRate}x</button>
<div className="now-playing-indicator">
{isPlaying && <span className="playing-animation" style={{ color: currentTheme.primary }}>🎵</span>}
<div className="playback-mode">
{isShuffleMode && <span className="mode-indicator" style={{ color: currentTheme.primary }}>🔀</span>}
{isRepeatMode === 1 && <span className="mode-indicator" style={{ color: currentTheme.primary }}>🔁</span>}
{isRepeatMode === 2 && <span className="mode-indicator" style={{ color: currentTheme.primary }}>🔂</span>}
</div>
</div>
<button className="player-btn rate-btn" onClick={cycleRate} title="Vitesse de lecture">{playbackRate}x</button>
<button className="player-btn" onClick={() => copyForChat(currentTrack)} title="Copier « Titre – Artiste » pour le chat" aria-label="Copier pour le chat">💬</button>
<button className="player-btn" onClick={() => setShowFullPlayer(true)} title="Plein écran (F)" aria-label="Plein écran">⛶</button>
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
step="0.001"
value={isMuted ? 0 : volume}
onChange={(e) => setVolume(parseFloat(e.target.value))}
title={`Volume ${Math.round((isMuted ? 0 : volume) * 100)} % (↑/↓)`}
/>
<button className="close-btn" onClick={() => setCurrentTrack(null)}>✕</button>
</div>
</div>
</div>)}{}
{}
{showCreateSoundBoardModal && (
<CreateSoundBoardModal
onClose={() => setShowCreateSoundBoardModal(false)}
onCreate={(name, description, cover) => {
const newBoard = createSoundBoard(name, description, cover);
setShowCreateSoundBoardModal(false);
setCurrentPage('soundboard');
setSelectedSoundBoard(newBoard);
}}
onImport={(imported) => {
const newBoard = importSoundBoard(imported);
setShowCreateSoundBoardModal(false);
setCurrentPage('soundboard');
setSelectedSoundBoard(newBoard);
}}
/>
)}
{showSoundBoardOptionsModal && soundBoardForOptions && (
<SoundBoardOptionsModal
board={soundBoardForOptions}
onClose={() => {
setShowSoundBoardOptionsModal(false);
setSoundBoardForOptions(null);
}}
onDelete={handleDeleteSoundBoard}
onEdit={handleEditSoundBoard}
onExport={handleExportSoundBoard}
/>
)}{}
{showEditSoundBoardModal && soundBoardToEdit && (
<EditSoundBoardModal
board={soundBoardToEdit}
onClose={() => {
setShowEditSoundBoardModal(false);
setSoundBoardToEdit(null);
}}
onSave={handleUpdateSoundBoard}
/>
)}
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
onStopAfterTrack={toggleStopAfterTrack}
stopAfterTrackActive={stopAfterTrack}
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
{showFullPlayer && currentTrack && (
<NowPlayingFull
track={currentTrack}
isPlaying={isPlaying}
currentTime={currentTime}
duration={duration}
currentTheme={currentTheme}
isShuffle={isShuffleMode}
repeatMode={isRepeatMode}
playbackRate={playbackRate}
upcoming={currentQueue.slice(currentQueue.findIndex(t => t.id === currentTrack.id) + 1)}
onClose={() => setShowFullPlayer(false)}
onToggle={togglePlayPause}
onNext={nextTrack}
onPrev={previousTrack}
onSeek={seekTo}
onShuffle={toggleShuffle}
onRepeat={toggleRepeat}
onCycleRate={cycleRate}
rates={RATES}
onSetRate={setRateTo}
abLoop={abLoop}
onAbLoop={toggleAbLoop}
onCopy={copyForChat}
onOpenArtist={(a) => { setShowFullPlayer(false); openArtist(a); }}
/>
)}
<ContextMenu menu={contextMenu} onClose={closeContextMenu} actions={ctxActions} />
{showTop && (
<button className="back-to-top" onClick={() => pageContentRef.current && pageContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Remonter en haut" title="Remonter en haut">↑</button>
)}
</div>
);
}
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
};const EditSoundBoardModal = ({ board, onClose, onSave }) => {
const { isDarkMode, currentTheme } = useTheme();
const [name, setName] = useState(board.name || '');
const [description, setDescription] = useState(board.description || '');
const [cover, setCover] = useState(board.cover || '');  const handleSubmit = (e) => {
e.preventDefault();
if (!name.trim()) {
alert("Le nom du SoundBoard est obligatoire !");
return;
}
onSave({ 
...board, 
name: name.trim(), 
description: description.trim(), 
cover: cover.trim() || board.cover 
});
};  return (
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
const HistoryPage = ({ musicDatabase, onPlayTrack, onAddToPlaylist }) => {
const { isDarkMode, currentTheme } = useTheme();
const { listeningHistory, playStats, clearHistory: clearAllHistory } = useMusic();
const { toast: toastMsg } = useToast();return (
<div className={`page-container ${isDarkMode ? 'dark' : 'light'}`}>
<h1 className="page-title">📜 Historique d'écoute</h1>
<p className="page-subtitle">Vos 50 dernières musiques écoutées</p>{listeningHistory.length > 0 && (
<button className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => { if (window.confirm("Effacer tout l'historique d'écoute ?")) { clearAllHistory(); toastMsg("Historique effacé", "🧹"); } }}>🧹 Effacer l'historique</button>
)}{listeningHistory.length === 0 ? (
<div className="empty-state">
<p>Aucune musique écoutée pour le moment.</p>
<p>Commencez à écouter de la musique pour voir votre historique !</p>
</div>
) : (
<div className="history-full-list">
{listeningHistory.map((entry, index) => (
<div 
key={entry.playId} 
className="track-item history-track-item " 
onClick={() => onPlayTrack(entry)}
style={{ background: currentTheme.gradient }}
>
<div className="track-number" >{index + 1}</div>
<img src={entry.cover} alt={entry.title} className="track-cover" loading="lazy" decoding="async" />
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
<div className="play-count-badge">
{playStats[entry.id] || 1}x
</div>
<HeartButton track={entry} />
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
<ToastProvider>
<LibraryProvider>
<MusicProvider>
<OfflineProvider tracks={musicDatabase}>
<SoundBoardProvider>
<AppContent />
</SoundBoardProvider>
</OfflineProvider>
</MusicProvider>
</LibraryProvider>
</ToastProvider>
</ThemeProvider>
);
}export default App;