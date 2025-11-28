import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTheme } from '../contexts/ThemeContext';const QueuePanel = ({
isOpen,
onClose,
queue,
currentTrack,
onReorder,
onRemove,
onPlay,
onSaveAsPlaylist,
onClearQueue
}) => {
const { isDarkMode, currentTheme } = useTheme();const handleDragEnd = (result) => {
if (!result.destination) return;
onReorder(result.source.index, result.destination.index);
};if (!isOpen) return null;const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
const upcomingTracks = queue.slice(currentIndex + 1);return (
<div className={`queue-panel ${isDarkMode ? 'dark' : 'light'}`}>
<div className="queue-header">
<h3>File d'attente</h3>
<div className="queue-actions">
<button 
className="queue-action-btn"
onClick={onClearQueue}
title="Vider la file d'attente"
>
🗑️
</button>
<button className="queue-close-btn" onClick={onClose}>✕</button>
</div>
</div>{currentTrack && (
<div className="queue-now-playing">
<h4>En cours de lecture</h4>
<div className="queue-current-track" style={{ borderColor: currentTheme.primary }}>
<img src={currentTrack.cover} alt={currentTrack.title} />
<div className="queue-track-info">
<span className="queue-track-title">{currentTrack.title}</span>
<span className="queue-track-artist">{currentTrack.artist}</span>
</div>
<span className="now-playing-icon" style={{ color: currentTheme.primary }}>🎵</span>
</div>
</div>
)}<div className="queue-upcoming">
<h4>À suivre ({upcomingTracks.length})</h4>

{upcomingTracks.length === 0 ? (
<p className="queue-empty">Aucune musique dans la file d'attente</p>
) : (
<DragDropContext onDragEnd={handleDragEnd}>
<Droppable droppableId="queue">
{(provided) => (
<div
className="queue-list"
{...provided.droppableProps}
ref={provided.innerRef}
>
{upcomingTracks.map((track, index) => (
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
className={`queue-item ${snapshot.isDragging ? 'dragging' : ''}`}
style={{
...provided.draggableProps.style,
borderLeft: snapshot.isDragging ? `3px solid ${currentTheme.primary}` : 'none'
}}
>
<span className="drag-handle">⋮⋮</span>
<span className="queue-item-number">{index + 1}</span>
<img src={track.cover} alt={track.title} className="queue-item-cover" />
<div className="queue-item-info">
<span className="queue-item-title">{track.title}</span>
<span className="queue-item-artist">{track.artist}</span>
</div>
<button 
className="queue-item-play"
onClick={() => onPlay(track)}
style={{ color: currentTheme.primary }}
>
▶
</button>
<button 
className="queue-item-remove"
onClick={() => onRemove(currentIndex + 1 + index)}
>
✕
</button>
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
);
};export default QueuePanel;
