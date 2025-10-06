import React from "react";
import { FileText, X, Check } from "lucide-react";

const DetailModalSplit = ({
  show,
  detailModalData,
  getThemeClasses,
  closeDetailModal,
  updateDetailDescription,
  newChecklistItem,
  setNewChecklistItem,
  toggleChecklistItem,
  removeChecklistItem,
  addChecklistItem,
  saveDetailModal,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${getThemeClasses.background} ${getThemeClasses.border} border rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden`}>
        <div className={`${getThemeClasses.subtaskBackground} px-6 py-4 border-b ${getThemeClasses.border} flex items-center justify-between`}>
          <h2 className={`text-xl font-semibold ${getThemeClasses.text} flex items-center gap-2`}>
            <FileText className="w-5 h-5" />
            {detailModalData.title}
          </h2>
          <button onClick={closeDetailModal} className={`p-2 rounded-lg ${getThemeClasses.buttonSecondary} hover:bg-gray-200 dark:hover:bg-gray-600`}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <label className={`block text-sm font-medium ${getThemeClasses.text} mb-2`}>Description</label>
            <textarea
              value={detailModalData.description}
              onChange={(e) => updateDetailDescription(e.target.value)}
              placeholder="Add a detailed description..."
              className={`w-full h-32 p-3 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses.text} mb-2`}>Checklist</label>
            <div className="space-y-2 mb-4">
              {detailModalData.checklist.map((item) => (
                <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg ${getThemeClasses.subtaskBackground} ${getThemeClasses.border} border`}>
                  <button
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center ${
                      item.completed ? "bg-green-500 border-green-500 text-white" : `border-gray-300 dark:border-gray-600 ${getThemeClasses.background} hover:border-green-400`}`}
                  >
                    {item.completed && <Check className="w-3 h-3" />}
                  </button>
                  <span className={`flex-1 ${item.completed ? `line-through ${getThemeClasses.textMuted}` : getThemeClasses.text}`}>
                    {item.text}
                  </span>
                  <button onClick={() => removeChecklistItem(item.id)} className={`flex-shrink-0 p-1 rounded ${getThemeClasses.buttonSecondary} hover:bg-red-100 dark:hover:bg-red-900 text-red-500`}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addChecklistItem()}
                placeholder="Add checklist item..."
                className={`flex-1 px-3 py-2 border rounded-lg ${getThemeClasses.inputBackground} ${getThemeClasses.inputBorder} ${getThemeClasses.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500`}
              />
              <button onClick={addChecklistItem} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add</button>
            </div>
          </div>
        </div>
        <div className={`${getThemeClasses.subtaskBackground} px-6 py-4 border-t ${getThemeClasses.border} flex justify-end gap-3`}>
          <button onClick={closeDetailModal} className={`px-4 py-2 ${getThemeClasses.buttonSecondary} hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium`}>
            Cancel
          </button>
          <button onClick={saveDetailModal} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModalSplit;


