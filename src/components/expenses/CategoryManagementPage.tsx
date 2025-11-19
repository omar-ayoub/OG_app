// src/components/expenses/CategoryManagementPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../../contexts/useExpenses';
import { type ExpenseCategory } from '../../types';

export default function CategoryManagementPage() {
    const navigate = useNavigate();
    const { categories, addCategory, updateCategory, deleteCategory } = useExpenses();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editIcon, setEditIcon] = useState('category');
    const [editColor, setEditColor] = useState('#3B82F6');
    const [isAdding, setIsAdding] = useState(false);

    // Common icons for categories
    const ICONS = [
        'shopping_cart', 'restaurant', 'directions_bus', 'movie',
        'shopping_bag', 'local_hospital', 'bolt', 'more_horiz',
        'flight', 'school', 'pets', 'sports_esports', 'fitness_center',
        'work', 'home', 'build', 'local_gas_station', 'local_cafe'
    ];

    // Common colors
    const COLORS = [
        '#EF4444', '#F97316', '#F59E0B', '#10B981',
        '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
        '#6B7280', '#000000'
    ];

    const handleStartEdit = (category: ExpenseCategory) => {
        setIsEditing(category.id);
        setEditName(category.name);
        setEditIcon(category.icon);
        setEditColor(category.color);
        setIsAdding(false);
    };

    const handleStartAdd = () => {
        setIsAdding(true);
        setIsEditing(null);
        setEditName('');
        setEditIcon('category');
        setEditColor('#3B82F6');
    };

    const handleSave = () => {
        if (!editName.trim()) return;

        if (isAdding) {
            addCategory({
                name: editName.trim(),
                icon: editIcon,
                color: editColor,
                isCustom: true
            });
            setIsAdding(false);
        } else if (isEditing) {
            updateCategory(isEditing, {
                name: editName.trim(),
                icon: editIcon,
                color: editColor
            });
            setIsEditing(null);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(id);
        }
    };

    return (
        <div className="page-container">
            <header className="app-bar">
                <div className="flex items-center justify-between pb-2">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="heading-page flex-1 text-center">Manage Categories</h1>
                    <div className="size-10" />
                </div>
            </header>

            <main className="content-main pb-24">
                {/* Add New Button */}
                {!isAdding && !isEditing && (
                    <button
                        onClick={handleStartAdd}
                        className="btn-primary w-full mb-6 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add New Category
                    </button>
                )}

                {/* Edit/Add Form */}
                {(isAdding || isEditing) && (
                    <div className="card mb-6 border-2 border-primary/20">
                        <h3 className="heading-section mb-4">
                            {isAdding ? 'New Category' : 'Edit Category'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-light-secondary mb-1 block">Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="input-field w-full"
                                    placeholder="Category Name"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-text-light-secondary mb-1 block">Icon</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {ICONS.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setEditIcon(icon)}
                                            className={`flex items-center justify-center p-2 rounded-lg transition-all ${editIcon === icon
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-text-light-secondary'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-xl">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-text-light-secondary mb-1 block">Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setEditColor(color)}
                                            className={`size-8 rounded-full transition-transform ${editColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setIsAdding(false);
                                        setIsEditing(null);
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!editName.trim()}
                                    className="btn-primary flex-1"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories List */}
                <div className="space-y-3">
                    {categories.map(category => (
                        <div key={category.id} className="card flex items-center gap-4">
                            <div
                                className="flex items-center justify-center size-12 rounded-full"
                                style={{ backgroundColor: `${category.color}20` }}
                            >
                                <span className="material-symbols-outlined" style={{ color: category.color }}>
                                    {category.icon}
                                </span>
                            </div>

                            <div className="flex-1">
                                <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                                    {category.name}
                                </p>
                                {category.isCustom && (
                                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                        Custom
                                    </span>
                                )}
                            </div>

                            {category.isCustom && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStartEdit(category)}
                                        className="p-2 text-text-light-secondary hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 text-text-light-secondary hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
