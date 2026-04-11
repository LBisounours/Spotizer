// /src/App.js
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
import { SoundBoardProvider } from './contexts/SoundBoardContext';
import SoundBoardPage from './components/SoundBoardPage';
import { useSoundBoard } from './contexts/SoundBoardContext';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
const musicDatabase = [
{ id: 1, title: "Un quart d'heure", artist: "Satine", album: "Le_Bisounours_", duration: "2:36", cover: "Musique/Images/font1.png", audioUrl: "Musique/Musique1.mp3", genre: "Pop" },
{ id: 2, title: "Côte Ouest", artist: "47Ter", album: "Le_Bisounours_", duration: "3:51", cover: "Musique/Images/font2.png", audioUrl: "Musique/Musique2.mp3", genre: "Rap" },
{ id: 3, title: "Harakiri", artist: "47Ter", album: "Le_Bisounours_", duration: "3:01", cover: "Musique/Images/font3.png", audioUrl: "Musique/Musique3.mp3", genre: "Rap" },
{ id: 7, title: "Un air qui fait", artist: "47Ter", album: "Le_Bisounours_", duration: "3:46", cover: "Musique/Images/font7.png", audioUrl: "Musique/Musique7.mp3", genre: "Rap" },
{ id: 12, title: "Chaque soir", artist: "47Ter", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font12.png", audioUrl: "Musique/Musique12.mp3", genre: "Rap" },
{ id: 32, title: "30", artist: "47Ter", album: "Le_Bisounours_", duration: "3:32", cover: "Musique/Images/font32.png", audioUrl: "Musique/Musique32.mp3", genre: "Rap" },
{ id: 4, title: "Bloody Stream", artist: "JoJo's Bizarre Adventure", album: "Le_Bisounours_", duration: "4:21", cover: "Musique/Images/font4.png", audioUrl: "Musique/Musique4.mp3", genre: "Opening" }, 
{ id: 6, title: "Black Betty", artist: "Ram Jam", album: "Le_Bisounours_", duration: "2:24", cover: "Musique/Images/font6.png", audioUrl: "Musique/Musique6.mp3", genre: "Rock" },
{ id: 9, title: "Wellerman (Sea Shanty)", artist: "Nathan Evans", album: "Le_Bisounours_", duration: "2:35", cover: "Musique/Images/font9.png", audioUrl: "Musique/Musique9.mp3", genre: "Folk" },
{ id: 10, title: "I Can't Fit In", artist: "Marino", album: "Le_Bisounours_", duration: "2:09", cover: "Musique/Images/font10.png", audioUrl: "Musique/Musique10.mp3", genre: "Pop Indé" },
{ id: 65, title: "I'm Doing Fine", artist: "Marino", album: "Le_Bisounours_", duration: "1:39", cover: "Musique/Images/font65.png", audioUrl: "Musique/Musique65.mp3", genre: "Pop Indé" },
{ id: 13, title: "Sur tes pas", artist: "Wakfu", album: "Le_Bisounours_", duration: "4:01", cover: "Musique/Images/font13.png", audioUrl: "Musique/Musique13.mp3", genre: "Soundtrack" }, 
{ id: 14, title: "Fairytale", artist: "Alexander Rybak", album: "Le_Bisounours_", duration: "3:02", cover: "Musique/Images/font14.png", audioUrl: "Musique/Musique14.mp3", genre: "Pop" },
{ id: 15, title: "Malade", artist: "Roméo Elvis", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font15.png", audioUrl: "Musique/Musique15.mp3", genre: "Rap" }, 
{ id: 16, title: "Bling-Bang-Bang-Born", artist: "Mashle", album: "Le_Bisounours_", duration: "2:48", cover: "Musique/Images/font16.png", audioUrl: "Musique/Musique16.mp3", genre: "Opening" }, 
{ id: 17, title: "Body Talks", artist: "The Struts", album: "Le_Bisounours_", duration: "3:00", cover: "Musique/Images/font17.png", audioUrl: "Musique/Musique17.mp3", genre: "Rock" },
{ id: 18, title: "Colors By Flow", artist: "Code Geass", album: "Le_Bisounours_", duration: "3:38", cover: "Musique/Images/font18.png", audioUrl: "Musique/Musique18.mp3", genre: "Opening" }, 
{ id: 19, title: "Dans l'univers", artist: "Nekfeu", album: "Le_Bisounours_", duration: "4:06", cover: "Musique/Images/font19.png", audioUrl: "Musique/Musique19.mp3", genre: "Rap" },
{ id: 38, title: "Astronaute", artist: "Nekfeu", album: "Le_Bisounours_", duration: "6:58", cover: "Musique/Images/font38.png", audioUrl: "Musique/Musique38.mp3", genre: "Rap" },
{ id: 20, title: "Poupée Russe", artist: "Lujipeka", album: "Le_Bisounours_", duration: "2:44", cover: "Musique/Images/font20.png", audioUrl: "Musique/Musique20.mp3", genre: "Rap" }, 
{ id: 21, title: "À peu près", artist: "Lomepal", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font21.png", audioUrl: "Musique/Musique21.mp3", genre: "Rap" },
{ id: 37, title: "Decrescendo", artist: "Lomepal", album: "Le_Bisounours_", duration: "3:41", cover: "Musique/Images/font37.png", audioUrl: "Musique/Musique37.mp3", genre: "Rap" },
{ id: 33, title: "Trop beau", artist: "Lomepal", album: "Le_Bisounours_", duration: "4:04", cover: "Musique/Images/font33.png", audioUrl: "Musique/Musique33.mp3", genre: "Rap" },
{ id: 48, title: "Évidemment", artist: "Lomepal", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font48.png", audioUrl: "Musique/Musique48.mp3", genre: "Rap" },
{ id: 8, title: "1000°C", artist: "Lomepal ft. Roméo Elvis", album: "Le_Bisounours_", duration: "4:41", cover: "Musique/Images/font8.png", audioUrl: "Musique/Musique8.mp3", genre: "Rap" },
{ id: 26, title: "Flicker", artist: "Andora", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font26.png", audioUrl: "Musique/Musique26.mp3", genre: "Electro" },
{ id: 22, title: "Toutes les machines ont un coeur", artist: "Maëlle", album: "Le_Bisounours_", duration: "4:19", cover: "Musique/Images/font22.png", audioUrl: "Musique/Musique22.mp3", genre: "Pop" },
{ id: 24, title: "Empires", artist: "The Electric Swing Circus", album: "Le_Bisounours_", duration: "3:10", cover: "Musique/Images/font24.png", audioUrl: "Musique/Musique24.mp3", genre: "Electro Swing" }, 
{ id: 25, title: "Toxic", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "2:50", cover: "Musique/Images/font25.png", audioUrl: "Musique/Musique25.mp3", genre: "Bedroom Pop" }, 
{ id: 59, title: "IDGAF", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "2:26", cover: "Musique/Images/font59.png", audioUrl: "Musique/Musique59.mp3", genre: "Bedroom Pop" },
{ id: 82, title: "Problematic", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "3:33", cover: "Musique/Images/font82.png", audioUrl: "Musique/Musique82.mp3", genre: "Bedroom Pop" },
{ id: 84, title: "Rockstar", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "4:32", cover: "Musique/Images/font84.png", audioUrl: "Musique/Musique84.mp3", genre: "Bedroom Pop" },
{ id: 88, title: "Two moons", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "3:56", cover: "Musique/Images/font88.png", audioUrl: "Musique/Musique88.mp3", genre: "Bedroom Pop" },
{ id: 89, title: "Understand", artist: "BoyWithUke", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font89.png", audioUrl: "Musique/Musique89.mp3", genre: "Bedroom Pop" },
{ id: 23, title: "Épisode III - Les mains libres", artist: "Yuzmv", album: "Le_Bisounours_", duration: "3:40", cover: "Musique/Images/font23.png", audioUrl: "Musique/Musique23.mp3", genre: "Rap" },
{ id: 27, title: "Black Catcher", artist: "Black Clover", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font27.png", audioUrl: "Musique/Musique27.mp3", genre: "Opening" },
{ id: 28, title: "Femme à la mer", artist: "Hoshi", album: "Le_Bisounours_", duration: "3:59", cover: "Musique/Images/font28.png", audioUrl: "Musique/Musique28.mp3", genre: "Pop" },
{ id: 29, title: "Chute d'étoiles", artist: "Suzuya", album: "Le_Bisounours_", duration: "2:12", cover: "Musique/Images/font29.png", audioUrl: "Musique/Musique29.mp3", genre: "Rap" },
{ id: 53, title: "Actrice Fantôme", artist: "Suzuya", album: "Le_Bisounours_", duration: "2:52", cover: "Musique/Images/font53.png", audioUrl: "Musique/Musique53.mp3", genre: "Rap" },
{ id: 30, title: "Dis-moi que tu me détestes.", artist: "Suzuya", album: "Le_Bisounours_", duration: "2:05", cover: "Musique/Images/font30.png", audioUrl: "Musique/Musique30.mp3", genre: "Rap" },
{ id: 31, title: "Sundance", artist: "Népal", album: "Le_Bisounours_", duration: "2:50", cover: "Musique/Images/font31.png", audioUrl: "Musique/Musique31.mp3", genre: "Rap" }, 
{ id: 34, title: "La Quête", artist: "Orelsan", album: "Le_Bisounours_", duration: "3:54", cover: "Musique/Images/font34.png", audioUrl: "Musique/Musique34.mp3", genre: "Rap" },
{ id: 35, title: "Déprime", artist: "Mastu", album: "Le_Bisounours_", duration: "3:19", cover: "Musique/Images/font35.png", audioUrl: "Musique/Musique35.mp3", genre: "Pop" }, 
{ id: 36, title: "Tchin Tchin", artist: "2TH", album: "Le_Bisounours_", duration: "2:36", cover: "Musique/Images/font36.png", audioUrl: "Musique/Musique36.mp3", genre: "Rap" }, 
{ id: 40, title: "Hit Sale", artist: "Therapie Taxi ft. Roméo Elvis", album: "Le_Bisounours_", duration: "3:19", cover: "Musique/Images/font40.png", audioUrl: "Musique/Musique40.mp3", genre: "Pop Rock" }, 
{ id: 41, title: "Pierre, feuille, papier, ciseaux", artist: "Columbine", album: "Le_Bisounours_", duration: "3:45", cover: "Musique/Images/font41.png", audioUrl: "Musique/Musique41.mp3", genre: "Rap" },
{ id: 11, title: "C'est pas grave", artist: "Columbine ", album: "Le_Bisounours_", duration: "2:41", cover: "Musique/Images/font11.png", audioUrl: "Musique/Musique11.mp3", genre: "Rap" },
{ id: 49, title: "House of Memories", artist: "Panic! At The Disco", album: "Le_Bisounours_", duration: "3:29", cover: "Musique/Images/font49.png", audioUrl: "Musique/Musique49.mp3", genre: "Alternative Rock" },
{ id: 42, title: "THE LONELIEST", artist: "Måneskin", album: "Le_Bisounours_", duration: "4:47", cover: "Musique/Images/font42.png", audioUrl: "Musique/Musique42.mp3", genre: "Rock" },
{ id: 46, title: "I WANNA BE YOUR SLAVE", artist: "Måneskin", album: "Le_Bisounours_", duration: "2:52", cover: "Musique/Images/font46.png", audioUrl: "Musique/Musique46.mp3", genre: "Rock" },
{ id: 43, title: "Daylight", artist: "David Kushner", album: "Le_Bisounours_", duration: "3:49", cover: "Musique/Images/font43.png", audioUrl: "Musique/Musique43.mp3", genre: "Pop" },
{ id: 47, title: "Riptide", artist: "Vance Joy", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font47.png", audioUrl: "Musique/Musique47.mp3", genre: "Indie Folk" },
{ id: 50, title: "Heathens", artist: "Twenty One Pilots", album: "Le_Bisounours_", duration: "3:14", cover: "Musique/Images/font50.png", audioUrl: "Musique/Musique50.mp3", genre: "Alternative" },
{ id: 52, title: "Stressed Out", artist: "Twenty One Pilots", album: "Le_Bisounours_", duration: "3:22", cover: "Musique/Images/font52.png", audioUrl: "Musique/Musique52.mp3", genre: "Alternative" },
{ id: 51, title: "Mockingbird", artist: "Eminem", album: "Le_Bisounours_", duration: "4:17", cover: "Musique/Images/font51.png", audioUrl: "Musique/Musique51.mp3", genre: "Rap" },
{ id: 54, title: "Gangsta's Paradise", artist: "Coolio ft. L.V.", album: "Le_Bisounours_", duration: "4:01", cover: "Musique/Images/font54.png", audioUrl: "Musique/Musique54.mp3", genre: "Rap" },
{ id: 55, title: "Stolen Dance", artist: "Milky Chance", album: "Le_Bisounours_", duration: "5:13", cover: "Musique/Images/font55.png", audioUrl: "Musique/Musique55.mp3", genre: "Indie Folk" }, 
{ id: 56, title: "Feed the Machine", artist: "Poor Man's Poison", album: "Le_Bisounours_", duration: "3:03", cover: "Musique/Images/font56.png", audioUrl: "Musique/Musique56.mp3", genre: "Folk" },
{ id: 67, title: "Give and Take", artist: "Poor Man's Poison", album: "Le_Bisounours_", duration: "3:17", cover: "Musique/Images/font67.png", audioUrl: "Musique/Musique67.mp3", genre: "Folk" },
{ id: 57, title: "Le stade", artist: "Fredz", album: "Le_Bisounours_", duration: "2:35", cover: "Musique/Images/font57.png", audioUrl: "Musique/Musique57.mp3", genre: "Rap" }, 
{ id: 58, title: "Help me", artist: "Or3o", album: "Le_Bisounours_", duration: "4:20", cover: "Musique/Images/font58.png", audioUrl: "Musique/Musique58.mp3", genre: "Indie Pop" },
{ id: 63, title: "God-Ish", artist: "PinocchioP", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font63.png", audioUrl: "Musique/Musique63.mp3", genre: "J-Pop" },
{ id: 60, title: "Ma Meilleure Ennemie", artist: "Stomae & Pomme", album: "Le_Bisounours_", duration: "2:28", cover: "Musique/Images/font60.png", audioUrl: "Musique/Musique60.mp3", genre: "Pop Indé" },
{ id: 44, title: "Ceux qui rêvent", artist: "Pomme", album: "Le_Bisounours_", duration: "1:58", cover: "Musique/Images/font44.png", audioUrl: "Musique/Musique44.mp3", genre: "Pop Indé" },
{ id: 61, title: "Roi", artist: "Videoclub", album: "Le_Bisounours_", duration: "3:49", cover: "Musique/Images/font61.png", audioUrl: "Musique/Musique61.mp3", genre: "Pop Indé" }, 
{ id: 62, title: "Futur", artist: "DYES IWASAKI", album: "Le_Bisounours_", duration: "3:22", cover: "Musique/Images/font62.png", audioUrl: "Musique/Musique62.mp3", genre: "Electro Swing" },
{ id: 5, title: "Bad Hatter", artist: "DYES IWASAKI", album: "Le_Bisounours_", duration: "2:57", cover: "Musique/Images/font5.png", audioUrl: "Musique/Musique5.mp3", genre: "Electro Swing" },
{ id: 64, title: "Golden Hour", artist: "JVKE", album: "Le_Bisounours_", duration: "3:51", cover: "Musique/Images/font64.png", audioUrl: "Musique/Musique64.mp3", genre: "Pop" },
{ id: 66, title: "Feel Good Inc.", artist: "Gorillaz", album: "Le_Bisounours_", duration: "4:13", cover: "Musique/Images/font66.png", audioUrl: "Musique/Musique66.mp3", genre: "Alternative" },
{ id: 68, title: "Je ne pense qu'à ça", artist: "Lenaïg", album: "Le_Bisounours_", duration: "2:34", cover: "Musique/Images/font68.png", audioUrl: "Musique/Musique68.mp3", genre: "Pop" },
{ id: 69, title: "Crush", artist: "Nuit Incolore", album: "Le_Bisounours_", duration: "3:12", cover: "Musique/Images/font69.png", audioUrl: "Musique/Musique69.mp3", genre: "Pop" },
{ id: 39, title: "Dépassé", artist: "Nuit Incolore", album: "Le_Bisounours_", duration: "2:52", cover: "Musique/Images/font39.png", audioUrl: "Musique/Musique39.mp3", genre: "Pop" },
{ id: 70, title: "Radioactive", artist: "Imagine Dragons", album: "Le_Bisounours_", duration: "3:05", cover: "Musique/Images/font70.png", audioUrl: "Musique/Musique70.mp3", genre: "Alternative Rock" },
{ id: 45, title: "Sharks", artist: "Imagine Dragons", album: "Le_Bisounours_", duration: "3:36", cover: "Musique/Images/font45.png", audioUrl: "Musique/Musique45.mp3", genre: "Alternative Rock" },
{ id: 71, title: "Mood", artist: "24kGoldn", album: "Le_Bisounours_", duration: "2:30", cover: "Musique/Images/font71.png", audioUrl: "Musique/Musique71.mp3", genre: "Pop Rap" }, 
{ id: 72, title: "Vampire", artist: "Tsew The Kid", album: "Le_Bisounours_", duration: "2:17", cover: "Musique/Images/font72.png", audioUrl: "Musique/Musique72.mp3", genre: "Rap" }, 
{ id: 73, title: "Anxiety", artist: "Doechii", album: "Le_Bisounours_", duration: "4:09", cover: "Musique/Images/font73.png", audioUrl: "Musique/Musique73.mp3", genre: "Rap" }, 
{ id: 74, title: "Handclap", artist: "Fitz and The Tantrums", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font74.png", audioUrl: "Musique/Musique74.mp3", genre: "Soul-Pop" },
{ id: 75, title: "Hardware Store", artist: "Weird Al Yankovic", album: "Le_Bisounours_", duration: "3:44", cover: "Musique/Images/font75.png", audioUrl: "Musique/Musique75.mp3", genre: "Comedy" },
{ id: 76, title: "Hit The Road Jack", artist: "Ray Charles", album: "Le_Bisounours_", duration: "2:02", cover: "Musique/Images/font76.png", audioUrl: "Musique/Musique76.mp3", genre: "R&B" }, 
{ id: 77, title: "I Wanna Be Like You", artist: "Sid Bader", album: "Le_Bisounours_", duration: "2:01", cover: "Musique/Images/font77.png", audioUrl: "Musique/Musique77.mp3", genre: "Electro Swing" }, 
{ id: 78, title: "Light up the night", artist: "Jamie Berry & Octavia Rose", album: "Le_Bisounours_", duration: "3:53", cover: "Musique/Images/font78.png", audioUrl: "Musique/Musique78.mp3", genre: "Electro Swing" }, 
{ id: 79, title: "No Strings Attached", artist: "Swingrowers", album: "Le_Bisounours_", duration: "4:07", cover: "Musique/Images/font79.png", audioUrl: "Musique/Musique79.mp3", genre: "Electro Swing" }, 
{ id: 80, title: "Overwhelmed", artist: "Royal & the Serpent", album: "Le_Bisounours_", duration: "3:26", cover: "Musique/Images/font80.png", audioUrl: "Musique/Musique80.mp3", genre: "Alternative" },
{ id: 81, title: "Party like it's 1920", artist: "The Swinghoppers & Wolfgang Lohr", album: "Le_Bisounours_", duration: "3:05", cover: "Musique/Images/font81.png", audioUrl: "Musique/Musique81.mp3", genre: "Electro Swing" }, 
{ id: 83, title: "Reflection", artist: "Christina Aguilera", album: "Le_Bisounours_", duration: "3:19", cover: "Musique/Images/font83.png", audioUrl: "Musique/Musique83.mp3", genre: "Pop" },
{ id: 85, title: "Star Walkin", artist: "Lil Nas X", album: "Le_Bisounours_", duration: "3:27", cover: "Musique/Images/font85.png", audioUrl: "Musique/Musique85.mp3", genre: "Pop Rap" },
{ id: 86, title: "Shiawase no Monosashi", artist: "Vantage", album: "Le_Bisounours_", duration: "5:00", cover: "Musique/Images/font86.png", audioUrl: "Musique/Musique86.mp3", genre: "Future Funk" }, 
{ id: 87, title: "Sweater weather", artist: "The Neighbourhood", album: "Le_Bisounours_", duration: "3:57", cover: "Musique/Images/font87.png", audioUrl: "Musique/Musique87.mp3", genre: "Alternative" },
{ id: 90, title: "Up & Down", artist: "EXGF", album: "Le_Bisounours_", duration: "2:44", cover: "Musique/Images/font90.png", audioUrl: "Musique/Musique90.mp3", genre: "Electro Pop" }, 
{ id: 91, title: "Usseewa", artist: "Ado", album: "Le_Bisounours_", duration: "3:24", cover: "Musique/Images/font91.png", audioUrl: "Musique/Musique91.mp3", genre: "J-Pop" },
{ id: 92, title: "Wild side", artist: "Beastars", album: "Le_Bisounours_", duration: "2:38", cover: "Musique/Images/font92.png", audioUrl: "Musique/Musique92.mp3", genre: "Opening" }, 
{ id: 93, title: "World's smallest violin", artist: "AJR", album: "Le_Bisounours_", duration: "3:07", cover: "Musique/Images/font93.png", audioUrl: "Musique/Musique93.mp3", genre: "Alternative Pop" }, 
{ id: 94, title: "Veil", artist: "Fire Force", album: "Le_Bisounours_", duration: "3:28", cover: "Musique/Images/font94.png", audioUrl: "Musique/Musique94.mp3", genre: "Opening" }, 
{ id: 95, title: "Star shopping", artist: "Lil Peep", album: "Le_Bisounours_", duration: "2:22", cover: "Musique/Images/font95.png", audioUrl: "Musique/Musique95.mp3", genre: "Emo Rap" },
{ id: 96, title: "Lumière", artist: "Clair Obscur: Expédition 33", album: "Le_Bisounours_", duration: "3:42", cover: "Musique/Images/font96.png", audioUrl: "Musique/Musique96.mp3", genre: "Jeux" },
{ id: 97, title: "Attrape les tous", artist: "Tresko", album: "Le_Bisounours_", duration: "2:00", cover: "Musique/Images/font97.png", audioUrl: "Musique/Musique97.mp3", genre: "IA" },
{ id: 98, title: "L'inquisiteur redouté", artist: "Tresko", album: "Le_Bisounours_", duration: "3:16", cover: "Musique/Images/font98.png", audioUrl: "Musique/Musique98.mp3", genre: "IA" },
{ id: 99, title: "Nuit d'épouvante", artist: "Tresko", album: "Le_Bisounours_", duration: "2:28", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique99.mp3", genre: "IA" },
{ id: 100, title: "Galaxie Lointaine", artist: "Tresko", album: "Le_Bisounours_", duration: "2:00", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique101.mp3", genre: "IA" },
{ id: 101, title: "Tyron des Bloods", artist: "Tresko", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique102.mp3", genre: "IA" },
{ id: 102, title: "C'est nous les bloods", artist: "Bisounours", album: "Le_Bisounours_", duration: "2:21", cover: "Musique/Images/font100.png", audioUrl: "Musique/Musique100.mp3", genre: "IA" },
{ id: 103, title: "Sad of Bisounours", artist: "Bisounours", album: "Le_Bisounours_", duration: "3:10", cover: "Musique/Images/font103.png", audioUrl: "Musique/Musique103.mp3", genre: "IA" },
{ id: 104, title: "Devil Bisounours", artist: "Bisounours", album: "Le_Bisounours_", duration: "2:43", cover: "Musique/Images/font104.png", audioUrl: "Musique/Musique104.mp3", genre: "IA" },
{ id: 105, title: "The Stars Cousins", artist: "Bisounours", album: "Le_Bisounours_", duration: "2:28", cover: "Musique/Images/font105.png", audioUrl: "Musique/Musique105.mp3", genre: "IA" },
{ id: 106, title: "Takedown", artist: "Kpop Demon Hunter", album: "Le_Bisounours_", duration: "3:01", cover: "Musique/Images/font106.png", audioUrl: "Musique/Musique106.mp3", genre: "Film" },
{ id: 107, title: "Golden", artist: "Kpop Demon Hunter", album: "Le_Bisounours_", duration: "3:18", cover: "Musique/Images/font106.png", audioUrl: "Musique/Musique107.mp3", genre: "Film" },
{ id: 108, title: "Your Idol", artist: "Kpop Demon Hunter", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font106.png", audioUrl: "Musique/Musique108.mp3", genre: "Film" },
{ id: 109, title: "Réplique Culte", artist: "French Fuse", album: "Le_Bisounours_", duration: "3:16", cover: "Musique/Images/font109.png", audioUrl: "Musique/Musique109.mp3", genre: "Remix" },
{ id: 110, title: "Harry Potter", artist: "French Fuse", album: "Le_Bisounours_", duration: "3:41", cover: "Musique/Images/font109.png", audioUrl: "Musique/Musique110.mp3", genre: "Remix" },
{ id: 114, title: "La Chanson des manifs", artist: "French Fuse", album: "Le_Bisounours_", duration: "3:23", cover: "Musique/Images/font109.png", audioUrl: "Musique/Musique114.mp3", genre: "Remix" },
{ id: 111, title: "On se Moque", artist: "Molière le spectacle Musical", album: "Le_Bisounours_", duration: "2:47", cover: "Musique/Images/font111.png", audioUrl: "Musique/Musique111.mp3", genre: "Théâtre" },
{ id: 112, title: "Rêver j'en ai l'habitude", artist: "Molière le spectacle Musical", album: "Le_Bisounours_", duration: "3:17", cover: "Musique/Images/font111.png", audioUrl: "Musique/Musique112.mp3", genre: "Théâtre" },
{ id: 113, title: "À quoi ça rime", artist: "Molière le spectacle Musical", album: "Le_Bisounours_", duration: "2:36", cover: "Musique/Images/font111.png", audioUrl: "Musique/Musique113.mp3", genre: "Théâtre" },
{ id: 115, title: "Vise le sommet", artist: "Inazuma Eleven Ares ", album: "Le_Bisounours_", duration: "4:08", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique115.mp3", genre: "Opening" },
{ id: 116, title: "The Crusade of God", artist: "Inazuma Eleven", album: "Le_Bisounours_", duration: "2:26", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique116.mp3", genre: "Opening" },
{ id: 117, title: "Official Matches ", artist: "Inazuma Eleven", album: "Le_Bisounours_", duration: "2:22", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique117.mp3", genre: "Opening" },
{ id: 118, title: "Mou Hitori no Ace Striker", artist: "Inazuma Eleven", album: "Le_Bisounours_", duration: "2:25", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique118.mp3", genre: "Opening" },
{ id: 119, title: "Jounetsu de Mune Atsu!", artist: "Inazuma Eleven Go Chrono Stone", album: "Le_Bisounours_", duration: "4:44", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique119.mp3", genre: "Opening" },
{ id: 120, title: "Kandou Kyouyuu!", artist: "Inazuma Eleven Go Chrono Stone", album: "Le_Bisounours_", duration: "1:24", cover: "Musique/Images/font115.png", audioUrl: "Musique/Musique120.mp3", genre: "Opening" },
{ id: 121, title: "Vol. 2 Wild Pokemon Battle Theme", artist: "Pokémon Journeys", album: "Le_Bisounours_", duration: "1:48", cover: "Musique/Images/font121.png", audioUrl: "Musique/Musique121.mp3", genre: "OST" },
{ id: 122, title: "Washing Machine Heart", artist: "Mitski", album: "Le_Bisounours_", duration: "2:08", cover: "Musique/Images/font122.png", audioUrl: "Musique/Musique122.mp3", genre: "Rock Pop punk" },
{ id: 123, title: "Nothing At All", artist: "Nxdia", album: "Le_Bisounours_", duration: "2:40", cover: "Musique/Images/font123.png", audioUrl: "Musique/Musique123.mp3", genre: "Pop" },
{ id: 124, title: "Her", artist: "JVKE", album: "Le_Bisounours_", duration: "2:51", cover: "Musique/Images/font124.png", audioUrl: "Musique/Musique124.mp3", genre: "Pop" },
{ id: 125, title: "What About Me", artist: "Rex Orange County", album: "Le_Bisounours_", duration: "4:22", cover: "Musique/Images/font125.png", audioUrl: "Musique/Musique125.mp3", genre: "Pop" },
{ id: 126, title: "Baby Doll", artist: "Dominic Fike", album: "Le_Bisounours_", duration: "1:40", cover: "Musique/Images/font126.png", audioUrl: "Musique/Musique126.mp3", genre: "Alternative" },
{ id: 127, title: "En boucle", artist: "Adèle Castillon", album: "Le_Bisounours_", duration: "4:06", cover: "Musique/Images/font127.png", audioUrl: "Musique/Musique127.mp3", genre: "Pop" },
{ id: 128, title: "The Adults Are Talking", artist: "The Strokes", album: "Le_Bisounours_", duration: "4:47", cover: "Musique/Images/font128.png", audioUrl: "Musique/Musique128.mp3", genre: "New wave" },
{ id: 129, title: "Melodrama", artist: "Disiz & Théodora", album: "Le_Bisounours_", duration: "2:56", cover: "Musique/Images/font129.png", audioUrl: "Musique/Musique129.mp3", genre: "Alternative" },
{ id: 130, title: "Internet", artist: "Lenaïg", album: "Le_Bisounours_", duration: "3:09", cover: "Musique/Images/font130.png", audioUrl: "Musique/Musique130.mp3", genre: "Pop" },
{ id: 131, title: "J'veux que t'aies mal", artist: "Lenaïg", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font131.png", audioUrl: "Musique/Musique131.mp3", genre: "Pop" },
{ id: 132, title: "Tourner la page", artist: "Zaho", album: "Le_Bisounours_", duration: "4:26", cover: "Musique/Images/font132.png", audioUrl: "Musique/Musique132.mp3", genre: "Pop" },
{ id: 133, title: "What I've Done", artist: "Linkin Park", album: "Le_Bisounours_", duration: "3:27", cover: "Musique/Images/font133.png", audioUrl: "Musique/Musique133.mp3", genre: "Metal" },
{ id: 134, title: "In the end", artist: "Linkin Park", album: "Le_Bisounours_", duration: "3:44", cover: "Musique/Images/font134.png", audioUrl: "Musique/Musique134.mp3", genre: "Metal" },
{ id: 135, title: "Numb", artist: "Linkin Park", album: "Le_Bisounours_", duration: "3:07", cover: "Musique/Images/font135.png", audioUrl: "Musique/Musique135.mp3", genre: "Metal" },
{ id: 136, title: "Toxicity", artist: "System of a Down", album: "Le_Bisounours_", duration: "3:44", cover: "Musique/Images/font136.png", audioUrl: "Musique/Musique136.mp3", genre: "Metal" },
{ id: 137, title: "Chop Suey!", artist: "System of a Down", album: "Le_Bisounours_", duration: "3:28", cover: "Musique/Images/font137.png", audioUrl: "Musique/Musique137.mp3", genre: "Metal" },
{ id: 138, title: "Zombie", artist: "The Cranberries", album: "Le_Bisounours_", duration: "3:47", cover: "Musique/Images/font138.png", audioUrl: "Musique/Musique138.mp3", genre: "Rock" },
{ id: 139, title: "Set fire to the rain", artist: "Adele", album: "Le_Bisounours_", duration: "4:15", cover: "Musique/Images/font139.png", audioUrl: "Musique/Musique139.mp3", genre: "Pop" },
{ id: 140, title: "Frère flic", artist: "Tresko", album: "Le_Bisounours_", duration: "2:48", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique140.mp3", genre: "IA" },
{ id: 141, title: "Tyron dans la rue", artist: "Tresko", album: "Le_Bisounours_", duration: "2:43", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique141.mp3", genre: "IA" },
{ id: 142, title: "Nuit d'épouvante", artist: "Tresko", album: "Le_Bisounours_", duration: "3:11", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique142.mp3", genre: "IA" },
{ id: 143, title: "Frère Rookie", artist: "Tresko", album: "Le_Bisounours_", duration: "3:13", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique143.mp3", genre: "IA" },
{ id: 144, title: "Empire contre République", artist: "Tresko", album: "Le_Bisounours_", duration: "2:40", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique144.mp3", genre: "IA" },
{ id: 145, title: "Naissance d'une Légende", artist: "Tresko", album: "Le_Bisounours_", duration: "3:04", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique145.mp3", genre: "IA" },
{ id: 146, title: "Station Astromète", artist: "Tresko", album: "Le_Bisounours_", duration: "3:43", cover: "Musique/Images/font99.png", audioUrl: "Musique/Musique146.mp3", genre: "IA" },
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
};function AppContent() {

const { isDarkMode, currentTheme } = useTheme();
const { addToHistory, addListeningTime, sleepTimerActive, sleepTimerRemaining } = useMusic();
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
const [currentTrack, setCurrentTrack] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [showCreateSoundBoardModal, setShowCreateSoundBoardModal] = useState(false);
const [selectedSoundBoard, setSelectedSoundBoard] = useState(null);
const [showSoundBoardOptionsModal, setShowSoundBoardOptionsModal] = useState(false);
const CreateSoundBoardModal = ({ onClose, onCreate, onImport }) => {
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
const [soundBoardForOptions, setSoundBoardForOptions] = useState(null);
const [showEditSoundBoardModal, setShowEditSoundBoardModal] = useState(false);
const [soundBoardToEdit, setSoundBoardToEdit] = useState(null);
const [volume, setVolume] = useState(() => {
const saved = localStorage.getItem('spotizer-volume');
return saved !== null ? parseFloat(saved) : 0.05;
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
const [lastPlayTime, setLastPlayTime] = useState(0);const openSoundBoardOptionsModal = (board) => {
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
});if (!navigator.mediaSession._handlersSet) {
navigator.mediaSession.setActionHandler('play', () => { audioRef.current?.play(); setIsPlaying(true); });
navigator.mediaSession.setActionHandler('pause', () => { audioRef.current?.pause(); setIsPlaying(false); });
navigator.mediaSession.setActionHandler('previoustrack', previousTrack);
navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
navigator.mediaSession.setActionHandler('seekforward', () => { audioRef.current.currentTime += 10000; });
navigator.mediaSession.setActionHandler('seekbackward', () => { audioRef.current.currentTime -= 10000; });
navigator.mediaSession._handlersSet = true;
}
}
}, []);const nextTrack = useCallback(() => {
if (currentQueue.length === 0) return;
const currentIndex = currentQueue.findIndex(track => track.id === currentTrack?.id);
let nextIndex;if (isRepeatMode === 1) { nextIndex = (currentIndex + 1) % currentQueue.length; }else {
nextIndex = currentIndex + 1;
if (nextIndex >= currentQueue.length) {
if (isRepeatMode === 0) { setIsPlaying(false); setCurrentTrack(null); setCurrentTime(0); return; }
nextIndex = 0;
}
}if (currentQueue[nextIndex]) {
const nextTrackData = currentQueue[nextIndex];
setCurrentTrack(nextTrackData);
setIsPlaying(true);
setLastPlayTime(0);
addToHistory(nextTrackData);
updateMediaSessionMetadata(nextTrackData);const audio = audioRef.current;
if (audio) {
audio.oncanplaythrough = null;
audio.pause();
audio.volume = isMuted ? 0 : volume; audio.load();
audio.oncanplaythrough = () => { audio.play().catch(e => console.log('Erreur lecture piste suivante:', e)); };
}
}
}, [currentQueue, currentTrack, isRepeatMode, addToHistory, updateMediaSessionMetadata, isMuted, volume]);const previousTrack = useCallback(() => {
if (currentQueue.length === 0) return;
if (audioRef.current && currentTime > 3) { audioRef.current.currentTime = 0; return; }const currentIndex = currentQueue.findIndex(track => track.id === currentTrack?.id);
let prevIndex;if (isRepeatMode === 1) { prevIndex = currentIndex === 0 ? currentQueue.length - 1 : currentIndex - 1; }
else { prevIndex = currentIndex === 0 ? currentQueue.length - 1 : currentIndex - 1; }if (currentQueue[prevIndex]) {
const prevTrackData = currentQueue[prevIndex];
setCurrentTrack(prevTrackData);
setIsPlaying(true);
setLastPlayTime(0);
addToHistory(prevTrackData);
updateMediaSessionMetadata(prevTrackData);const audio = audioRef.current;
if (audio) {
audio.oncanplaythrough = null;
audio.pause();
audio.volume = isMuted ? 0 : volume; audio.load();
audio.oncanplaythrough = () => { audio.play().catch(e => console.log('Erreur lecture piste précédente:', e)); };
}
}
}, [currentQueue, currentTrack, isRepeatMode, addToHistory, updateMediaSessionMetadata, currentTime, isMuted, volume]);const playTrack = useCallback((track, playlist = null) => {
setCurrentTrack(track);
setIsPlaying(true);
setLastPlayTime(0);
addToHistory(track);
const sourceList = playlist?.tracks || selectedPlaylist?.tracks || musicDatabase;
if (isShuffleMode) {
const shuffledList = shuffleArray(sourceList);
const trackIndex = shuffledList.findIndex(t => t.id === track.id);
if (trackIndex > 0) { shuffledList.splice(trackIndex, 1); shuffledList.unshift(track); }
setCurrentQueue(shuffledList);
} else {
const orderedQueue = initializeQueue(track, sourceList);
setCurrentQueue(orderedQueue);
}
updateMediaSessionMetadata(track);const audio = audioRef.current;
if (audio) {
audio.oncanplaythrough = null;
audio.pause();
audio.volume = isMuted ? 0 : volume; audio.load();
audio.oncanplaythrough = () => { audio.play().catch(e => console.log('Erreur de lecture:', e)); };
}
}, [isShuffleMode, selectedPlaylist, addToHistory, shuffleArray, initializeQueue, updateMediaSessionMetadata, isMuted, volume]);useEffect(() => {
const audio = audioRef.current;
if (audio) { audio.volume = isMuted ? 0 : volume; }
localStorage.setItem('spotizer-volume', volume.toString());
}, [volume, isMuted]);useEffect(() => {
const savedPlaylists = localStorage.getItem('deezer-playlists');
if (savedPlaylists) { setPlaylists(JSON.parse(savedPlaylists)); } else { setPlaylists(defaultPlaylists); }
}, []);useEffect(() => {
if (playlists.length > 0) { localStorage.setItem('deezer-playlists', JSON.stringify(playlists)); }
}, [playlists]);useEffect(() => {
const audio = audioRef.current;
if (!audio) return;
const handleTimeUpdate = () => {
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
setCurrentTime(0);if (isRepeatMode === 2) { audio.currentTime = 0; audio.play(); setIsPlaying(true); }else { nextTrack(); } };
audio.addEventListener('timeupdate', handleTimeUpdate);
audio.addEventListener('durationchange', handleDurationChange);
audio.addEventListener('ended', handleEnded);
return () => {
audio.removeEventListener('timeupdate', handleTimeUpdate);
audio.removeEventListener('durationchange', handleDurationChange);
audio.removeEventListener('ended', handleEnded);
};
}, [currentTrack, isRepeatMode, lastPlayTime, addListeningTime, nextTrack]); const togglePlayPause = useCallback(() => {
if (!audioRef.current || !currentTrack) return;
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
const sourceList = selectedPlaylist?.tracks || musicDatabase;
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
    isEnabled: true
  });

const getRepeatIcon = () => {
switch (isRepeatMode) { case 0: return '🔁'; case 1: return '🔁📋'; case 2: return '🔂🎵'; default: return '🔁'; }
};
const getRepeatTitle = () => {
switch (isRepeatMode) { case 0: return 'Répétition désactivée'; case 1: return 'Répéter toute la playlist'; case 2: return 'Répéter la chanson actuelle'; default: return 'Répétition désactivée'; }
};const handleSearch = (query) => {
setSearchQuery(query);
if (query.trim()) {
const results = musicDatabase.filter(track =>
track.title.toLowerCase().includes(query.toLowerCase()) || track.artist.toLowerCase().includes(query.toLowerCase()) || track.album.toLowerCase().includes(query.toLowerCase()) || track.genre.toLowerCase().includes(query.toLowerCase())
);
setSearchResults(results);
} else {
setSearchResults([]);
}
};const createPlaylist = (name, description, cover) => {
const newPlaylist = { id: Date.now().toString(), name, description, cover: cover || "Musique/Images/favorite.png", tracks: [], isDefault: false };
setPlaylists([...playlists, newPlaylist]);
setShowCreatePlaylistModal(false);
};
const createPlaylistFromQueue = (name, description, tracks) => {
const newPlaylist = { id: Date.now().toString(), name, description, cover: tracks[0]?.cover || "Musique/Images/favorite.png", tracks: tracks, isDefault: false };
setPlaylists([...playlists, newPlaylist]);
};
const deletePlaylist = (playlistId) => {
if (window.confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
setPlaylists(playlists.filter(p => p.id !== playlistId));
if (selectedPlaylist?.id === playlistId) { setSelectedPlaylist(null); }
setShowPlaylistOptionsModal(false);
}
};
const addTrackToPlaylist = (playlistId, track) => {
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
alert(`Playlist "${newPlaylist.name}" importée avec succès!`);
};
const playPlaylist = (playlist) => {
if (playlist.tracks.length > 0) { setSelectedPlaylist(playlist); playTrack(playlist.tracks[0], playlist); }
};
const playPlaylistShuffle = (playlist) => {
if (playlist.tracks.length > 0) {
setSelectedPlaylist(playlist);
setIsShuffleMode(true);
const shuffledTracks = shuffleArray(playlist.tracks);
setCurrentQueue(shuffledTracks);
playTrack(shuffledTracks[0], playlist);
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
if (!currentQueue.find(t => t.id === track.id)) { setCurrentQueue([...currentQueue, track]); }
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
<div className={`App ${isDarkMode ? 'dark' : 'light'}`} style={themeStyle}>
{currentTrack && (
<audio
ref={audioRef}
src={currentTrack.audioUrl}
preload="auto"
/>
)}<div className="main-layout">
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
e.target.src = "https://media.discordapp.net/attachments/968955109155418132/1401255944725467136/TheStars.png";
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
</div>{}
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
{musicDatabase.slice(0, 150).map(track => ( 
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{
background: isDarkMode
? currentTheme.gradient
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
{musicDatabase.filter(track => ['Rock', 'Indie Rock', 'Pop Rock', 'Alternative Rock', 'Alternative', 'Indie'].includes(track.genre)).slice(0, 150).map(track => (
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{
background: isDarkMode
? currentTheme.gradient
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
<h2 className="section-title">Rap & Pop</h2>
<div className="grid grid-cols-6">
{musicDatabase.filter(track => ['Pop', 'Rap'].includes(track.genre)).slice(0, 150).map(track => (
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{
background: isDarkMode
? currentTheme.gradient
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
<h2 className="section-title">Anime & Film</h2>
<div className="grid grid-cols-6">
{musicDatabase.filter(track => ['Opening', 'Film', 'OST'].includes(track.genre)).slice(0, 150).map(track => (
<div
key={track.id}
className="card"
onClick={() => playTrack(track)}
style={{
background: isDarkMode
? currentTheme.gradient
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
<div className="genre-card genre-rap" onClick={() => handleSearch('Rap')}>
<h4 className="genre-name">Rap</h4>
</div>
<div className="genre-card genre-pop" onClick={() => handleSearch('Pop')}>
<h4 className="genre-name">Pop</h4>
</div>
<div className="genre-card genre-rock" onClick={() => handleSearch('Rock')}>
<h4 className="genre-name">Rock</h4>
</div>
<div className="genre-card genre-electronic" onClick={() => handleSearch('Electro')}>
<h4 className="genre-name">Electro</h4>
</div>
<div className="genre-card genre-altr" onClick={() => handleSearch('Alternative')}>
<h4 className="genre-name">Alternative</h4>
</div>
<div className="genre-card genre-hiphop" onClick={() => handleSearch('Opening')}>
<h4 className="genre-name">Opening</h4>
</div>
<div className="genre-card genre-film" onClick={() => handleSearch('Film')}>
<h4 className="genre-name">Film</h4>
</div>
<div className="genre-card genre-theatre" onClick={() => handleSearch('Théâtre')}>
<h4 className="genre-name">Théâtre</h4>
</div>
<div className="genre-card genre-remix" onClick={() => handleSearch('Remix')}>
<h4 className="genre-name">Remix</h4>
</div>
<div className="genre-card genre-ia" onClick={() => handleSearch('IA')}>
<h4 className="genre-name">IA</h4>
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
style={{ cursor: "pointer", background: currentTheme.gradient}}
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
style={{ cursor: "pointer", background: currentTheme.gradient}}
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
step="0.001"
value={isMuted ? 0 : volume}
onChange={(e) => setVolume(parseFloat(e.target.value))}
title="Volume (↑/↓)"
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
className="track-item history-track-item " 
onClick={() => onPlayTrack(entry)}
style={{ background: currentTheme.gradient }}
>
<div className="track-number" >{index + 1}</div>
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
<div className="play-count-badge">
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
<SoundBoardProvider>
<AppContent />
</SoundBoardProvider>
</MusicProvider>
</ThemeProvider>
);
}export default App;