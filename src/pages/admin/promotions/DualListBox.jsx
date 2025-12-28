// components/admin/DualListBox.jsx
import { useState, useMemo } from "react";

export default function DualListBox({
  availableItems,
  selectedItems,
  setSelectedItems,
  idKey = "id",
  nameKey = "name",
  imageKey = "images",
  skuKey = "sku",
  height = "400px",
  disabled = false,
}) {
  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchSelected, setSearchSelected] = useState("");

  const filteredAvailable = useMemo(() => {
    return availableItems
      .filter((a) => !selectedItems.some((s) => s[idKey] === a[idKey]))
      .filter(
        (a) =>
          a[nameKey].toLowerCase().includes(searchAvailable.toLowerCase()) ||
          a[idKey].toString().includes(searchAvailable)
      );
  }, [availableItems, selectedItems, searchAvailable]);

  const filteredSelected = useMemo(() => {
    return selectedItems.filter(
      (s) =>
        s[nameKey].toLowerCase().includes(searchSelected.toLowerCase()) ||
        s[idKey].toString().includes(searchSelected)
    );
  }, [selectedItems, searchSelected]);

  const selectItem = (item) => {
    if (!disabled) setSelectedItems([...selectedItems, item]);
  };

  const removeItem = (item) => {
    if (!disabled)
      setSelectedItems(selectedItems.filter((s) => s[idKey] !== item[idKey]));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Available */}
      <div>
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={searchAvailable}
          onChange={(e) => setSearchAvailable(e.target.value)}
          className="w-full mb-2 p-2 rounded-xl border border-gray-300"
        />
        <div className={`border rounded-xl overflow-y-auto`} style={{ height }}>
          {filteredAvailable.length ? (
            filteredAvailable.map((item) => (
              <div
                key={item[idKey]}
                onClick={() => selectItem(item)}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded"
              >
                {imageKey && item[imageKey]?.[0] && (
                  <img
                    src={item[imageKey][0]}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {item[nameKey]} (ID: {item[idKey]})
                  </p>
                  {skuKey && item[skuKey] && (
                    <p className="text-xs text-gray-500">SKU: {item[skuKey]}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-400 text-sm">No items found</p>
          )}
        </div>
      </div>

      {/* Selected */}
      <div>
        <input
          type="text"
          placeholder="Search Selected"
          value={searchSelected}
          onChange={(e) => setSearchSelected(e.target.value)}
          className="w-full mb-2 p-2 rounded-xl border border-gray-300"
        />
        <div className={`border rounded-xl overflow-y-auto`} style={{ height }}>
          {filteredSelected.length ? (
            filteredSelected.map((item) => (
              <div
                key={item[idKey]}
                className="flex items-center gap-2 p-2 hover:bg-red-100 rounded"
              >
                {imageKey && item[imageKey]?.[0] && (
                  <img
                    src={item[imageKey][0]}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {item[nameKey]} (ID: {item[idKey]})
                  </p>
                </div>
                {!disabled && (
                  <button
                    onClick={() => removeItem(item)}
                    className="text-red-500 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-400 text-sm">No selected items</p>
          )}
        </div>
      </div>
    </div>
  );
}
