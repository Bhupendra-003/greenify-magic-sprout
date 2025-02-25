
export const getStoredData = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

export const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeStoredData = (key: string): void => {
  localStorage.removeItem(key);
};

// Initialize data from JSON files
export const initializeData = () => {
  if (!localStorage.getItem('usersData')) {
    import('../data/users.json').then(usersData => {
      setStoredData('usersData', usersData);
    });
  }

  if (!localStorage.getItem('issuesData')) {
    import('../data/issues.json').then(issuesData => {
      setStoredData('issuesData', issuesData);
    });
  }
};
