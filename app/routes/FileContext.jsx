// app/context/FileContext.jsx
import { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export function FileProvider({ children }) {
  const [savedItems, setSavedItems] = useState([]);

  const saveItem = (file, product) => {
    setSavedItems((prev) => [...prev, { file, product, id: Date.now() }]);
  };

  return (
    <FileContext.Provider value={{ savedItems, saveItem }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  return useContext(FileContext);
}