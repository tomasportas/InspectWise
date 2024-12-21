import React from 'react';
import { nanoid } from 'nanoid';
import { X, Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useConfigurationStore } from '../../../store/configurationStore';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurationModal({ isOpen, onClose }: ConfigurationModalProps) {
  const [name, setName] = React.useState('');
  const [options, setOptions] = React.useState<string[]>([]);
  const [newOption, setNewOption] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const { configurations, addConfiguration, updateConfiguration, removeConfiguration } = 
    useConfigurationStore();

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && options.length > 0) {
      const configuration = {
        id: editingId || nanoid(),
        name,
        options,
      };

      if (editingId) {
        updateConfiguration(editingId, configuration);
      } else {
        addConfiguration(configuration);
      }

      setName('');
      setOptions([]);
      setNewOption('');
      setEditingId(null);
    }
  };

  const handleEdit = (config: typeof configurations[0]) => {
    setEditingId(config.id);
    setName(config.name);
    setOptions(config.options);
  };

  const handleCancel = () => {
    setName('');
    setOptions([]);
    setNewOption('');
    setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6">
          <div className="absolute right-4 top-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingId ? 'Edit Configuration' : 'Create Configuration'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Configuration Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Add new option"
                />
                <Button type="button" onClick={handleAddOption} disabled={!newOption.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2"
                  >
                    <span>{option}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={!name || options.length === 0}>
                {editingId ? 'Update' : 'Save'} Configuration
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Configurations</h3>
            <div className="space-y-4">
              {configurations.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{config.name}</h4>
                    <p className="text-sm text-gray-500">
                      {config.options.length} options
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(config)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => removeConfiguration(config.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}