// src/components/expenses/TagInput.tsx
import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmed = input.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
            setInput('');
        }
    };

    const removeTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-input-light dark:bg-input-dark min-h-[56px]">
            <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">
                label
            </span>
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-sm font-medium"
                >
                    {tag}
                    <button
                        onClick={() => removeTag(index)}
                        className="flex items-center justify-center size-4 hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={tags.length === 0 ? "Add tags..." : ""}
                className="flex-1 bg-transparent border-none focus:outline-none min-w-[80px] text-sm"
            />
        </div>
    );
}
