import { useState } from 'react';

interface IconPickerProps {
    selectedIcon: string;
    onSelect: (icon: string) => void;
    onClose: () => void;
}

const HABIT_ICONS = [
    { name: 'fitness_center', label: 'Fitness' },
    { name: 'auto_stories', label: 'Reading' },
    { name: 'self_improvement', label: 'Meditation' },
    { name: 'water_drop', label: 'Water' },
    { name: 'restaurant', label: 'Healthy Eating' },
    { name: 'bedtime', label: 'Sleep' },
    { name: 'directions_run', label: 'Running' },
    { name: 'pool', label: 'Swimming' },
    { name: 'spa', label: 'Wellness' },
    { name: 'music_note', label: 'Music' },
    { name: 'palette', label: 'Art' },
    { name: 'code', label: 'Coding' },
    { name: 'language', label: 'Language' },
    { name: 'school', label: 'Study' },
    { name: 'lightbulb', label: 'Ideas' },
    { name: 'eco', label: 'Environment' },
    { name: 'volunteer_activism', label: 'Volunteering' },
    { name: 'favorite', label: 'Gratitude' },
    { name: 'local_cafe', label: 'Coffee' },
    { name: 'nightlight', label: 'Night Routine' },
    { name: 'wb_sunny', label: 'Morning Routine' },
    { name: 'face_retouching_natural', label: 'Skincare' },
    { name: 'psychology', label: 'Mental Health' },
    { name: 'nature_people', label: 'Outdoors' },
];

function IconPicker({ selectedIcon, onSelect, onClose }: IconPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredIcons = HABIT_ICONS.filter(icon =>
        icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl animate-slide-up max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Choose an Icon</h2>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">close</span>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Icon Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-4 gap-3">
                        {filteredIcons.map((icon) => (
                            <button
                                key={icon.name}
                                onClick={() => {
                                    onSelect(icon.name);
                                    onClose();
                                }}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all ${selectedIcon === icon.name
                                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-3xl">{icon.name}</span>
                                <span className="text-xs font-medium text-center leading-tight">{icon.label}</span>
                            </button>
                        ))}
                    </div>

                    {filteredIcons.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-5xl mb-2">search_off</span>
                            <p className="text-sm">No icons found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IconPicker;
